export interface Episode {
  id: string;
  title: string;
  publishedAt: string;
  publishedAtRelative: string;
  coverImage?: string; // from API (episode/issue cover); falls back to channel.coverImage
  audioUrl?: string;
  aiSummary: string;
  isPlaying?: boolean;
  progress?: number;
  originalUrl: string;
  originalContent?: string; // HTML content of the newsletter
}

export interface Channel {
  id: string;
  name: string;
  creatorName: string;
  coverImage: string;
  description: string;
  isSubscribed: boolean;
}

export interface PlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
}
