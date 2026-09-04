const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://vaaradhi-dev.agrani.tech"
).replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const { baseUrl, ...fetchOptions } = options;

  const isFormData = fetchOptions.body instanceof FormData;

  const resolvedBase = (baseUrl || API_BASE_URL).replace(/\/$/, "");

  const response = await fetch(`${resolvedBase}${path}`, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(fetchOptions.headers || {}),
    },
    body: isFormData
      ? fetchOptions.body
      : fetchOptions.body
        ? JSON.stringify(fetchOptions.body)
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
