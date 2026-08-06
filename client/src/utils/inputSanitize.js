// Strips characters as the user types — real-time input restriction to match
// the backend validation on User, RegistrationInquiry, and ContactMessage.
// Only for structural data fields (names, phone numbers) — never applied to
// CMS/Site Content fields, which intentionally allow any input.

// Letters (including accented characters), spaces, hyphens, and apostrophes only.
export function sanitizeNameInput(value) {
  return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
}

// Digits only, capped at 10 characters (a full North American phone number).
export function sanitizePhoneInput(value) {
  return value.replace(/\D/g, '').slice(0, 10);
}
