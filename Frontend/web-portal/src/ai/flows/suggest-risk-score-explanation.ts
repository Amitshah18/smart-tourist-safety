'use server';

/**
 * @fileOverview Provides an explanation of how the AI arrived at a risk score for a given zone.
 *
 * - suggestRiskScoreExplanation - A function that generates an explanation for the risk score.
 * - SuggestRiskScoreExplanationInput - The input type for the suggestRiskScoreExplanation function.
 * - SuggestRiskScoreExplanationOutput - The return type for the suggestRiskScoreExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRiskScoreExplanationInputSchema = z.object({
  zoneName: z.string().describe('The name of the zone.'),
  riskScore: z.number().describe('The risk score assigned to the zone.'),
  incidentHistory: z
    .string()
    .describe('A summary of the incident history for the zone.'),
  locationDetails: z.string().describe('Details about the location of the zone.'),
});
export type SuggestRiskScoreExplanationInput = z.infer<
  typeof SuggestRiskScoreExplanationInputSchema
>;

const SuggestRiskScoreExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear and concise explanation of how the risk score was derived.'),
});
export type SuggestRiskScoreExplanationOutput = z.infer<
  typeof SuggestRiskScoreExplanationOutputSchema
>;

export async function suggestRiskScoreExplanation(
  input: SuggestRiskScoreExplanationInput
): Promise<SuggestRiskScoreExplanationOutput> {
  return suggestRiskScoreExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRiskScoreExplanationPrompt',
  input: {schema: SuggestRiskScoreExplanationInputSchema},
  output: {schema: SuggestRiskScoreExplanationOutputSchema},
  prompt: `You are an AI assistant that explains risk scores for different zones.

  Given the following information, explain how you arrived at the risk score:

  Zone Name: {{{zoneName}}}
  Risk Score: {{{riskScore}}}
  Incident History: {{{incidentHistory}}}
  Location Details: {{{locationDetails}}}

  Provide a clear, concise explanation of how the risk score was derived based on the provided information.
  The explanation should include the factors that contributed to the score.
  Be sure to address how incident history and location details affected the score.
  Be direct and get to the point, don't include fluff, and don't begin the response as an AI assistant.
  `,
});

const suggestRiskScoreExplanationFlow = ai.defineFlow(
  {
    name: 'suggestRiskScoreExplanationFlow',
    inputSchema: SuggestRiskScoreExplanationInputSchema,
    outputSchema: SuggestRiskScoreExplanationOutputSchema,
    retries: 2,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
