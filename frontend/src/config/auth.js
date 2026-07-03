export function isTokenValid(token = localStorage.getItem("token")) {
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Date.now() / 1000;
    return Boolean(decoded.exp && decoded.exp > now);
  } catch (error) {
    console.error("Invalid token format", error);
    return false;
  }
}

export function hasValidSession() {
  return isTokenValid();
}

export function getAuthHeaders(baseHeaders = {}, { requireAuth = false } = {}) {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    if (requireAuth) {
      throw new Error("Unauthorized");
    }

    return baseHeaders;
  }

  return {
    ...baseHeaders,
    Authorization: `Bearer ${token}`,
  };
}