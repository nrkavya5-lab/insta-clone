"use client";

import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

interface ReelCardProps {
  src: string;
  playing?: boolean;
}

export default function ReelCard({ src, playing }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [playing]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
      onClick={togglePause}
    >
      {!loaded && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-white/40">Loading...</span>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        loop
        muted={muted}
        playsInline
        onLoadedData={() => setLoaded(true)}
        onTimeUpdate={handleTimeUpdate}
      />
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur hover:bg-black/70 transition-all z-10"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
      {playing && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#405de6] to-[#e1306c] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
