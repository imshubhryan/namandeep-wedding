import { useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Called externally (from index.tsx) right after the user clicks
   * "Open Invitation" — guaranteed user gesture, so audio.play() works.
   */
  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.3;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return {
    startMusic,
    MusicPlayerUI: (
      <>
        <audio
          ref={audioRef}
          src="/audio/wedding-music.mp3"
          loop
          preload="auto"
          playsInline
        />

        {/* Floating Play / Pause Button */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <button
            onClick={togglePlayPause}
            type="button"
            aria-label={isPlaying ? "Pause Music" : "Play Music"}
            title={isPlaying ? "Pause Music" : "Play Music"}
            className={`group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gold/70 bg-gradient-to-br from-ivory via-white to-blush/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold hover:shadow-2xl active:scale-95 ${
              isPlaying ? "ring-2 ring-gold/50 shadow-gold/20" : "opacity-90 hover:opacity-100"
            }`}
          >
            {isPlaying && (
              <span className="absolute inset-0 -z-10 rounded-full bg-gold/25 animate-ping opacity-60 duration-1000" />
            )}

            {isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-burgundy text-burgundy transition-transform group-hover:scale-110" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5 fill-gold-deep text-gold-deep transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>
      </>
    ),
  };
}
