// Summarize recent incident reports in a specific area.

'use server';

/**
 * @fileOverview Summarizes recent incident reports in a given area.
 *
 * - summarizeIncidentReports - A function that summarizes recent incident reports.
 * - SummarizeIncidentReportsInput - The input type for the summarizeIncidentReports function.
 * - SummarizeIncidentReportsOutput - The return type for the summarizeIncidentReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIncidentReportsInputSchema = z.object({
  areaDescription: z
    .string()
    .describe('The description of the area for which to summarize incident reports.'),
  incidentReports: z
    .string()
    .describe(
      'A list of recent incident reports with details like type, severity, timestamp and location.'
    ),
});
export type SummarizeIncidentReportsInput = z.infer<typeof SummarizeIncidentReportsInputSchema>;

const SummarizeIncidentReportsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the recent incident reports.'),
});
export type SummarizeIncidentReportsOutput = z.infer<typeof SummarizeIncidentReportsOutputSchema>;

export async function summarizeIncidentReports(input: SummarizeIncidentReportsInput): Promise<SummarizeIncidentReportsOutput> {
  return summarizeIncidentReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIncidentReportsPrompt',
  input: {schema: SummarizeIncidentReportsInputSchema},
  output: {schema: SummarizeIncidentReportsOutputSchema},
  prompt: `You are an expert in analyzing incident reports and providing concise summaries.

  Please provide a brief summary of the following incident reports in the specified area:

  Area Description: {{{areaDescription}}}
  Incident Reports: {{{incidentReports}}}

  Summary:`,
});

const summarizeIncidentReportsFlow = ai.defineFlow(
  {
    name: 'summarizeIncidentReportsFlow',
    inputSchema: SummarizeIncidentReportsInputSchema,
    outputSchema: SummarizeIncidentReportsOutputSchema,
    retries: 2,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
