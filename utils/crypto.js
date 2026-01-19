import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.ENCRYPTION_KEY;

// Check if key exists during build time
if (!KEY || KEY.length !== 64) {
  // Note: hex string of 64 chars = 32 bytes
  throw new Error("ENCRYPTION_KEY must be a 32-byte hex string (64 chars).");
}

export function encrypt(text) {
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Return IV:EncryptedData
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}