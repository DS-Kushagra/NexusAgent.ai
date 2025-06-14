// Client-side logging utility
class ClientLogger {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  async log(type: string, data: any): Promise<void> {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userId: this.userId,
          type,
          data,
        }),
      });
    } catch (error) {
      console.error("Failed to log to server:", error);
    }
  }

  async logInput(content: string, role: string): Promise<void> {
    await this.log("input", { content, role });
  }

  async logOutput(content: string, role: string): Promise<void> {
    await this.log("output", { content, role });
  }

  async logProcessing(step: string, details?: any): Promise<void> {
    await this.log("processing", { step, details });
  }

  async logError(error: string, details?: any): Promise<void> {
    await this.log("error", { error, details });
  }

  async logApiCall(
    endpoint: string,
    requestData: any,
    responseData: any
  ): Promise<void> {
    await this.log("api_call", { endpoint, requestData, responseData });
  }
}

export const clientLogger = new ClientLogger();
