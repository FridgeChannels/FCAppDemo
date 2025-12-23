import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";

import type { Channel, Episode } from "@/types/player";
import { mockChannel, mockEpisodes } from "@/data/mockData";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <section className="flex items-start gap-4">
          <img
            src={channel.coverImage}
            alt={channel.name}
            className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-sm"
          />

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-black/90">{channel.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">by {channel.creatorName}</p>

            <div className="mt-4">
              {channel.isSubscribed ? (
                <Button type="button" variant="secondary" size="sm" disabled className="gap-2">
                  <Check className="h-4 w-4" />
                  Subscribed
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/", { state: { openSubscription: true } })}
                >
                  Subscribe
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</h3>
          <p className="mt-2 leading-relaxed text-black/80">{channel.description}</p>
        </section>

        <div className="my-0 h-px bg-border/50" />

        <section>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="mt-[5px] text-lg font-bold text-black/90">Episodes</h3>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {episodes.map((ep, index) => (
              <div
                key={ep.id}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-4 transition-colors",
                  "hover:bg-red-500/5",
                )}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f6f1e7] to-[#efe3cf] text-xs font-semibold text-black/60">
                  EP{episodes.length - index}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold text-black/90">{ep.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ep.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChannelPage;


