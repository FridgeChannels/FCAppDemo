import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  PlayerSurface, 
  ChannelHubOverlay,
  OriginalContentView,
  SubscriptionOverlay
} from '@/components/player';
import { mockChannel, mockEpisodes } from '@/data/mockData';
import { Episode } from '@/types/player';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(mockEpisodes[1]); // Start with middle episode for testing
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [channel, setChannel] = useState(mockChannel);

  // Overlay state
  const [isChannelHubOpen, setIsChannelHubOpen] = useState(false);
  const [isOriginalContentOpen, setIsOriginalContentOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // Simulated time (for demo purposes)
  const totalDuration = 3 * 60 + 23; // 03:23 in seconds
  const currentTimeSeconds = (progress / 100) * totalDuration;
  const remainingSeconds = totalDuration - currentTimeSeconds;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers
  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSeek = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const handleSkipBack = useCallback(() => {
    const newProgress = Math.max(0, progress - (15 / totalDuration) * 100);
    setProgress(newProgress);
  }, [progress, totalDuration]);

  const handleSkipForward = useCallback(() => {
    const newProgress = Math.min(100, progress + (30 / totalDuration) * 100);
    setProgress(newProgress);
  }, [progress, totalDuration]);

  // Click "Subscribe" button - open subscription page
  const handleOpenSubscription = useCallback(() => {
    setIsSubscriptionOpen(true);
  }, []);

  // Optional entry-point from other pages (e.g. Channel page) to open subscription flow.
  useEffect(() => {
    const state = location.state as { openSubscription?: boolean } | null;
    if (!state?.openSubscription) return;

    setIsSubscriptionOpen(true);
    // Clear navigation state so refresh/back doesn't repeatedly re-open.
    navigate(".", { replace: true, state: null });
  }, [location.state, navigate]);

  // Confirm subscription - automatically jump to original content page after successful subscription
  const handleConfirmSubscription = useCallback((plan: 'annual' | 'monthly' | 'free') => {
    if (plan === 'free') {
      toast({
        title: 'Free plan selected',
        description: 'You can upgrade to a paid subscription anytime',
      });
      setIsSubscriptionOpen(false);
    } else {
      setChannel(prev => ({ ...prev, isSubscribed: true }));
      toast({
        title: 'Subscription successful!',
        description: `You have successfully subscribed to ${channel.name}, redirecting to original content...`,
      });
      setIsSubscriptionOpen(false);
      setIsChannelHubOpen(false);
      // Automatically open original content page after successful subscription
      setTimeout(() => {
        setIsOriginalContentOpen(true);
      }, 500);
    }
  }, [channel.name, toast]);

  const handleViewOriginal = useCallback(() => {
    // Open original content in current page, instead of redirecting to external link
    setIsOriginalContentOpen(true);
  }, []);

  const handleSelectEpisode = useCallback((episode: Episode) => {
    setCurrentEpisode(episode);
    setProgress(episode.progress || 0);
    setIsPlaying(true);
  }, []);

  // Jump to next episode - seamless transition, same interface
  const handleNextEpisode = useCallback(() => {
    const currentIndex = mockEpisodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < mockEpisodes.length - 1) {
      const nextEpisode = mockEpisodes[currentIndex + 1];
      // Switch episode seamlessly, keep current playing state
      setCurrentEpisode(nextEpisode);
      setProgress(nextEpisode.progress || 0);
      // Keep the current playing state (if playing, continue playing; if paused, stay paused)
    }
  }, [currentEpisode.id]);

  // Jump to previous episode - seamless transition, same interface
  const handlePreviousEpisode = useCallback(() => {
    const currentIndex = mockEpisodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
      const previousEpisode = mockEpisodes[currentIndex - 1];
      // Switch episode seamlessly, keep current playing state
      setCurrentEpisode(previousEpisode);
      setProgress(previousEpisode.progress || 0);
      // Keep the current playing state (if playing, continue playing; if paused, stay paused)
    }
  }, [currentEpisode.id]);

  return (
    <>
      <PlayerSurface
        episode={currentEpisode}
        channel={channel}
        isPlaying={isPlaying}
        progress={progress}
        currentTime={formatTime(currentTimeSeconds)}
        duration={formatTime(totalDuration)}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onOpenChannelInfo={() =>
          navigate(`/channel/${channel.id}`, { state: { channel, episodes: mockEpisodes } })
        }
        onOpenEpisodeList={() => setIsChannelHubOpen(true)}
        onSubscribe={handleOpenSubscription}
        onViewOriginal={handleViewOriginal}
        onNextEpisode={handleNextEpisode}
        onPreviousEpisode={handlePreviousEpisode}
      />

      <ChannelHubOverlay
        channel={channel}
        episodes={mockEpisodes}
        currentEpisodeId={currentEpisode.id}
        isOpen={isChannelHubOpen}
        onClose={() => setIsChannelHubOpen(false)}
        onSubscribe={handleOpenSubscription}
        onSelectEpisode={handleSelectEpisode}
      />

      {/* Original Content View */}
      <OriginalContentView
        episode={currentEpisode}
        channel={channel}
        isOpen={isOriginalContentOpen}
        onClose={() => setIsOriginalContentOpen(false)}
      />

      {/* Subscription Page */}
      <SubscriptionOverlay
        channel={channel}
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        onSubscribe={handleConfirmSubscription}
      />
    </>
  );
};

export default Index;
