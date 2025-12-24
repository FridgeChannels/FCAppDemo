import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";

import type { Channel, Episode } from "@/types/player";
import { mockChannel, mockEpisodes } from "@/data/mockData";
import { cn } from "@/lib/utils";

// Using mockData; dev team will replace with real API hook useFetchChannel() / useFetchEpisodeList()

interface ChannelRouteState {
  channel?: Channel; // from in-memory state (Index) or API in future
  episodes?: Episode[]; // from in-memory state (Index) or API in future
}

const ChannelPage = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const location = useLocation();

  const routeState = (location.state ?? null) as ChannelRouteState | null;

  const channel = routeState?.channel ?? mockChannel;
  const episodes = routeState?.episodes ?? mockEpisodes;

  const pageTitle = useMemo(() => {
    if (channelId && channelId !== channel.id) return `${channel.name} (from mock)`;
    return channel.name;
  }, [channelId, channel.id, channel.name]);

  return (
    <div className="min-h-screen bg-background no-scroll-x">
      <header className="sticky top-0 z-10 bg-background/75 backdrop-blur-md safe-area-top">
        <div className="flex w-full items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="inline-flex items-center justify-center p-2 min-h-[44px] min-w-[44px] text-neutral-800 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm touch-target"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 md:px-6 pt-0 pb-0 safe-area-bottom">
        <div className="flex min-h-[calc(100dvh-56px)] flex-col overflow-hidden">
          {/* Top summary (must be <= 1/3 of viewport height) */}
          <div className="min-h-[33vh] max-h-[40vh] shrink-0 overflow-hidden pt-2 pb-3">
            <section className="flex items-start gap-3 sm:gap-4 md:gap-6">
              <img
                src={channel.coverImage}
                alt={channel.name}
                className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl object-cover shadow-sm"
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-black/90 text-wrap-safe break-words">{channel.name}</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">by {channel.creatorName}</p>

                <div className="mt-3 sm:mt-4">
                  {channel.isSubscribed ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-200 px-3 py-2 min-h-[44px] text-xs sm:text-sm font-medium text-neutral-700 opacity-70 touch-target"
                    >
                      <Check className="h-4 w-4" />
                      <span>Subscribed</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/", { state: { openSubscription: true } })}
                      className="inline-flex items-center justify-center rounded-[5px] bg-red-600 px-3 py-2 min-h-[44px] text-xs sm:text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-target"
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-3 sm:mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</h3>
              <p className="mt-2 line-clamp-3 leading-relaxed text-black/80 text-wrap-safe break-words">{channel.description}</p>
            </section>
          </div>

          <div className="h-px bg-border/50" />

          {/* Episodes take remaining space; scroll within to avoid extra page whitespace */}
          <section className="flex-1 overflow-y-auto pt-4 sm:pt-5 pb-6 sm:pb-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-black/90">Episodes</h3>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {episodes.map((ep, index) => (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => navigate("/", { state: { playEpisodeId: ep.id, channel, episodes } })}
                  className={cn(
                    "flex w-full items-start gap-3 sm:gap-4 rounded-2xl bg-white p-3 sm:p-4 text-left transition-colors min-h-[80px]",
                    "hover:bg-red-500/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                  aria-label={`Play episode: ${ep.title}`}
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f6f1e7] to-[#efe3cf] text-xs font-semibold text-black/60">
                    EP{episodes.length - index}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-semibold text-sm sm:text-base text-black/90 text-wrap-safe break-words">{ep.title}</p>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{ep.publishedAt}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ChannelPage;


