
'use server';
/**
 * @fileOverview Detects anomalies in a tourist's travel patterns.
 *
 * - detectAnomalies - A function that analyzes travel data for unusual behavior.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  travelHistory: z.array(z.object({
    location: z.string(),
    timestamp: z.string().datetime(),
  })).describe("A list of recent locations the user has visited with timestamps."),
  itinerary: z.string().optional().describe("The user's planned itinerary for the day/trip."),
  userProfile: z.object({
    averageActivity: z.string().describe("User's typical activity level (e.g., 'high', 'low', 'moderate')."),
    preferredZones: z.array(z.string()).describe("Types of zones the user usually visits (e.g., 'tourist', 'commercial', 'quiet')."),
  }).optional().describe("Profile of the user's normal behavior."),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  anomalies: z.array(z.object({
    type: z.string().describe("The type of anomaly detected (e.g., 'Route Deviation', 'Unusual Inactivity', 'High-Risk Area Entry')."),
    description: z.string().describe("A concise explanation of the detected anomaly."),
    severity: z.enum(['Low', 'Medium', 'High']).describe("The assessed severity of the anomaly."),
  })),
  overallAssessment: z.string().describe("A one-sentence summary of the user's current safety status based on the anomalies.")
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(
  input: DetectAnomaliesInput
): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an AI security analyst for a tourist safety application. Your job is to detect anomalies in a tourist's behavior that could indicate a potential safety risk.

Analyze the provided data:
- Travel History: {{{json travelHistory}}}
- Planned Itinerary: {{{itinerary}}}
- User Profile: {{{json userProfile}}}

Identify and report any of the following anomalies:
1.  **Route Deviation**: Significant deviation from the planned itinerary.
2.  **Unusual Inactivity**: A long period with no location updates, especially if it's unusual for the user's profile.
3.  **High-Risk Area Entry**: Entering an area known to be high-risk, especially at night or if it doesn't match their itinerary.
4.  **Uncharacteristic Behavior**: Actions that contradict the user's known profile, like a user who prefers quiet areas suddenly spending hours in a noisy nightlife district late at night.

For each anomaly, provide a type, a clear description, and a severity level.
Finally, provide a brief, one-sentence overall assessment of the situation.

If no anomalies are found, return an empty array for "anomalies" and a positive overall assessment.
`,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
    retries: 2,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    