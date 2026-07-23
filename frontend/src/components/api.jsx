// Uses VITE_API_URL when set (e.g. in production on Render),
// falls back to localhost for local dev.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- token storage --------------------------------------------------------
// Your own YOKAI audit flagged JWT-in-localStorage as an XSS risk — same
// tradeoff applies here. This keeps it simple for local dev; if you want the
// safer version later, move refresh_token into an httpOnly cookie set by the
// backend and keep only the access_token in memory (a React context), not
// localStorage.
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

function setTokens({ access_token, refresh_token }) {
  localStorage.setItem(ACCESS_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// --- error helper ----------------------------------------------------------
async function handleResponse(res) {
  if (!res.ok) {
    let detail = "Something went wrong";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // response wasn't JSON, keep the default message
    }
    throw new Error(detail);
  }
  return res.json();
}

// --- auth calls --------------------------------------------------------------
export async function signup({ username, email, password }) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  setTokens(data);
  return data;
}

export async function refreshAccessToken() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  const data = await handleResponse(res);
  localStorage.setItem(ACCESS_KEY, data.access_token);
  return data.access_token;
}

// --- authenticated fetch, retries once on a 401 by refreshing -------------
export async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const doFetch = (accessToken) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });

  let res = await doFetch(token);

  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      res = await doFetch(newToken);
    } catch {
      clearTokens();
      throw new Error("Session expired — please log in again");
    }
  }

  return handleResponse(res);
}

export async function forgotPassword({ email }) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function resetPassword({ token, new_password }) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password }),
  });
  return handleResponse(res);
}