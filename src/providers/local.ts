/**
 * Local LLM provider implementation
 *
 * Supports any OpenAI-compatible local inference server:
 * - LM Studio  (default base URL: http://localhost:1234/v1)
 * - Ollama     (default base URL: http://localhost:11434/v1)
 * - LLamafile, Jan, localai, etc.
 *
 * Configure via environment variables:
 *   CONTEXT_OPT_LOCAL_LLM_BASE_URL  — base URL of the OpenAI-compatible endpoint
 *   CONTEXT_OPT_LOCAL_LLM_API_KEY   — API key (usually not required; defaults to "lm-studio")
 *   CONTEXT_OPT_LLM_MODEL           — model name to request (defaults to "local-model")
 */

import OpenAI from 'openai';
import { BaseLLMProvider, LLMResponse } from './base';

export class LocalLLMProvider extends BaseLLMProvider {
  readonly name = 'Local LLM';
  readonly defaultModel = 'local-model';
  readonly apiKeyUrl = 'http://localhost:1234';
  readonly apiKeyPrefix = undefined;

  async processRequest(prompt: string, model?: string, apiKey?: string): Promise<LLMResponse> {
    try {
      const resolvedBaseURL = process.env.CONTEXT_OPT_LOCAL_LLM_BASE_URL || 'http://localhost:1234/v1';
      const resolvedApiKey = apiKey || process.env.CONTEXT_OPT_LOCAL_LLM_API_KEY || 'lm-studio';

      const openai = new OpenAI({
        baseURL: resolvedBaseURL,
        apiKey: resolvedApiKey,
      });

      const completion = await openai.chat.completions.create({
        model: model || this.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return this.createErrorResponse('No response from local LLM');
      }

      return this.createSuccessResponse(content);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResponse(`Local LLM processing failed: ${errorMessage}`);
    }
  }
}
