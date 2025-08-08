# Changelog

All notable changes to the Context Optimizer MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Current Changes

### Added
- **Core MCP Tools**: File analysis (`askAboutFile`), terminal execution (`runAndExtract`), follow-up questions (`askFollowUp`)
- **Research Tools**: Quick research (`researchTopic`) and deep research (`deepResearch`) using Exa.ai
- **Multi-LLM Support**: Google Gemini, Anthropic Claude, and OpenAI integration
- **Security Layer**: Path validation, command filtering, session management
- **Environment Variable Configuration**: All settings via `CONTEXT_OPT_*` environment variables
- **MCP Protocol Compliance**: Proper JSON-RPC communication over stdio
- **Cross-Platform Support**: Windows, macOS, and Linux compatibility
- **Comprehensive Testing**: Unit tests, integration tests, security validation
- **Documentation**: Setup guides for VS Code, Claude Desktop, and Cursor AI

### Fixed
- **MCP Protocol Issues**: Fixed stdout/stderr logging conflicts causing "Failed to parse message" warnings
- **Windows Path Validation**: Fixed case sensitivity issues in path validation
- **Environment Variable Loading**: Consistent `CONTEXT_OPT_` prefixed variables across all components
- **Test Suite**: All 84 tests passing with conditional LLM integration testing

### Changed
- **Logging**: Default log level changed from 'info' to 'warn' for cleaner output
- **Configuration**: Moved from JSON config files to environment variables only
- **Error Handling**: Enhanced MCP-compliant error responses with proper content structure
- **Documentation Updates**: Enhanced README.md with detailed tool summaries including specific use cases and capabilities
- **Usage Guide Improvements**: 
  - Merged required and optional environment variables into single unified section
  - Removed temporary/session-only environment variable options for cleaner setup
  - Updated AI Assistant Setup with accurate MCP configuration based on latest 2024-2025 specifications
  - Verified VS Code, Claude Desktop, and Cursor AI setup procedures with proper file locations and JSON schemas
