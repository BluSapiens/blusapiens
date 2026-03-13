export const ADMIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function adminRequest(path: string, init: RequestInit = {}) {
  return fetch(`${ADMIN_API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export async function getAdminSession() {
  const response = await adminRequest("/api/admin/me", {
    method: "GET",
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.admin ?? null;
}
