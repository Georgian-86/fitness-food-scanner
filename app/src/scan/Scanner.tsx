import { useEffect, useRef, useState } from 'react';
import { CameraError, type CameraProblem, type ScanSession, startScan } from './detector';

const MESSAGES: Record<CameraProblem, string> = {
  insecure: 'The camera only works on a secure (https) page. Type the barcode below instead.',
  no_camera: 'No camera found on this device. Type the barcode below instead.',
  denied: 'Camera permission was refused. Allow it in your browser settings, or type the barcode below.',
  error: 'Could not start the camera. Type the barcode below instead.',
};

interface Props {
  onDetected: (code: string) => void;
  onClose: () => void;
}

export default function Scanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [problem, setProblem] = useState<CameraProblem | null>(null);
  const [starting, setStarting] = useState(true);
  const cb = useRef(onDetected);
  cb.current = onDetected;

  useEffect(() => {
    let session: ScanSession | null = null;
    let cancelled = false;
    const video = videoRef.current;
    if (!video) return;
    startScan(video, (code) => {
      session?.stop();
      cb.current(code);
    })
      .then((s) => {
        if (cancelled) s.stop();
        else session = s;
      })
      .catch((e: unknown) => {
        if (!cancelled) setProblem(e instanceof CameraError ? e.problem : 'error');
      })
      .finally(() => {
        if (!cancelled) setStarting(false);
      });
    return () => {
      cancelled = true;
      session?.stop();
    };
  }, []);

  return (
    <section className="scanner" aria-label="Barcode scanner">
      {problem ? (
        <p className="notice" role="alert" data-testid="camera-problem">{MESSAGES[problem]}</p>
      ) : (
        <div className="scanner-view">
          <video ref={videoRef} muted playsInline aria-label="Camera preview" />
          <div className="scanner-frame" aria-hidden="true" />
          <p className="scanner-hint">{starting ? 'Starting camera…' : 'Point at the barcode on the pack'}</p>
        </div>
      )}
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Close camera
      </button>
    </section>
  );
}
