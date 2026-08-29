const TOKEN_KEY = "marketplace_token";

export function setAuthToken(token) {
  if (!token) return;

  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
