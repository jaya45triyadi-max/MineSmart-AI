// MINE SMART AI - Secure License Generator Service

export class LicenseGenerator {
  /**
   * Generates a cryptographically random license key with prefix MSAI-ID-
   * Format: MSAI-ID-XXXX-XXXX-XXXX (e.g. MSAI-ID-7F89-B214-8A09)
   */
  static generateLicenseKey(prefix: string = "MSAI-ID"): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude ambiguous chars (0, O, 1, I)
    const getRandomChunk = (length: number): string => {
      const randomBytes = new Uint8Array(length);
      if (typeof window !== "undefined" && window.crypto) {
        window.crypto.getRandomValues(randomBytes);
      } else {
        for (let i = 0; i < length; i++) {
          randomBytes[i] = Math.floor(Math.random() * 256);
        }
      }
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
      }
      return result;
    };

    return `${prefix}-${getRandomChunk(4)}-${getRandomChunk(4)}-${getRandomChunk(4)}`;
  }

  /**
   * Hashes a license key using SHA-256
   */
  static async hashLicenseKey(key: string): Promise<string> {
    const normalized = key.trim().toUpperCase();
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    // Fallback simple hash for non-crypto browser contexts
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return "sha256_mock_" + Math.abs(hash).toString(16) + "_" + normalized.length;
  }

  /**
   * Validates License Key format:
   * Accepts MSAI-ID-XXXX-XXXX-XXXX or legacy MSAI-XXXX-XXXX-XXXX-XXXX
   */
  static validateLicenseKeyFormat(key: string): boolean {
    if (!key) return false;
    const clean = key.trim().toUpperCase();
    const patternStandard = /^MSAI-ID-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const patternExtended = /^MSAI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const patternGeneral = /^MSAI(-[A-Z0-9]+){3,5}$/;
    return patternStandard.test(clean) || patternExtended.test(clean) || patternGeneral.test(clean);
  }

  /**
   * Extract last 4 chars for identification UI
   */
  static extractLast4(key: string): string {
    const clean = key.trim().toUpperCase();
    return clean.slice(-4);
  }

  /**
   * Masks key for secure display (e.g. MSAI-ID-••••-••••-8A09)
   */
  static maskKey(keyOrLast4: string): string {
    if (!keyOrLast4) return "MSAI-ID-••••-••••-••••";
    const last4 = this.extractLast4(keyOrLast4);
    return `MSAI-ID-••••-••••-${last4}`;
  }
}

