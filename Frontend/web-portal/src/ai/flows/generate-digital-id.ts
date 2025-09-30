
'use server';
/**
 * @fileOverview A flow for generating a new Digital Tourist ID.
 *
 * - generateDigitalId - Creates a new digital ID and stores it.
 * - GenerateDigitalIdInput - The input type for the generateDigitalId function.
 * - DigitalIdSerializable - The return type for the generateDigitalId function.
 */

import {ai} from '@/ai/genkit';
import {addDigitalId, DigitalIdSerializable} from '@/lib/digital-id';
import {z} from 'genkit';

const GenerateDigitalIdInputSchema = z.object({
  fullName: z.string(),
  documentNumber: z.string(),
  documentType: z.string(),
  nationality: z.string(),
  visitStartDate: z.string(),
  visitEndDate: z.string(),
  itinerary: z.string().optional(),
  userId: z.string().optional().default('1'),
});
export type GenerateDigitalIdInput = z.infer<
  typeof GenerateDigitalIdInputSchema
>;


export async function generateDigitalId(
  input: GenerateDigitalIdInput
): Promise<DigitalIdSerializable> {
  return generateDigitalIdFlow(input);
}

const generateDigitalIdFlow = ai.defineFlow(
  {
    name: 'generateDigitalIdFlow',
    inputSchema: GenerateDigitalIdInputSchema,
    // Output schema is implicitly DigitalIdSerializable, which is not a Zod schema.
    // This is fine as long as the return type matches.
  },
  async input => {
    // In a real blockchain scenario, this would involve a more complex process
    // of creating and signing a verifiable credential.
    // Here, we simulate it by creating a database entry.
    const newId = await addDigitalId(input);

    return newId;
  }
);
