/** GS1 check digit for the given digits (without the check digit). */
export function gs1CheckDigit(body: string): number {
  let sum = 0;
  // weights alternate 3,1,3,... starting from the rightmost body digit
  for (let i = body.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += Number(body[i]) * w;
  }
  return (10 - (sum % 10)) % 10;
}

/** Valid EAN-13 / EAN-8 / UPC-A (12) with a correct check digit. */
export function isValidGtin(code: string): boolean {
  if (!/^(\d{8}|\d{12}|\d{13})$/.test(code)) return false;
  return gs1CheckDigit(code.slice(0, -1)) === Number(code[code.length - 1]);
}

export function isValidEan13(code: string): boolean {
  return /^\d{13}$/.test(code) && isValidGtin(code);
}

/** Loose check for user-typed barcodes: 6–14 digits. */
export function looksLikeBarcode(code: string): boolean {
  return /^\d{6,14}$/.test(code);
}
