
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface GenerateRequest {
    prompt: string;
    content: string;
}

// Pricing configuration (per 1M tokens)
const PRICING = {
    input: 0.25,
    cached_input: 0.025,
    output: 2.00
};

/**
 * Helper to strip HTML tags and remove base64 content, keeping only text.
 */
function cleanHtmlContent(html: string): string {
    if (!html) return '';

    // 1. Replace block-level tags with newlines to preserve structure
    let text = html.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
    text = text.replace(/<br\s*\/?>/gi, '\n');

    // 2. Remove all generic HTML tags (this includes <img src="data:..."> which removes base64)
    text = text.replace(/<[^>]+>/g, '');

    // 3. Decode common HTML entities (basic ones)
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // 4. Collapse multiple newlines/spaces
    return text.replace(/\n\s*\n/g, '\n').trim();
}

export async function POST(request: NextRequest) {
    try {
        const { prompt, content } = await request.json() as GenerateRequest;

        if (!prompt || !content) {
            return NextResponse.json(
                { error: 'Prompt and content are required' },
                { status: 400 }
            );
        }

        // Initialize OpenAI client
        // Uses OPENAI_API_KEY from environment variables by default
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Clean content to remove HTML tags and base64 images
        const cleanedContent = cleanHtmlContent(content);

        // Replace placeholder {content} with actual cleaned content
        const finalPrompt = prompt.replace('{content}', cleanedContent);

        const startTime = Date.now();

        const response = await openai.chat.completions.create({
            model: 'gpt-5-mini', // User specified model
            messages: [
                { role: 'user', content: finalPrompt }
            ],
            // temperature: 0.7, // caused 400 error with gpt-5-mini
        });

        const completion = response.choices[0]?.message?.content || '';
        const usage = response.usage;

        // Calculate cost
        let cost = 0;
        if (usage) {
            const inputTokens = usage.prompt_tokens || 0;
            // Note: usage.prompt_tokens_details?.cached_tokens is not standard in all SDK versions yet, 
            // but if available we use it. For now assuming standard input unless detailed.
            // Standard OpenAI response structure might vary slightly for cached tokens depending on provider.
            // We'll trust the main token counts for now.

            const outputTokens = usage.completion_tokens || 0;

            // Basic calculation (assuming no cache breakdown available in standard response type yet)
            // If the provider supports 'prompt_tokens_details', we can refine this.
            // For now: (Input * 0.25 + Output * 2.00) / 1,000,000
            cost = ((inputTokens * PRICING.input) + (outputTokens * PRICING.output)) / 1000000;
        }

        return NextResponse.json({
            generatedText: completion,
            usage: usage,
            cost: cost,
            duration: Date.now() - startTime
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}
