import { Episode, Channel } from '@/types/player';
import lennysCover from '@/assets/lennys-newsletter-cover.jpg';
// Using mockData; dev team will replace with real article fetch -> HTML pipeline.
import lennyOriginalContentHtml from "@/data/lennyOriginalContent.html?raw";

export const mockChannel: Channel = {
  id: 'channel-1',
  // Using mockData; dev team will replace with real API hook useFetchChannel()
  name: "Lenny's Newsletter",
  creatorName: 'Lenny Rachitsky',
  // Mock/local image (keeps project runnable offline)
  coverImage: lennysCover,
  description: 'Deeply researched product, growth, and career advice—newsletter, podcast, community, and living library.',
  isSubscribed: false, // Not subscribed
};

export const mockEpisodes: Episode[] = [
  {
    id: 'ep-01',
    // Using mockData; dev team will replace with real API hook useFetchEpisodeList()
    title: 'How to build a product users love (a practical playbook)',
    publishedAt: 'Sep 21',
    publishedAtRelative: '3 days ago',
    coverImage: '/episode1.png',
    aiSummary: 'A concise playbook for identifying the right problems, validating demand, and iterating toward a product users genuinely love—plus common traps to avoid.',
    originalUrl: 'https://example.com/lennys/ep-01',
    isPlaying: true,
    progress: 0,
  },
  {
    id: 'ep-02',
    title: 'Growth loops 101: turning acquisition into compounding growth',
    publishedAt: 'Sep 18',
    publishedAtRelative: '6 days ago',
    coverImage: '/episode2.png',
    aiSummary: 'An intro to growth loops: how to design, measure, and iterate loops that turn user activity into new acquisition—without relying on endless paid spend.',
    originalUrl: 'https://www.lennysnewsletter.com/p/a-builders-guide-to-living-a-long',
    originalContent: lennyOriginalContentHtml,
    progress: 12,
  },
  {
    id: 'ep-03',
    title: 'Career advice for high-leverage operators (what actually matters)',
    publishedAt: 'Sep 15',
    publishedAtRelative: '1 week ago',
    coverImage: '/episode3.png',
    aiSummary: 'Practical career guidance for operators: choosing the right scope, working with leaders, building influence, and making decisions that compound over time.',
    originalUrl: 'https://example.com/lennys/ep-03',
    progress: 36,
  },
  {
    id: 'ep-04',
    title: 'Pricing and packaging: how to charge what you’re worth',
    publishedAt: 'Sep 12',
    publishedAtRelative: '2 weeks ago',
    aiSummary: 'A practical framework for pricing, packaging, and positioning—how to pick the right value metric, avoid common pitfalls, and iterate without churn spikes.',
    originalUrl: 'https://example.com/lennys/ep-04',
    progress: 0,
  },
  {
    id: 'ep-05',
    title: 'Product strategy: making crisp bets with imperfect information',
    publishedAt: 'Sep 9',
    publishedAtRelative: '2 weeks ago',
    aiSummary: 'How to choose bets, define strategy constraints, and align stakeholders—plus a lightweight process for revisiting strategy as you learn.',
    originalUrl: 'https://example.com/lennys/ep-05',
    progress: 0,
  },
  {
    id: 'ep-06',
    title: 'Onboarding that converts: the first 10 minutes that matter',
    publishedAt: 'Sep 6',
    publishedAtRelative: '3 weeks ago',
    aiSummary: 'Designing onboarding to reach value fast: activation moments, progressive disclosure, and how to measure whether onboarding is actually working.',
    originalUrl: 'https://example.com/lennys/ep-06',
    progress: 0,
  },
  {
    id: 'ep-07',
    title: 'Hiring bar: how to build a team that compounds',
    publishedAt: 'Sep 3',
    publishedAtRelative: '3 weeks ago',
    aiSummary: 'Setting a hiring bar, running better interviews, and building a team that scales without slowing down execution or culture.',
    originalUrl: 'https://example.com/lennys/ep-07',
    progress: 0,
  },
  {
    id: 'ep-08',
    title: 'Building in public: when transparency helps (and hurts)',
    publishedAt: 'Aug 31',
    publishedAtRelative: '4 weeks ago',
    aiSummary: 'A guide to building in public: what to share, when to share it, and how to avoid distracting yourself from the work that matters.',
    originalUrl: 'https://example.com/lennys/ep-08',
    progress: 0,
  },
  {
    id: 'ep-09',
    title: 'Retention math: understanding why users come back',
    publishedAt: 'Aug 28',
    publishedAtRelative: '4 weeks ago',
    aiSummary: 'The mechanics of retention: cohorts, habit loops, and product surfaces that increase repeat usage without dark patterns.',
    originalUrl: 'https://example.com/lennys/ep-09',
    progress: 0,
  },
  {
    id: 'ep-10',
    title: 'Founder–PM alignment: how to avoid strategy thrash',
    publishedAt: 'Aug 25',
    publishedAtRelative: '1 month ago',
    aiSummary: 'How founders and PMs can align on strategy and decision-making so priorities don’t thrash—and teams don’t burn out.',
    originalUrl: 'https://example.com/lennys/ep-10',
    progress: 0,
  },
];
