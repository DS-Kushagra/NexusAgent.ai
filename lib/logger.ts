import { writeFile, appendFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface LogEntry {
  timestamp: string;
  sessionId: string;
  userId?: string;
  type: "input" | "output" | "processing" | "error" | "api_call";
  data: {
    content?: string;
    role?: string;
    transcriptType?: string;
    error?: string;
    apiEndpoint?: string;
    requestData?: any;
    responseData?: any;
    callStatus?: string;
    processingStep?: string;
  };
}

class Logger {
  private logDir: string;
  private currentDate: string;

  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.currentDate = new Date().toISOString().split("T")[0];
  }

  private getLogFilePath(): string {
    return path.join(this.logDir, `agent-logs-${this.currentDate}.json`);
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async logEntry(entry: Omit<LogEntry, "timestamp">): Promise<void> {
    try {
      const logEntry: LogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      };

      const logFilePath = this.getLogFilePath();

      let logs: LogEntry[] = [];

      // Read existing logs if file exists
      if (existsSync(logFilePath)) {
        try {
          const fileContent = await readFile(logFilePath, "utf-8");
          logs = JSON.parse(fileContent);
        } catch (error) {
          console.error("Error reading log file:", error);
          logs = [];
        }
      }

      // Add new log entry
      logs.push(logEntry);

      // Write back to file
      await writeFile(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to write log:", error);
    }
  }

  async logInput(
    sessionId: string,
    userId: string,
    content: string,
    role: string
  ): Promise<void> {
    await this.logEntry({
      sessionId,
      userId,
      type: "input",
      data: {
        content,
        role,
      },
    });
  }

  async logOutput(
    sessionId: string,
    userId: string,
    content: string,
    role: string
  ): Promise<void> {
    await this.logEntry({
      sessionId,
      userId,
      type: "output",
      data: {
        content,
        role,
      },
    });
  }

  async logProcessing(
    sessionId: string,
    userId: string,
    step: string,
    details?: any
  ): Promise<void> {
    await this.logEntry({
      sessionId,
      userId,
      type: "processing",
      data: {
        processingStep: step,
        ...details,
      },
    });
  }

  async logError(
    sessionId: string,
    userId: string,
    error: string,
    details?: any
  ): Promise<void> {
    await this.logEntry({
      sessionId,
      userId,
      type: "error",
      data: {
        error,
        ...details,
      },
    });
  }

  async logApiCall(
    sessionId: string,
    userId: string,
    endpoint: string,
    requestData: any,
    responseData: any
  ): Promise<void> {
    await this.logEntry({
      sessionId,
      userId,
      type: "api_call",
      data: {
        apiEndpoint: endpoint,
        requestData,
        responseData,
      },
    });
  }

  createSession(): string {
    return this.generateSessionId();
  }

  async getSessionLogs(sessionId: string): Promise<LogEntry[]> {
    try {
      const logFilePath = this.getLogFilePath();

      if (!existsSync(logFilePath)) {
        return [];
      }

      const fileContent = await readFile(logFilePath, "utf-8");
      const logs: LogEntry[] = JSON.parse(fileContent);

      return logs.filter((log) => log.sessionId === sessionId);
    } catch (error) {
      console.error("Error reading session logs:", error);
      return [];
    }
  }
}

export const logger = new Logger();
