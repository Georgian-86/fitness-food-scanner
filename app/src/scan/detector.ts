// Barcode decoding: native BarcodeDetector when available (Android Chrome), else a
// lazily loaded @zxing/browser fallback. Only retail 1D formats are needed.

export const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'] as const;

interface DetectedBarcode { rawValue: string; format: string }
interface NativeDetector { detect(src: CanvasImageSource): Promise<DetectedBarcode[]> }
interface NativeDetectorCtor {
  new (opts: { formats: string[] }): NativeDetector;
  getSupportedFormats?: () => Promise<string[]>;
}

export type CameraProblem = 'insecure' | 'no_camera' | 'denied' | 'error';

export class CameraError extends Error {
  constructor(public problem: CameraProblem, message?: string) {
    super(message ?? problem);
  }
}

export interface ScanSession { stop(): void }

function nativeCtor(): NativeDetectorCtor | null {
  const C = (globalThis as unknown as { BarcodeDetector?: NativeDetectorCtor }).BarcodeDetector;
  return typeof C === 'function' ? C : null;
}

async function makeNativeDetector(): Promise<NativeDetector | null> {
  const C = nativeCtor();
  if (!C) return null;
  try {
    const supported = C.getSupportedFormats ? await C.getSupportedFormats() : [...FORMATS];
    const formats = FORMATS.filter((f) => supported.includes(f));
    if (formats.length === 0) return null;
    return new C({ formats });
  } catch {
    return null;
  }
}

export function cameraAvailability(): CameraProblem | null {
  if (typeof window === 'undefined') return 'error';
  if (!window.isSecureContext) return 'insecure';
  if (!navigator.mediaDevices?.getUserMedia) return 'no_camera';
  return null;
}

function toCameraError(e: unknown): CameraError {
  const name = (e as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'SecurityError') return new CameraError('denied');
  if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'NotReadableError')
    return new CameraError('no_camera');
  return new CameraError('error', e instanceof Error ? e.message : String(e));
}

export function stopStream(stream: MediaStream | null | undefined): void {
  stream?.getTracks().forEach((t) => t.stop());
}

/** Start the rear camera into `video` and call onCode once with the first decoded barcode. */
export async function startScan(video: HTMLVideoElement, onCode: (code: string) => void): Promise<ScanSession> {
  const problem = cameraAvailability();
  if (problem) throw new CameraError(problem);

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
  } catch (e) {
    throw toCameraError(e);
  }

  let stopped = false;
  let done = false;
  let raf = 0;
  let zxingControls: { stop(): void } | null = null;

  const emit = (code: string) => {
    if (done || stopped) return;
    done = true;
    onCode(code);
  };

  const session: ScanSession = {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      zxingControls?.stop();
      stopStream(stream);
      video.srcObject = null;
    },
  };

  video.srcObject = stream;
  video.setAttribute('playsinline', 'true');
  video.muted = true;
  try {
    await video.play();
  } catch {
    /* autoplay may reject; frames still arrive on most browsers */
  }

  const native = await makeNativeDetector();
  if (native) {
    let busy = false;
    const tick = async () => {
      if (stopped || done) return;
      if (!busy && video.readyState >= 2) {
        busy = true;
        try {
          const found = await native.detect(video);
          const hit = found.find((b) => /^\d{6,14}$/.test(b.rawValue));
          if (hit) emit(hit.rawValue);
        } catch {
          /* transient detect error */
        } finally {
          busy = false;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return session;
  }

  // Fallback: ZXing, loaded only when needed.
  try {
    const { BrowserMultiFormatReader } = await import('@zxing/browser');
    if (stopped) return session;
    const reader = new BrowserMultiFormatReader();
    zxingControls = await reader.decodeFromStream(stream, video, (result) => {
      if (result) emit(result.getText());
    });
    if (stopped) zxingControls.stop();
  } catch (e) {
    session.stop();
    throw new CameraError('error', e instanceof Error ? e.message : String(e));
  }
  return session;
}
