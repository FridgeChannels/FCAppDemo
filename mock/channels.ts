// Using mock data; dev team will replace with real API hook useFetchChannelBySlug()

export interface NewsletterItem {
  id: string; // from API
  title: string; // from API
  authorName: string; // from API
  readMinutes: number; // from API
  thumbnailUrl: string; // from API
}

export interface Channel {
  slug: string; // from API
  name: string; // from API
  description: string; // from API
  imageUrl: string; // from API
  newsletters: NewsletterItem[]; // from API
}

export const mockChannels: Channel[] = [
  {
    slug: 'justin-mares',
    name: 'Justin Mares',
    description: 'Builders, health, and performance — curated notes that stay practical.',
    imageUrl: '/images/magnet-channel.svg',
    newsletters: [
      {
        id: 'jm-1',
        title: "A Builder’s Guide to Living a Long and Healthy Life",
        authorName: 'Justin Mares',
        readMinutes: 15,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'ju-2',
        title: 'What I Learned This Week',
        authorName: 'Justin Mares',
        readMinutes: 6,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'ju-3',
        title: 'A Small Framework for Big Decisions',
        authorName: 'Justin Mares',
        readMinutes: 8,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'ju-4',
        title: 'Notes on Craft and Consistency',
        authorName: 'Justin Mares',
        readMinutes: 12,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'ju-5',
        title: 'The Cost of Convenience',
        authorName: 'Justin Mares',
        readMinutes: 9,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
    ],
  },
  {
    slug: 'franklin-foer',
    name: 'Franklin Foer',
    description: 'Politics, institutions, and power — with a calm, long-view lens.',
    imageUrl: '/images/magnet-channel.svg',
    newsletters: [
      {
        id: 'ff-1',
        title: 'Project Mars',
        authorName: 'Franklin Foer',
        readMinutes: 15,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'fr-2',
        title: 'What I Learned This Week',
        authorName: 'Franklin Foer',
        readMinutes: 6,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'fr-3',
        title: 'A Small Framework for Big Decisions',
        authorName: 'Franklin Foer',
        readMinutes: 8,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'fr-4',
        title: 'Notes on Craft and Consistency',
        authorName: 'Franklin Foer',
        readMinutes: 12,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'fr-5',
        title: 'The Cost of Convenience',
        authorName: 'Franklin Foer',
        readMinutes: 9,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
    ],
  },
  {
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    description: 'AI, products, and society — short weekly notes you can read fast.',
    imageUrl: '/images/magnet-channel.svg',
    newsletters: [
      {
        id: 'sc-1',
        title: 'The Most Dangerous Kind of Friendship',
        authorName: 'Sarah Chen',
        readMinutes: 10,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'sc-2',
        title: 'Under a Supermoon',
        authorName: 'Sarah Chen',
        readMinutes: 2,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'sc-3',
        title: 'How Jimmy O. Yang Became a Main Character',
        authorName: 'Sarah Chen',
        readMinutes: 25,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'sa-4',
        title: 'What I Learned This Week',
        authorName: 'Sarah Chen',
        readMinutes: 6,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'sa-5',
        title: 'A Small Framework for Big Decisions',
        authorName: 'Sarah Chen',
        readMinutes: 8,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
    ],
  },
  {
    slug: 'michael-rodriguez',
    name: 'Michael Rodriguez',
    description: 'Climate, energy, and sustainability — the signal over the noise.',
    imageUrl: '/images/magnet-channel.svg',
    newsletters: [
      {
        id: 'mr-1',
        title: 'Climate Action and Sustainability',
        authorName: 'Michael Rodriguez',
        readMinutes: 12,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'mi-2',
        title: 'What I Learned This Week',
        authorName: 'Michael Rodriguez',
        readMinutes: 6,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'mi-3',
        title: 'A Small Framework for Big Decisions',
        authorName: 'Michael Rodriguez',
        readMinutes: 8,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'mi-4',
        title: 'Notes on Craft and Consistency',
        authorName: 'Michael Rodriguez',
        readMinutes: 12,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'mi-5',
        title: 'The Cost of Convenience',
        authorName: 'Michael Rodriguez',
        readMinutes: 9,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
    ],
  },
  {
    slug: 'emily-johnson',
    name: 'Emily Johnson',
    description: 'Remote work, careers, and digital life — modern patterns that stick.',
    imageUrl: '/images/magnet-channel.svg',
    newsletters: [
      {
        id: 'ej-1',
        title: 'The Future of Remote Work',
        authorName: 'Emily Johnson',
        readMinutes: 8,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'em-2',
        title: 'What I Learned This Week',
        authorName: 'Emily Johnson',
        readMinutes: 6,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'em-3',
        title: 'A Small Framework for Big Decisions',
        authorName: 'Emily Johnson',
        readMinutes: 8,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'em-4',
        title: 'Notes on Craft and Consistency',
        authorName: 'Emily Johnson',
        readMinutes: 12,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
      {
        id: 'em-5',
        title: 'The Cost of Convenience',
        authorName: 'Emily Johnson',
        readMinutes: 9,
        thumbnailUrl: '/images/newsletter-thumb.svg',
      },
    ],
  },
];

export function getMockChannelBySlug(slug: string): Channel | undefined {
  return mockChannels.find((c) => c.slug === slug);
}
