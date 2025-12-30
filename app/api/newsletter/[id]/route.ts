import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterById } from '@/lib/data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get query parameters for partial fetching
        const url = new URL(request.url);
        const isBasic = url.searchParams.get('basic') === 'true';
        const excludePrompts = url.searchParams.get('excludePrompts') === 'true';

        if (!id) {
            return NextResponse.json(
                { error: 'Newsletter ID is required' },
                { status: 400 }
            );
        }

        const newsletter = await getNewsletterById(id, { excludeContent: isBasic, excludePrompts });

        if (!newsletter) {
            return NextResponse.json(
                { error: 'Newsletter not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(newsletter);
    } catch (error) {
        console.error('Error fetching newsletter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
