const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://vaaradhi-dev.agrani.tech"
).replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    body: isFormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  let body = null;

  try {
    body = await response.json();
  } catch {
    /* empty response */
  }

  if (!response.ok) {
    const message =
      body?.message || body?.detail || `Request failed (${response.status})`;

    throw new Error(message);
  }

  return body;
}

export { API_BASE_URL };
