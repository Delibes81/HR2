'use server';

/**
 * @fileOverview Provides supplement recommendations for recovery.
 *
 * - recommendProducts - A function that generates product recommendations.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendProductsInputSchema = z.object({
  catalogTrends: z
    .string()
    .describe(
      'A description of the current trends in the supplement catalog, including popular items, categories, and customer preferences.'
    ),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional: A description of the user\u2019s past purchases and browsing history.'),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendProductsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of supplement recommendations based on the catalog trends and user preferences.'),
});
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {schema: RecommendProductsInputSchema},
  output: {schema: RecommendProductsOutputSchema},
  prompt: `You are an expert in powdered supplements for recovery from exercise and social events. Based on the current catalog trends and user preferences, provide a list of product recommendations.

Current Catalog Trends: {{{catalogTrends}}}

User Preferences: {{#if userPreferences}}{{{userPreferences}}}{{else}}No user preferences provided.{{/if}}

Recommendations:`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
