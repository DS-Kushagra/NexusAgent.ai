import { writeFile, readFile, rename } from "fs/promises";
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
  // Serialises writes: each call chains onto the previous one, so two concurrent
  // requests can never read-modify-write the same file at the same time.
  private writeQueue: Promise<void> = Promise.resolve();

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
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    this.writeQueue = this.writeQueue.then(() => this.appendEntry(logEntry));
    return this.writeQueue;
  }

  private async appendEntry(logEntry: LogEntry): Promise<void> {
    try {
      const logFilePath = this.getLogFilePath();

      let logs: LogEntry[] = [];

      // Read existing logs if file exists
      if (existsSync(logFilePath)) {
        try {
          const fileContent = await readFile(logFilePath, "utf-8");
          logs = JSON.parse(fileContent);
        } catch (error) {
          // Do not silently reset to []: writing that back would replace the
          // whole day of history with this single entry. Keep the unreadable
          // file for inspection and start a new one instead.
          console.error("Error reading log file:", error);
          await rename(
            logFilePath,
            `${logFilePath}.corrupt-${Date.now()}`
          ).catch(() => {});
          logs = [];
        }
      }

      // Add new log entry
      logs.push(logEntry);

      // Write to a temp file and rename into place: rename is atomic, so a
      // reader never observes a partially written file.
      const tmpPath = `${logFilePath}.tmp`;
      await writeFile(tmpPath, JSON.stringify(logs, null, 2), "utf-8");
      await rename(tmpPath, logFilePath);
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
