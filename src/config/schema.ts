/**
 * Configuration schema definitions for the MCP server
 * 
 * All configuration is loaded from environment variables
 */

export interface MCPServerConfig {
  // Security boundaries
  security: {
    allowedBasePaths: string[];        // Allowed working directories
    maxFileSize: number;               // Max file size for analysis (bytes)
    commandTimeout: number;            // Command execution timeout (ms)
    sessionTimeout: number;            // Session expiration (ms)
  };
  
  // LLM providers
  llm: {
    provider: 'gemini' | 'claude' | 'openai' | 'local';
    model?: string;                    // Optional custom model
    geminiKey?: string;
    claudeKey?: string;
    openaiKey?: string;
    localLLMBaseUrl?: string;          // Base URL for OpenAI-compatible local server
    localLLMApiKey?: string;           // API key for local server (usually not required)
  };
  
  // Research tools
  research: {
    exaKey?: string;                   // Exa.ai API key
  };
  
  // Server settings
  server: {
    sessionStoragePath?: string;       // Custom session storage location
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
}
