import { isDevelopment } from "@/env";

type LogLevel = "info" | "error" | "warn" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = this.formatTimestamp();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (level === "error") {
      console.error(prefix, message, context || "");
    } else if (level === "warn") {
      console.warn(prefix, message, context || "");
    } else {
      console.log(prefix, message, context || "");
    }
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context };

    if (error instanceof Error) {
      errorContext.message = error.message;
      if (isDevelopment && error.stack) {
        errorContext.stack = error.stack;
      }
    } else if (error) {
      errorContext.error = String(error);
    }

    this.log("error", message, errorContext);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  request(
    method: string,
    path: string,
    params?: Record<string, unknown>
  ): void {
    this.info(`${method} ${path}`, params);
  }
}

export const logger = new Logger();
