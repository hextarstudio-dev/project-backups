/**
 * Wave 4 - File Signature Validation (Magic Bytes)
 * Verifies file type by checking binary signatures instead of trusting MIME types
 */

// File signatures (magic bytes) for supported formats
const FILE_SIGNATURES: Record<string, (number | null)[][]> = {
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
  ],
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF, 0xE0],
    [0xFF, 0xD8, 0xFF, 0xE1],
    [0xFF, 0xD8, 0xFF, 0xE2],
    [0xFF, 0xD8, 0xFF, 0xE3],
    [0xFF, 0xD8, 0xFF, 0xE8]
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]  // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50] // RIFF....WEBP
  ],
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46, 0x2D] // %PDF-
  ]
};

/**
 * Verify file signature matches expected MIME type
 * @param buffer ArrayBuffer or Uint8Array of file data
 * @param mimeType Expected MIME type
 * @returns true if signature matches, false otherwise
 */
export function verifyFileSignature(buffer: ArrayBuffer | Uint8Array, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) {
    console.warn(`[FileSignature] No signature defined for MIME type: ${mimeType}`);
    return false;
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  // Check if any signature matches
  for (const signature of signatures) {
    if (matchesSignature(bytes, signature)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if byte array matches a signature
 * @param bytes File bytes
 * @param signature Signature pattern (null = wildcard)
 */
function matchesSignature(bytes: Uint8Array, signature: (number | null)[]): boolean {
  if (bytes.length < signature.length) {
    return false;
  }

  for (let i = 0; i < signature.length; i++) {
    const signatureByte = signature[i];
    // null means wildcard (any byte matches)
    if (signatureByte !== null && bytes[i] !== signatureByte) {
      return false;
    }
  }

  return true;
}

/**
 * Detect MIME type from file signature
 * @param buffer ArrayBuffer or Uint8Array of file data
 * @returns Detected MIME type or null if unknown
 */
export function detectMimeType(buffer: ArrayBuffer | Uint8Array): string | null {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      if (matchesSignature(bytes, signature)) {
        return mimeType;
      }
    }
  }

  return null;
}

/**
 * Get supported MIME types
 */
export function getSupportedMimeTypes(): string[] {
  return Object.keys(FILE_SIGNATURES);
}

/**
 * Validate uploaded file
 * @param file File or Buffer
 * @param expectedMimeType Expected MIME type from Content-Type header
 * @returns Validation result
 */
export async function validateUploadedFile(
  file: Buffer | ArrayBuffer,
  expectedMimeType: string
): Promise<{ valid: boolean; detectedType: string | null; error?: string }> {
  const buffer = file instanceof Buffer ? new Uint8Array(file) : new Uint8Array(file);

  // Detect actual file type
  const detectedType = detectMimeType(buffer);

  if (!detectedType) {
    return {
      valid: false,
      detectedType: null,
      error: 'Could not detect file type from signature'
    };
  }

  // Verify detected type matches expected type
  if (detectedType !== expectedMimeType) {
    return {
      valid: false,
      detectedType,
      error: `File signature mismatch: expected ${expectedMimeType}, detected ${detectedType}`
    };
  }

  return {
    valid: true,
    detectedType
  };
}
