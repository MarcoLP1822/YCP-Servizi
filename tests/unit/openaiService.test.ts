// Set the environment variable BEFORE any imports so that openaiService.ts picks it up
process.env.OPENAI_API_KEY = 'test-api-key';

/**
 * @fileoverview
 * This file contains unit tests for the OpenAI service integration in
 * backend/services/openaiService.ts. It tests that the generateContent function
 * properly handles successful responses, API errors, and cases where the API response
 * does not include generated text.
 *
 * Key features:
 * - Mocks the global fetch function to simulate API calls.
 * - Tests success and error conditions.
 *
 * @dependencies
 * - jest: For testing and mocking.
 * - global.fetch: Mocked to simulate responses from the OpenAI API.
 *
 * @notes
 * - The tests ensure that errors are thrown with the generic message:
 *   "Impossibile generare il contenuto al momento." in error cases.
 */

import { generateContent } from '../../backend/services/openaiService';

global.fetch = jest.fn();

describe('OpenAI Service', () => {
  it('should generate content successfully for valid input', async () => {
    const fakeResponse = {
      ok: true,
      json: async () => ({
        choices: [{
          message: { content: 'Generated content text' }
        }]
      })
    };
    (<jest.Mock>global.fetch).mockResolvedValue(fakeResponse);
    const result = await generateContent('blurb', 'Test extracted text');
    expect(result).toBe('Generated content text');
  });

  it('should throw an error if fetch response is not ok', async () => {
    const fakeResponse = {
      ok: false,
      status: 500,
      text: async () => 'Error details'
    };
    (<jest.Mock>global.fetch).mockResolvedValue(fakeResponse);
    await expect(generateContent('description', 'Test text')).rejects.toThrow('Impossibile generare il contenuto al momento.');
  });

  it('should throw an error if generated text is missing', async () => {
    const fakeResponse = {
      ok: true,
      json: async () => ({ choices: [{}] })
    };
    (<jest.Mock>global.fetch).mockResolvedValue(fakeResponse);
    await expect(generateContent('keywords', 'Test text')).rejects.toThrow('Impossibile generare il contenuto al momento.');
  });
});
