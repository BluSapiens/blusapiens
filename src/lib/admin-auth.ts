import type { PaginationMeta } from "@/blog/utils/types";

export const ADMIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AdminBlogCat = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  count?: number;
};

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  publishDate: string | null;
  readingTime: string;
  tags: string[];
  headings: string[];
  faqs: Array<{ id?: string; question: string; answer: string; order: number }>;
  author: string;
  cat: {
    id: string;
    name: string;
    slug: string;
  };
};

type JsonInit = RequestInit & {
  body?: BodyInit | null;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
}

export async function adminRequest(path: string, init: JsonInit = {}) {
  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${ADMIN_API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

export async function loginAdmin(input: { email: string; password: string }) {
  const response = await adminRequest("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const payload = await readJson<{ admin: AdminSession }>(response);
  return payload.admin;
}

export async function logoutAdmin() {
  const response = await adminRequest("/api/admin/logout", {
    method: "POST",
  });

  return readJson<{ success: boolean; message?: string }>(response);
}

export async function getAdminSession() {
  const response = await adminRequest("/api/admin/me", {
    method: "GET",
  });

  if (response.status === 401) {
    return null;
  }

  const payload = await readJson<{ admin: AdminSession }>(response);
  return payload.admin;
}

export async function getAdminBlogPosts(params: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  catId?: string;
}) {
  const search = new URLSearchParams();

  if (params.page) {
    search.set("page", String(params.page));
  }

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.status) {
    search.set("status", params.status);
  }

  if (params.catId) {
    search.set("catId", params.catId);
  }

  const response = await adminRequest(`/api/admin/blog/posts?${search.toString()}`, {
    method: "GET",
  });

  return readJson<{ items: AdminBlogPost[]; meta: PaginationMeta }>(response);
}

export async function getAdminBlogCats() {
  const response = await adminRequest("/api/admin/blog/cats", {
    method: "GET",
  });

  const payload = await readJson<{ items: AdminBlogCat[] }>(response);
  return payload.items;
}
