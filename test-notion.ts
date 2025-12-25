// Test script to verify Notion API connection
// Run with: node --loader ts-node/esm test-notion.ts

import { getNewsletterById, getAllNewsletters } from './lib/notion';

async function testNotionConnection() {
    console.log('Testing Notion API connection...\n');

    try {
        // Test 1: Get all newsletters
        console.log('Test 1: Fetching all newsletters...');
        const all = await getAllNewsletters();
        console.log(`✓ Found ${all.length} newsletters in database`);
        console.log('Template keys:', all.map(n => n.templateKey).join(', '));
        console.log('');

        // Test 2: Get specific newsletter by ID
        if (all.length > 0) {
            const firstKey = all[0].templateKey;
            console.log(`Test 2: Fetching newsletter with key "${firstKey}"...`);
            const newsletter = await getNewsletterById(firstKey);

            if (newsletter) {
                console.log('✓ Successfully fetched newsletter:');
                console.log(`  Title: ${newsletter.title}`);
                console.log(`  Author: ${newsletter.author}`);
                console.log(`  Time: ${newsletter.time}`);
                console.log(`  Annual Price: ${newsletter.annualPrice}`);
                console.log(`  Monthly Price: ${newsletter.monthlyPrice}`);
                console.log(`  CTA: ${newsletter.ctaText}`);
                console.log(`  Benefits: ${newsletter.benefits.length} items`);
                console.log(`  Consume: ${newsletter.consume ? newsletter.consume.substring(0, 50) + '...' : 'N/A'}`);
            } else {
                console.log('✗ Newsletter not found');
            }
        }

        console.log('\n✓ All tests passed!');
    } catch (error) {
        console.error('✗ Error during testing:', error);
        process.exit(1);
    }
}

testNotionConnection();
