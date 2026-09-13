// API Client for Life RPG
// Designed for seamless transition to Node.js + Express + MongoDB + JWT backend

export const API_CONFIG = {
  USE_MOCK: true,
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  TOKEN_KEY: "life_rpg_jwt_token",
};

export class ApiClient {
  public static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }

  public static setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  }

  public static removeToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  }

  // Simulated latency for authentic game feels and testing async UI loading
  public static async simulateDelay(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Standard fetch wrapper ready for Express/JWT
  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (API_CONFIG.USE_MOCK) {
      throw new Error("Cannot execute direct HTTP call when USE_MOCK is true");
    }

    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Request failed" }));
      throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }

    return res.json();
  }
}
