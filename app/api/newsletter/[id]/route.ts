import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterById } from '@/lib/data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Handle both sync and async params
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json(
                { error: 'Newsletter ID is required' },
                { status: 400 }
            );
        }

        const newsletter = await getNewsletterById(id);

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
