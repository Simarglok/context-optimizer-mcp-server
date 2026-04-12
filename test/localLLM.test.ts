/**
 * Tests for LocalLLMProvider (LM Studio / Ollama / OpenAI-compatible local servers)
 */

import { LocalLLMProvider } from '../src/providers/local';
import OpenAI from 'openai';

// Declare mockCreate at module scope so tests can configure it
const mockCreate = jest.fn();

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Wire up mockCreate to the constructor after the module is mocked
beforeAll(() => {
  (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
    chat: { completions: { create: mockCreate } }
  } as any));
});

const MockOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

describe('LocalLLMProvider', () => {
  let provider: LocalLLMProvider;
  const OLD_ENV = process.env;

  beforeEach(() => {
    provider = new LocalLLMProvider();
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    delete process.env.CONTEXT_OPT_LOCAL_LLM_BASE_URL;
    delete process.env.CONTEXT_OPT_LOCAL_LLM_API_KEY;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('static properties', () => {
    it('should have correct name', () => {
      expect(provider.name).toBe('Local LLM');
    });

    it('should have a sensible default model', () => {
      expect(provider.defaultModel).toBe('local-model');
    });

    it('should have undefined apiKeyPrefix (no API key required)', () => {
      expect(provider.apiKeyPrefix).toBeUndefined();
    });
  });

  describe('processRequest', () => {
    it('should return successful response when local LLM responds', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Hello from local model!' } }]
      });

      const result = await provider.processRequest('Say hello', 'mistral-7b', 'lm-studio');

      expect(result.success).toBe(true);
      expect(result.content).toBe('Hello from local model!');
      expect(result.error).toBeUndefined();
    });

    it('should use default base URL when env var is not set', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'response' } }]
      });

      await provider.processRequest('test prompt');

      expect(MockOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'http://localhost:1234/v1' })
      );
    });

    it('should use custom base URL from environment variable', async () => {
      process.env.CONTEXT_OPT_LOCAL_LLM_BASE_URL = 'http://localhost:11434/v1';
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'ollama response' } }]
      });

      await provider.processRequest('test prompt');

      expect(MockOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'http://localhost:11434/v1' })
      );
    });

    it('should use provided apiKey when given', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'response' } }]
      });

      await provider.processRequest('test prompt', undefined, 'custom-key');

      expect(MockOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({ apiKey: 'custom-key' })
      );
    });

    it('should fall back to lm-studio placeholder when no API key provided', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'response' } }]
      });

      await provider.processRequest('test prompt');

      expect(MockOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({ apiKey: 'lm-studio' })
      );
    });

    it('should use API key from environment variable', async () => {
      process.env.CONTEXT_OPT_LOCAL_LLM_API_KEY = 'env-api-key';
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'response' } }]
      });

      await provider.processRequest('test prompt');

      expect(MockOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({ apiKey: 'env-api-key' })
      );
    });

    it('should forward custom model name to completions API', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'response' } }]
      });

      await provider.processRequest('test prompt', 'llama-3.1-8b');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'llama-3.1-8b' })
      );
    });

    it('should use defaultModel when no model is provided', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'response' } }]
      });

      await provider.processRequest('test prompt');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'local-model' })
      );
    });

    it('should return error response when LLM returns empty content', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: null } }]
      });

      const result = await provider.processRequest('test prompt');

      expect(result.success).toBe(false);
      expect(result.content).toBe('');
      expect(result.error).toContain('No response from local LLM');
    });

    it('should return error response when LLM throws (e.g. server not running)', async () => {
      mockCreate.mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:1234'));

      const result = await provider.processRequest('test prompt');

      expect(result.success).toBe(false);
      expect(result.error).toContain('connect ECONNREFUSED');
    });

    it('should handle unknown errors gracefully', async () => {
      mockCreate.mockRejectedValue('unexpected non-Error throw');

      const result = await provider.processRequest('test prompt');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown error');
    });
  });
});
