// Debug script to see raw Notion API response

const NOTION_TOKEN = process.env.NOTION_API_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = '2022-06-28';

async function debugNotionProperties() {
    console.log('Fetching raw Notion data...\n');

    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (data.results.length > 0) {
        const page = data.results[0];
        console.log('Available properties:');
        console.log(Object.keys(page.properties).join('\n'));
        console.log('\n\nFull properties object:');
        console.log(JSON.stringify(page.properties, null, 2));
    }
}

debugNotionProperties();
