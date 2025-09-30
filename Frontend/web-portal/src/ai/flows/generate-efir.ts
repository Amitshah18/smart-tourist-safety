
'use server';
/**
 * @fileOverview Generates an Electronic First Information Report (E-FIR) based on an incident.
 *
 * - generateEfir - A function that creates an E-FIR draft.
 * - GenerateEfirInput - The input type for the generateEfir function.
 * - GenerateEfirOutput - The return type for the generateEfir function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEfirInputSchema = z.object({
  incidentDetails: z.string().describe("A JSON string containing the full details of the incident report."),
  touristIdDetails: z.string().describe("A JSON string with the tourist's Digital ID information."),
});
export type GenerateEfirInput = z.infer<typeof GenerateEfirInputSchema>;

const GenerateEfirOutputSchema = z.object({
  efirText: z.string().describe("The formatted text of the Electronic First Information Report (E-FIR)."),
});
export type GenerateEfirOutput = z.infer<typeof GenerateEfirOutputSchema>;

export async function generateEfir(
  input: GenerateEfirInput
): Promise<GenerateEfirOutput> {
  return generateEfirFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEfirPrompt',
  input: {schema: GenerateEfirInputSchema},
  output: {schema: GenerateEfirOutputSchema},
  prompt: `You are an AI assistant for a police department, tasked with drafting an Electronic First Information Report (E-FIR) for an incident involving a tourist.

Use the provided JSON data to construct a formal E-FIR document. The report should be clear, concise, and follow a standard legal format.

Incident Details:
{{{incidentDetails}}}

Tourist Digital ID Details:
{{{touristIdDetails}}}

Structure the E-FIR as follows:
1.  **FIR Number**: (Generate a placeholder, e.g., 'EFIR-YYYY-######')
2.  **Date and Time of Report**: (Use the incident's 'createdAt' timestamp)
3.  **Complainant Information**:
    *   Name: (From tourist ID)
    *   Nationality: (From tourist ID)
    *   Passport/Document No.: (From tourist ID)
4.  **Incident Details**:
    *   Date and Time of Incident: (Use the incident's 'createdAt' timestamp, but state it's approximate)
    *   Location of Incident: (From incident report)
    *   Type of Offense: (Based on incident type, e.g., "Theft", "SOS Emergency")
    *   Severity: (From incident report)
5.  **Brief Description of Incident**:
    *   (Summarize the 'description' from the incident report in a formal tone).
6.  **Action Taken**:
    *   "Initial report filed. Assigned for investigation."

Generate the complete E-FIR text.
`,
});

const generateEfirFlow = ai.defineFlow(
  {
    name: 'generateEfirFlow',
    inputSchema: GenerateEfirInputSchema,
    outputSchema: GenerateEfirOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
