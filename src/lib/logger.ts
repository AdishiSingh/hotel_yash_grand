import crypto from "crypto";

export type LogLevel = "INFO" | "WARN" | "ERROR" | "SECURITY" | "AUDIT";

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  traceId: string;
  correlationId?: string;
  module: string;
  message: string;
  metadata?: Record<string, any>;
}

export class Logger {
  /**
   * Output structured JSON log entry
   */
  public static log(level: LogLevel, moduleName: string, message: string, metadata?: Record<string, any>, traceId?: string) {
    const logEntry: StructuredLog = {
      timestamp: new Date().toISOString(),
      level,
      traceId: traceId || `trace-${crypto.randomBytes(6).toString("hex")}`,
      module: moduleName,
      message,
      metadata,
    };

    const formattedLog = JSON.stringify(logEntry);

    if (level === "ERROR" || level === "SECURITY") {
      console.error(formattedLog);
    } else if (level === "WARN") {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }

    return logEntry;
  }

  public static info(moduleName: string, message: string, metadata?: Record<string, any>) {
    return this.log("INFO", moduleName, message, metadata);
  }

  public static warn(moduleName: string, message: string, metadata?: Record<string, any>) {
    return this.log("WARN", moduleName, message, metadata);
  }

  public static error(moduleName: string, message: string, error?: any, metadata?: Record<string, any>) {
    return this.log("ERROR", moduleName, message, {
      ...metadata,
      errorMessage: error?.message || String(error),
      stack: error?.stack,
    });
  }

  public static audit(moduleName: string, message: string, metadata?: Record<string, any>) {
    return this.log("AUDIT", moduleName, message, metadata);
  }
}
