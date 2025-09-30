'use server';
/**
 * @fileOverview Calculates a safety score for a tourist based on their travel patterns.
 *
 * - calculateSafetyScore - A function that calculates the safety score.
 * - CalculateSafetyScoreInput - The input type for the calculateSafetyScore function.
 * - CalculateSafetyScoreOutput - The return type for the calculateSafetyScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateSafetyScoreInputSchema = z.object({
  travelPatterns: z
    .string()
    .describe(
      'A summary of the tourist\'s recent travel, including zones visited and time spent.'
    ),
  areaSensitivity: z
    .string()
    .describe('Information about the risk levels of the areas visited.'),
});
export type CalculateSafetyScoreInput = z.infer<
  typeof CalculateSafetyScoreInputSchema
>;

const CalculateSafetyScoreOutputSchema = z.object({
  safetyScore: z
    .number()
    .min(1)
    .max(10)
    .describe('A score from 1 (very risky) to 10 (very safe).'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of why the score was given, based on travel patterns.'
    ),
  recommendation: z
    .string()
    .describe('A personalized safety tip based on the analysis.'),
});
export type CalculateSafetyScoreOutput = z.infer<
  typeof CalculateSafetyScoreOutputSchema
>;

export async function calculateSafetyScore(
  input: CalculateSafetyScoreInput
): Promise<CalculateSafetyScoreOutput> {
  return calculateSafetyScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateSafetyScorePrompt',
  input: {schema: CalculateSafetyScoreInputSchema},
  output: {schema: CalculateSafetyScoreOutputSchema},
  prompt: `You are a security analyst for a tourism safety application. Your task is to calculate a "Tourist Safety Score" based on their recent travel patterns and the sensitivity of the areas they have visited. The score should be between 1 (most risky) and 10 (safest).

Analyze the following data:
- Travel Patterns: {{{travelPatterns}}}
- Area Sensitivity: {{{areaSensitivity}}}

Based on this, provide:
1. A safety score (safetyScore). A lower score indicates riskier behavior (e.g., spending time in high-risk zones, traveling at night in sensitive areas). A higher score indicates safer behavior (e.g., staying in low-risk zones, following planned itineraries).
2. A concise, one-sentence explanation for the score (explanation).
3. A short, actionable safety recommendation or tip for the tourist based on their behavior (recommendation).`,
});

const calculateSafetyScoreFlow = ai.defineFlow(
  {
    name: 'calculateSafetyScoreFlow',
    inputSchema: CalculateSafetyScoreInputSchema,
    outputSchema: CalculateSafetyScoreOutputSchema,
    retries: 2,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
