'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing code, detecting and fixing errors,
 * and estimating time and space complexity.
 *
 * - analyzeCodeAndDisplayResults - Analyzes code, fixes errors, and estimates complexity.
 * - AnalyzeCodeInput - Input type for the analyzeCodeAndDisplayResults function.
 * - AnalyzeCodeOutput - Return type for the analyzeCodeAndDisplayResults function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { genkit } from 'genkit';
import { groq } from 'genkitx-groq';

const AnalyzeCodeInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  code: z.string().describe('The code to analyze.'),
  groqApiKey: z.string().optional(),
});
export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  status: z.enum(['correct', 'fixed']).describe('The status of the code analysis: correct if no errors were found, fixed if errors were automatically fixed.'),
  errors: z.array(z.string()).describe('A list of errors found in the code, if any.'),
  fixedCode: z.string().describe('The corrected code, if any errors were found.'),
  timeComplexity: z.string().describe('The estimated time complexity of the code.'),
  spaceComplexity: z.string().describe('The estimated space complexity of the code.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;


const promptText = `You are a highly skilled software engineer specializing in code analysis and optimization. Given the following code, identify any errors, automatically fix them, estimate the time complexity, and estimate the space complexity. Return the information in JSON format.

Language: {{{language}}}
Code:
{{{code}}}

Ensure that the "status" field is "correct" if no errors are found, and "fixed" if errors were fixed.
If no errors are found, the "errors" and "fixedCode" fields should be empty.
`;

export async function analyzeCodeAndDisplayResults(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  const prompt = promptText
    .replace('{{{language}}}', input.language)
    .replace('{{{code}}}', input.code);

  let response;

  if (input.groqApiKey) {
    const groqAi = genkit({
      plugins: [groq({ apiKey: input.groqApiKey })],
    });
    response = await groqAi.generate({
      model: 'gemma-7b-it',
      prompt,
      output: {
        schema: AnalyzeCodeOutputSchema,
      },
    });
  } else {
    response = await ai.generate({
      prompt,
      output: {
        schema: AnalyzeCodeOutputSchema,
      },
    });
  }

  if (!response.output) {
    throw new Error('Failed to get analysis from AI.');
  }

  return response.output;
}
