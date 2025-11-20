export class APIRateLimiter {
  private requestCount = 0;
  private resetTime = Date.now() + 86400000;

  private maybeReset() {
    const now = Date.now();
    if (now > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = now + 86400000;
    }
  }

  async makeRequest<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    this.maybeReset();
    if (this.requestCount >= 90) {
      console.warn('Near rate limit, using fallback API');
      return fallback();
    }
    try {
      const result = await primary();
      this.requestCount++;
      return result;
    } catch (error: any) {
      if (error?.response?.status === 429) {
        console.warn('Rate limited, switching to fallback');
        return fallback();
      }
      throw error;
    }
  }
}

export const apiRateLimiter = new APIRateLimiter();
