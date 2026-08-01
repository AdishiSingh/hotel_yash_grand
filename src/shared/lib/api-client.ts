/**
 * CUSTOM API CLIENT WITH BUILT-IN RETRY AND ERROR MAPPING
 * Designed to act as the single data-fetching bridge across Booking, POS, and Billing modules.
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  retries?: number;
  retryDelay?: number;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const DEFAULT_RETRIES = 2;
const DEFAULT_DELAY = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, retries = DEFAULT_RETRIES, retryDelay = DEFAULT_DELAY, ...init } = options;

  // Build Query Parameters URL
  let targetUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    const separator = url.includes("?") ? "&" : "?";
    targetUrl = `${url}${separator}${searchParams.toString()}`;
  }

  // Construct Headers
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const fetchAttempt = async (attempt: number): Promise<T> => {
    try {
      const response = await fetch(targetUrl, {
        ...init,
        headers,
      });

      if (!response.ok) {
        let errorData: { message?: string; code?: string; details?: unknown } = {};
        try {
          errorData = await response.json();
        } catch {
          // Response is not JSON
        }
        
        throw new ApiError(
          errorData.message || `HTTP error! Status: ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      const isRetryableStatus = err instanceof ApiError && [502, 503, 504].includes(err.status);

      if ((isNetworkError || isRetryableStatus) && attempt < retries) {
        const nextDelay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        await delay(nextDelay);
        return fetchAttempt(attempt + 1);
      }
      throw err;
    }
  };

  return fetchAttempt(0);
}

// HTTP Helper bindings
export const api = {
  get: <T>(url: string, options?: RequestOptions) => apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestOptions) => apiClient<T>(url, { ...options, method: "DELETE" }),
};
