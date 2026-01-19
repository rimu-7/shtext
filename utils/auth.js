import "server-only";

// Load keys into a Set for O(1) lookup
const VALID_KEYS = new Set(
  (process.env.API_SECRET_KEYS || "").split(",").map((key) => key.trim())
);

export function isAuthenticated(req) {
  // Check header 'x-api-key'
  const apiKey = req.headers.get("x-api-key");
  
  if (apiKey && VALID_KEYS.has(apiKey)) {
    return { success: true, key: apiKey };
  }
  
  return { success: false };
}