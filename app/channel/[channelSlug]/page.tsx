import { notFound } from 'next/navigation';

import { Header } from '@/components/Header';
import { ChannelHeader } from '@/components/channel-header/ChannelHeader';
import { NewsletterList } from '@/components/newsletter-list/NewsletterList';
import { getMockChannelBySlug } from '@/mock/channels';

interface ChannelPageProps {
  params: Promise<{ channelSlug: string }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelSlug } = await params;
  const channel = getMockChannelBySlug(channelSlug);

  if (!channel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      <Header showPlayButton={false} />
      <ChannelHeader imageUrl={channel.imageUrl} name={channel.name} description={channel.description} />
      <NewsletterList items={channel.newsletters} />
    </div>
  );
}
