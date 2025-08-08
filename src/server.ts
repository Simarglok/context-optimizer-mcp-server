#!/usr/bin/env node

/**
 * Context Optimizer MCP Server
 * 
 * A standalone Model Context Protocol server that provides context optimization tools
 * for AI coding assistants including GitHub Copilot, Cursor AI, Claude Desktop, and others.
 * 
 * This server provides the same functionality as the VS Code extension but with
 * universal compatibility through the MCP standard.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import * as path from 'path';
import * as fs from 'fs';

import { ConfigurationManager } from './config/manager';
import { Logger } from './utils/logger';
import { BaseMCPTool } from './tools/base';
import { AskAboutFileTool } from './tools/askAboutFile';
import { RunAndExtractTool } from './tools/runAndExtract';
import { AskFollowUpTool } from './tools/askFollowUp';
import { ResearchTopicTool } from './tools/researchTopic';
import { DeepResearchTool } from './tools/deepResearch';

class ContextOptimizerMCPServer {
  private server: Server;
  private tools: Map<string, BaseMCPTool>;

  constructor() {
    this.server = new Server(
      {
        name: 'context-optimizer-mcp-server',
        version: '1.0.0',
        description: 'Context optimization tools for AI coding assistants - askAboutFile, runAndExtract, research tools - compatible with GitHub Copilot, Cursor AI, and other MCP-supporting assistants'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    
    this.tools = new Map();
    this.setupTools();
    this.setupHandlers();
  }

  private setupTools(): void {
    const toolInstances = [
      new AskAboutFileTool(),
      new RunAndExtractTool(),
      new AskFollowUpTool(),
      new ResearchTopicTool(),
      new DeepResearchTool()
    ];
    
    for (const tool of toolInstances) {
      this.tools.set(tool.name, tool);
    }
    
    Logger.info(`Registered ${this.tools.size} tools: ${Array.from(this.tools.keys()).join(', ')}`);
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(this.tools.values()).map(tool => tool.toMCPTool())
      };
    });
    
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }
      
      try {
        const result = await tool.execute(args);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        Logger.error(`Tool execution error [${name}]:`, error);
        return {
          content: [{
            type: 'text',
            text: `❌ **Tool Error**: ${errorMessage}`
          }],
          isError: true,
          errorMessage
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    Logger.info('Context Optimizer MCP Server started');
  }
}

// Main entry point
async function main() {
  try {
    Logger.debug('Loading configuration...');
    await ConfigurationManager.loadConfiguration();
    
    Logger.debug('Starting MCP server...');
    const server = new ContextOptimizerMCPServer();
    await server.start();
    
  } catch (error) {
    Logger.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  Logger.info('Shutting down MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  Logger.info('Shutting down MCP server...');
  process.exit(0);
});

if (require.main === module) {
  main().catch((error) => {
    Logger.error('Fatal error:', error);
    process.exit(1);
  });
}
