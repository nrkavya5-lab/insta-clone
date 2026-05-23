const BASE_URL = "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const method = options?.method ?? "GET";
  const separator = path.includes("?") ? "&" : "?";
  const devPath = method === "GET" ? `${path}${separator}__dev=1` : path;
  const res = await fetch(`${BASE_URL}${devPath}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || "Request failed");
  }

  return res.json();
}
