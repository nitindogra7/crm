const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers = {}, signal, ...rest } = options;
  const mergedHeaders = new Headers(headers);
  if (!mergedHeaders.has("Content-Type")) {
    mergedHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Keep the timeout active when callers provide their own cancellation signal.
  const timeoutSignal = AbortSignal.timeout(15000);
  const activeSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...rest,
      headers: mergedHeaders,
      credentials: "include",
      signal: activeSignal,
    });
  } catch (err: unknown) {
    if (signal?.aborted) throw err;
    throw new Error(
      `Cannot connect to backend API at ${API_URL}. Ensure the server is running and NEXT_PUBLIC_API_URL is configured properly (${err instanceof Error ? err.message : String(err)}).`
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export { API_URL };
