'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a comprehensive AI code review.
 *
 * - analyzeCodeAndDisplayResults - Analyzes code for bugs, performance, security, and best practices, and provides a rewritten version.
 * - AnalyzeCodeInput - Input type for the analyzeCodeAndDisplayResults function.
 * - AnalyzeCodeOutput - Return type for the analyzeCodeAndDisplayResults function.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

const AnalyzeCodeInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  code: z.string().describe('The code to analyze.'),
});
export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  bugs: z.array(z.string()).describe('A list of detected bugs or logical errors. If you find any bugs, this indicates the code is incorrect.'),
  performanceOptimizations: z.array(z.string()).describe('A list of suggestions for performance improvements.'),
  securityVulnerabilities: z.array(z.string()).describe('A list of potential security risks found in the code.'),
  bestPractices: z.array(z.string()).describe('A list of comments on adherence to best practices and coding standards.'),
  rewrittenCode: z.string().describe('A rewritten version of the code incorporating all the suggested fixes and optimizations. If the code is incorrect, this rewritten code must be the corrected version. If no changes are needed, return the original code.'),
  timeComplexity: z.string().describe('The estimated time complexity of the code.'),
  spaceComplexity: z.string().describe('The estimated space complexity of the code.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;


const codeReviewPrompt = ai.definePrompt({
  name: 'codeReviewPrompt',
  input: { schema: AnalyzeCodeInputSchema },
  output: { schema: AnalyzeCodeOutputSchema },
  prompt: `You are the AI Code Review & Rewrite Agent, an expert software engineer specializing in code analysis and optimization.
Your task is to perform a comprehensive review of the provided code.

Your analysis must cover the following areas:
1.  **Bug Detection**: Identify any potential bugs, logical errors, or edge cases that might lead to unexpected behavior. If you find any bugs, this indicates the code is incorrect.
2.  **Performance Optimization**: Analyze the code for performance bottlenecks and suggest optimizations.
3.  **Security Vulnerabilities**: Scan for common security risks (e.g., injection flaws, insecure handling of data).
4.  **Best Practices**: Check for adherence to language-specific best practices and general coding standards.

Based on your analysis, provide the following in a JSON format:
-   \`bugs\`: A list of strings. If you find any bugs, this indicates the code is incorrect. Each string in the list should describe a detected bug.
-   \`performanceOptimizations\`: A list of strings with suggestions for performance improvements.
-   \`securityVulnerabilities\`: A list of strings detailing potential security risks.
-   \`bestPractices\`: A list of strings with comments on best practices.
-   \`rewrittenCode\`: Provide a completely rewritten version of the code that incorporates all the suggested fixes and optimizations. If the code is incorrect, this rewritten code must be the corrected version. If no changes are necessary, return the original code.
-   \`timeComplexity\`: A string estimating the time complexity (e.g., "O(n)").
-   \`spaceComplexity\`: A string estimating the space complexity (e.g., "O(1)").

If you find no issues in a category, return an empty array for it.

Language: {{{language}}}
Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`
`,
});

export async function analyzeCodeAndDisplayResults(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  const {output} = await codeReviewPrompt(input);

  if (!output) {
    throw new Error('Failed to get analysis from AI.');
  }

  return output;
}
