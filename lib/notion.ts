import { NotionNewsletter, NewsletterData } from './types/notion';

// Initialize Notion credentials
const NOTION_TOKEN = process.env.NOTION_API_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = '2022-06-28';

/**
 * Get newsletter data from Notion by Magnet 模板键 (template key)
 * @param templateKey - The Magnet 模板键 value to search for
 * @returns Newsletter data or null if not found
 */
export async function getNewsletterById(templateKey: string): Promise<NewsletterData | null> {
    try {
        // Use Notion REST API directly instead of SDK
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filter: {
                    property: 'Magnet 模板键',
                    title: {
                        equals: templateKey,
                    },
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results.length === 0) {
            return null;
        }

        const page = data.results[0] as unknown as NotionNewsletter;
        return convertNotionToNewsletterData(page);
    } catch (error) {
        console.error('Error fetching newsletter from Notion:', error);
        throw error;
    }
}

/**
 * Convert Notion API response to our NewsletterData format
 */
function convertNotionToNewsletterData(notionPage: NotionNewsletter): NewsletterData {
    const props = notionPage.properties;

    // Helper function to extract plain text from rich_text array
    // Notion splits long content into multiple rich_text elements (2000 char limit per element)
    // We need to concatenate all elements to get the complete content
    const getText = (richText: Array<{ plain_text: string }> | undefined): string => {
        if (!richText || richText.length === 0) return '';
        return richText.map(item => item.plain_text).join('');
    };

    // Parse "You will get" field - split by newlines and filter out empty lines
    const benefitsText = getText(props["You will get"]?.rich_text);
    const benefits = benefitsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Remove leading bullet points or numbers if present
            return line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
        });

    return {
        id: notionPage.id,
        templateKey: getText(props['Magnet 模板键']?.title),
        title: getText(props['Newsletter 标题']?.rich_text),
        author: getText(props['作者']?.rich_text),
        content: getText(props['Newsletter 内容']?.rich_text), // Plain text for backward compatibility
        contentRichText: props['Newsletter 内容']?.rich_text || [], // Preserve rich text structure
        time: getText(props['时间']?.rich_text),
        annualPrice: getText(props['年订阅费用']?.rich_text),
        monthlyPrice: getText(props['月订阅费用']?.rich_text),
        ctaText: getText(props['CTA 文案']?.rich_text),
        benefits: benefits,
        consume: getText(props['consume']?.rich_text),
        ttsUrl: props['TTS 语音']?.url || getText(props['TTS 语音']?.rich_text), // Handle URL field or Text field
    };
}

/**
 * Get all newsletters from the database
 * Useful for listing or debugging
 */
export async function getAllNewsletters(): Promise<NewsletterData[]> {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data.results.map((page: any) =>
            convertNotionToNewsletterData(page as unknown as NotionNewsletter)
        );
    } catch (error) {
        console.error('Error fetching all newsletters from Notion:', error);
        throw error;
    }
}
/**
 * Update a newsletter page in Notion
 */

// Helper to sanitize content for Notion
function sanitizeContent(content: string): string {
    // Check if content contains base64 images
    if (content.includes('data:image')) {
        console.warn('Base64 images detected in content. Removing them to prevent payload size issues.');
        // Replace base64 image tags with a placeholder
        // This regex matches <img src="data:image...">
        return content.replace(/<img[^>]*src=["']data:image\/[^"']*["'][^>]*>/g, '<p><em>[Image removed: Base64 images are too large for Notion. Please use external image URLs.]</em></p>');
    }
    return content;
}

/**
 * Update a newsletter page in Notion
 */
export async function updateNewsletterById(pageId: string, data: Partial<NewsletterData>): Promise<boolean> {
    try {
        const properties: any = {};

        if (data.title) {
            properties['Newsletter 标题'] = {
                rich_text: [{ text: { content: data.title } }]
            };
        }

        if (data.author) {
            properties['作者'] = {
                rich_text: [{ text: { content: data.author } }]
            };
        }

        if (data.content) {
            // Sanitize content (remove base64 images)
            const cleanContent = sanitizeContent(data.content);

            // Notion has a 2000 character limit per text object
            // We need to split long content into multiple text objects
            const chunks = cleanContent.match(/.{1,2000}/g) || [];

            // Check if we are exceeding the max number of chunks (approx 100) or total size
            if (chunks.length > 100) {
                console.warn(`Content is very long (${chunks.length} chunks). Might hit Notion limits.`);
            }

            properties['Newsletter 内容'] = {
                rich_text: chunks.map(chunk => ({ text: { content: chunk } }))
            };
        }

        if (data.time) {
            properties['时间'] = {
                rich_text: [{ text: { content: data.time } }]
            };
        }

        if (data.annualPrice) {
            properties['年订阅费用'] = {
                rich_text: [{ text: { content: data.annualPrice } }]
            };
        }

        if (data.monthlyPrice) {
            properties['月订阅费用'] = {
                rich_text: [{ text: { content: data.monthlyPrice } }]
            };
        }

        // Updated helper: Ensure URL is valid or null
        if (data.ctaText !== undefined) { // Allow clearing if empty string
            properties['CTA 文案'] = {
                rich_text: [{ text: { content: data.ctaText } }]
            };
        }

        // Handle "You will get" (benefits) - convert array back to multiline string
        if (data.benefits) {
            const benefitsText = data.benefits.join('\n');
            properties['You will get'] = {
                rich_text: [{ text: { content: benefitsText } }]
            };
        }

        if (data.consume !== undefined) {
            properties['consume'] = {
                rich_text: [{ text: { content: data.consume } }]
            };
        }

        if (data.ttsUrl !== undefined) {
            // Ensure URL is absolute for Notion API "external" type requirements
            // In production, this should be the actual domain.
            // In dev, we use localhost.
            let absoluteUrl = data.ttsUrl;
            if (absoluteUrl && absoluteUrl.startsWith('/')) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                absoluteUrl = `${baseUrl}${absoluteUrl}`;
            }

            // Update "TTS 语音" (URL property)
            properties['TTS 语音'] = {
                url: absoluteUrl || null // Clear if empty string/null
            };

            // Update "TTS 源文件" (File property - External)
            if (absoluteUrl) {
                properties['TTS 源文件'] = {
                    files: [
                        {
                            name: `tts_${new Date().toISOString().split('T')[0]}.wav`,
                            type: "external",
                            external: {
                                url: absoluteUrl
                            }
                        }
                    ]
                };
            } else {
                // Clear if empty
                properties['TTS 源文件'] = {
                    files: []
                };
            }
        }

        const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                properties: properties
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();

            // Handle specific error codes
            if (response.status === 413) {
                throw new Error(`Notion API Error: Payload Too Large. The content (likely the newsletter body) is too large to save to Notion properties. Try reducing size or removing images.`);
            }

            throw new Error(`Notion API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating newsletter in Notion:', error);
        throw error;
    }
}
