/**
 * Logger utility for MCP server
 * 
 * Since MCP servers communicate over stdio using JSON-RPC, all logging output
 * must be directed to stderr to avoid interfering with the protocol messages.
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export class Logger {
  private static logLevel: LogLevel = 'info';
  
  static setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  static getLogLevel(): LogLevel {
    return this.logLevel;
  }
  
  static shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    return levels[level] <= levels[this.logLevel];
  }
  
  static error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  static warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.error(`[WARN] ${message}`, ...args);
    }
  }
  
  static info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.error(`[DEBUG] ${message}`, ...args);
    }
  }
  
  static success(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static config(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static startup(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static security(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static tools(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static file(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
  
  static shutdown(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }
}
