import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterById, updateNewsletterById } from '@/lib/data';

export async function GET(request: NextRequest) {
    try {
        // 1. Get the page
        const newsletter = await getNewsletterById('magnet-green-thin');
        if (!newsletter) {
            return NextResponse.json({ error: 'Newsletter not found. Please seed the database first.' }, { status: 404 });
        }

        // 2. Update with dummy TTS URL
        const dummyUrl = 'https://www.google.com/test-audio.wav';

        console.log(`Updating page ${newsletter.id} with TTS URL: ${dummyUrl}`);

        await updateNewsletterById(newsletter.id, {
            ttsUrl: dummyUrl,
            consume: `Test update at ${new Date().toISOString()}`
        });

        return NextResponse.json({
            success: true,
            message: 'Updated Database successfully',
            pageId: newsletter.id,
            urlUsed: dummyUrl
        });

    } catch (error) {
        console.error("Test Update Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
