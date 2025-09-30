
'use server';
/**
 * @fileOverview A flow for creating a new incident report.
 *
 * - createIncidentReport - A function that handles the creation of an incident report.
 * - CreateIncidentReportInput - The input type for the createIncidentReport function.
 * - CreateIncidentReportOutput - The return type for the createIncidentReport function.
 */

import {ai} from '@/ai/genkit';
import {addIncident} from '@/lib/incidents';
import {z} from 'genkit';

const CreateIncidentReportInputSchema = z.object({
  type: z.string().describe('The type of incident.'),
  severity: z.string().describe('The severity level of the incident.'),
  description: z.string().describe('A detailed description of the incident.'),
  location: z.string().describe('The location where the incident occurred.'),
  mediaUrl: z
    .string()
    .optional()
    .describe(
      "A media attachment (photo, video) as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  isSos: z.boolean().optional().describe('Whether this is an SOS emergency alert.')
});
export type CreateIncidentReportInput = z.infer<
  typeof CreateIncidentReportInputSchema
>;

const CreateIncidentReportOutputSchema = z.object({
  success: z.boolean(),
  incidentId: z.string().optional(),
  message: z.string(),
});
export type CreateIncidentReportOutput = z.infer<
  typeof CreateIncidentReportOutputSchema
>;

export async function createIncidentReport(
  input: CreateIncidentReportInput
): Promise<CreateIncidentReportOutput> {
  return createIncidentReportFlow(input);
}

const createIncidentReportFlow = ai.defineFlow(
  {
    name: 'createIncidentReportFlow',
    inputSchema: CreateIncidentReportInputSchema,
    outputSchema: CreateIncidentReportOutputSchema,
  },
  async input => {
    const newIncident = await addIncident({
      type: input.type,
      severity: input.severity,
      description: input.description,
      location: input.location,
      image: input.mediaUrl,
      isSos: input.isSos,
    });

    return {
      success: true,
      incidentId: newIncident.id,
      message: 'Incident report created successfully.',
    };
  }
);

    