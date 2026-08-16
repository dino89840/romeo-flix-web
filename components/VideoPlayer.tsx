"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function VideoPlayer({
  id,
  poster
}: {
  id: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshCount = useRef(0);

  async function refreshTicket(restore = true) {
    const video = videoRef.current;
    const currentTime = restore ? video?.currentTime ?? 0 : 0;
    const wasPlaying = restore ? video ? !video.paused : false : false;

    setLoading(true);

    try {
      const response = await fetch(`/api/ticket/${id}?mode=stream`, {
        cache: "no-store"
      });

      if (!response.ok) throw new Error("Ticket error");

      const data = (await response.json()) as { url: string };
      setSource(data.url);

      requestAnimationFrame(() => {
        if (!video) return;

        video.onloadedmetadata = async () => {
          if (currentTime > 0 && currentTime < video.duration) {
            video.currentTime = currentTime;
          }

          if (wasPlaying) {
            await video.play().catch(() => undefined);
          }

          setLoading(false);
        };

        video.load();
      });
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshTicket(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleError() {
    if (refreshCount.current >= 2) return;
    refreshCount.current += 1;
    refreshTicket(true);
  }

  return (
    <div className="video-shell">
      <video
        ref={videoRef}
        src={source}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        onError={handleError}
        onCanPlay={() => setLoading(false)}
      />

      {loading && (
        <div className="video-loading">
          <RefreshCw className="spin" />
          <span>Secure stream ချိတ်ဆက်နေသည်...</span>
        </div>
      )}
    </div>
  );
}
