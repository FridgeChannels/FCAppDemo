export interface ChannelData {
    category: string;
    category_img: string; // URL for the circular image
    content: string;      // Title/Description
    voice_url: string;    // Audio Source URL
}

export const CHANNELS: ChannelData[] = [
    {
        category: "SOTHEBY'S",
        category_img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop&crop=center",
        content: "The Luxury Market Lowdown North Texas 2025",
        voice_url: "/audio/48e54e68.mp3"
    },
    {
        category: "Tech News",
        category_img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop&crop=center",
        content: "Apple Creator Studio Signals a Shift Toward AI-Powered Subscription Creativity",
        voice_url: "/audio/d8218526.mp3"
    },
    {
        category: "Sport",
        category_img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop&crop=center",
        content: "NBA Mid-Season Snapshot: Stability, Injuries, and Emerging Contenders",
        voice_url: "/audio/c784f245.mp3"
    },
    {
        category: "Lifestyle",
        category_img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop&crop=center",
        content: "Château Excellence: A Legacy of Terroir and Tradition",
        voice_url: "/audio/6d5d4873.mp3"
    },
    {
        category: "Business",
        category_img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop&crop=center",
        content: "Market Insights: Strategic Leadership and Global Commerce",
        voice_url: "https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/6d5d4873-60ee-474f-b98e-64ec17b704bc.mp3"
    },
    {
        category: "Entertainment",
        category_img: "https://images.unsplash.com/photo-1470229722913-7ea05107f5c3?w=200&h=200&fit=crop&crop=center",
        content: "Cultural Spotlight: Arts, Media, and Creative Expression",
        voice_url: "https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/6d5d4873-60ee-474f-b98e-64ec17b704bc.mp3"
    },
    {
        category: "Science",
        category_img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=200&h=200&fit=crop&crop=center",
        content: "Discovery Channel: Breakthroughs in Research and Innovation",
        voice_url: "https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/6d5d4873-60ee-474f-b98e-64ec17b704bc.mp3"
    },
    {
        category: "Travel",
        category_img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop&crop=center",
        content: "Wanderlust Chronicles: Destinations, Cultures, and Adventures",
        voice_url: "https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/6d5d4873-60ee-474f-b98e-64ec17b704bc.mp3"
    },
    {
        category: "Food",
        category_img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&crop=center",
        content: "Culinary Arts: Fine Dining, Recipes, and Gastronomic Journeys",
        voice_url: "https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/6d5d4873-60ee-474f-b98e-64ec17b704bc.mp3"
    }
];
