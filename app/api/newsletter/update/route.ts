import { NextRequest, NextResponse } from 'next/server';
import { updateNewsletterById } from '@/lib/data';
import { NewsletterData } from '@/lib/types/notion';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pageId, data } = body;

        if (!pageId) {
            return NextResponse.json(
                { error: 'Page ID is required' },
                { status: 400 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Update data is required' },
                { status: 400 }
            );
        }

        const success = await updateNewsletterById(pageId, data as Partial<NewsletterData>);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Failed to update newsletter' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error updating newsletter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
