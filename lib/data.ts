
import { supabase } from './supabase';
import { NewsletterData, RichTextElement } from './types/notion';

/**
 * Get newsletter data from Supabase by template key
 * @param templateKey - The template key value to search for
 * @returns Newsletter data or null if not found
 */
export async function getNewsletterById(templateKey: string, options: { excludeContent?: boolean; excludePrompts?: boolean } = {}): Promise<NewsletterData | null> {
    const { excludeContent = false, excludePrompts = false } = options;

    // Define columns to select based on options to optimize DB fetch
    // Always select core fields
    let selectColumns = [
        'id', 'template_key', 'title', 'author', 'time',
        'annual_price', 'monthly_price', 'cta_text',
        'benefits', 'consume', 'tts_url'
    ];

    // Conditionally add heavy/private fields
    if (!excludeContent) {
        selectColumns.push('content');
    }
    if (!excludePrompts) {
        selectColumns.push('benefits_prompt');
        selectColumns.push('consume_prompt');
    }

    const { data: rawData, error } = await supabase
        .from('newsletters')
        .select(selectColumns.join(','))
        .eq('template_key', templateKey)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // not found
            return null;
        }
        console.error('Error fetching newsletter from Supabase:', error);
        throw error;
    }

    const data = rawData as any;

    // Map to NewsletterData
    return {
        id: data.id,
        templateKey: data.template_key,
        title: data.title || '',
        author: data.author || '',
        content: excludeContent ? '' : (data.content || ''), // Omit content if requested
        // Wrap HTML in a "RichTextElement" so the frontend renderer detects it as HTML and renders it directly
        contentRichText: excludeContent ? [] : [{
            type: 'text',
            text: { content: data.content || '', link: null },
            annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
            plain_text: data.content || '',
            href: null
        }],
        time: data.time || '',
        annualPrice: data.annual_price || '',
        monthlyPrice: data.monthly_price || '',
        ctaText: data.cta_text || '',
        benefits: data.benefits || [],
        consume: data.consume || '',
        ttsUrl: data.tts_url || undefined,
        benefitsPrompt: excludePrompts ? '' : (data.benefits_prompt || ''),
        consumePrompt: excludePrompts ? '' : (data.consume_prompt || '')
    };
}

/**
 * Update a newsletter in Supabase
 */
export async function updateNewsletterById(pageId: string, data: Partial<NewsletterData>): Promise<boolean> {
    const updatePayload: any = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.author !== undefined) updatePayload.author = data.author;
    if (data.content !== undefined) updatePayload.content = data.content;
    if (data.time !== undefined) updatePayload.time = data.time;
    if (data.annualPrice !== undefined) updatePayload.annual_price = data.annualPrice;
    if (data.monthlyPrice !== undefined) updatePayload.monthly_price = data.monthlyPrice;
    if (data.ctaText !== undefined) updatePayload.cta_text = data.ctaText;
    if (data.benefits !== undefined) updatePayload.benefits = data.benefits;
    if (data.consume !== undefined) updatePayload.consume = data.consume;
    if (data.ttsUrl !== undefined) updatePayload.tts_url = data.ttsUrl;
    if (data.benefitsPrompt !== undefined) updatePayload.benefits_prompt = data.benefitsPrompt;
    if (data.consumePrompt !== undefined) updatePayload.consume_prompt = data.consumePrompt;

    updatePayload.updated_at = new Date().toISOString();

    const { error } = await supabase
        .from('newsletters')
        .update(updatePayload)
        .eq('id', pageId);

    if (error) {
        console.error('Error updating newsletter in Supabase:', error);
        throw error;
    }
    return true;
}
