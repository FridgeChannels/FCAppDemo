import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ScrollingTextProps {
  text: string;
  className?: string;
}

export const ScrollingText: React.FC<ScrollingTextProps> = ({ text, className }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);

  const cssVars = useMemo(() => {
    // Heuristic: longer overflow scrolls slower; clamp to keep it readable.
    const pxPerSecond = 40;
    const durationSeconds = Math.min(16, Math.max(6, scrollDistance / pxPerSecond));

    const vars: React.CSSProperties & {
      ["--title-scroll-distance"]?: string;
      ["--title-scroll-duration"]?: string;
    } = {};

    if (isOverflowing && scrollDistance > 0) {
      vars["--title-scroll-distance"] = `${scrollDistance}px`;
      vars["--title-scroll-duration"] = `${durationSeconds}s`;
    }

    return vars;
  }, [isOverflowing, scrollDistance]);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const update = () => {
      const distance = Math.max(0, textEl.scrollWidth - container.clientWidth);
      setScrollDistance(distance);
      setIsOverflowing(distance > 2);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(textEl);

    return () => {
      ro.disconnect();
    };
  }, [text]);

  return (
    <span ref={containerRef} className={cn("block max-w-full overflow-hidden", className)}>
      <span
        ref={textRef}
        className={cn(
          "inline-block",
          isOverflowing && scrollDistance > 0 ? "whitespace-nowrap title-marquee" : "whitespace-normal break-words"
        )}
        style={cssVars}
        title={text}
        aria-label={text}
      >
        {text}
      </span>
    </span>
  );
};


