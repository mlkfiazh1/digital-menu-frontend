const USER_API_URL = import.meta.env.VITE_USER_API_URL;
const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(baseUrl, path, { method, token, body, formData } = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body && !formData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: method ?? (body || formData ? "POST" : "GET"),
    headers,
    body: formData ?? (body ? JSON.stringify(body) : undefined),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message || "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload;
}

export function userApi(path, options) {
  return request(USER_API_URL, path, options);
}

export function productApi(path, options) {
  return request(PRODUCT_API_URL, path, options);
}
