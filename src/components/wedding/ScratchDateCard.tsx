import { useCallback, useEffect, useRef, useState } from "react";
import { celebrate } from "@/lib/celebrate";
import { EyebrowLabel, FloatingPetals, GoldDivider } from "./Ornaments";
import { Sparkles } from "lucide-react";

// Mobile-friendly threshold: ~22% scratched is enough to reveal
const REVEAL_THRESHOLD = 0.22;

export function ScratchDateCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [canvasFading, setCanvasFading] = useState(false);
  const revealedRef = useRef(false);

  const triggerReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setCanvasFading(true);
    celebrate(); // Fire party poppers immediately!

    setTimeout(() => {
      setRevealed(true);
    }, 400);
  }, []);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cardWidth = wrap.clientWidth;
    let cardHeight = wrap.clientHeight;

    const sizeCanvas = () => {
      if (!wrap || !canvas) return;
      const rect = wrap.getBoundingClientRect();
      cardWidth = rect.width;
      cardHeight = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      paintTexture(rect.width, rect.height);
    };

    const paintTexture = (w: number, h: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#F7DDE6");
      base.addColorStop(0.5, "#F1C6D6");
      base.addColorStop(1, "#E8B5C7");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Soft floral suggestion: scattered translucent rosettes.
      for (let i = 0; i < 14; i++) {
        const cx = (((i * 137) % 100) / 100) * w;
        const cy = (((i * 61) % 100) / 100) * h;
        const r = 12 + ((i * 7) % 16);
        ctx.beginPath();
        for (let p = 0; p < 6; p++) {
          const a = (p / 6) * Math.PI * 2;
          ctx.moveTo(cx, cy);
          ctx.ellipse(
            cx + Math.cos(a) * r * 0.55,
            cy + Math.sin(a) * r * 0.55,
            r * 0.5,
            r * 0.32,
            a,
            0,
            Math.PI * 2,
          );
        }
        ctx.fillStyle = `rgba(199, 125, 147, ${0.06 + (i % 4) * 0.02})`;
        ctx.fill();
      }

      // Champagne-gold ornament dots
      for (let i = 0; i < 35; i++) {
        const x = (((i * 89) % 100) / 100) * w;
        const y = (((i * 47) % 100) / 100) * h;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(214, 181, 116, 0.65)";
        ctx.fill();
      }

      // Decorative text on the scratch surface
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${Math.max(12, Math.round(w * 0.038))}px 'Lato', sans-serif`;
      ctx.fillStyle = "rgba(128, 0, 32, 0.55)";
      ctx.fillText("✨ SCRATCH WITH FINGER HERE ✨", w / 2, h / 2);
    };

    sizeCanvas();

    let drawing = false;
    let lastX = -1;
    let lastY = -1;
    let strokeCount = 0;

    const brushTo = (x: number, y: number) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#000";
      // Responsive brush size (larger on mobile for easier scratching)
      const r = Math.max(28, Math.min(cardWidth * 0.09, 44));

      if (lastX >= 0) {
        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.max(1, Math.ceil(dist / (r * 0.4)));
        for (let i = 0; i <= steps; i++) {
          const ix = lastX + ((x - lastX) * i) / steps;
          const iy = lastY + ((y - lastY) * i) / steps;
          ctx.beginPath();
          ctx.arc(ix, iy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      lastX = x;
      lastY = y;
    };

    const scratchedRatio = () => {
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cleared = 0;
        let total = 0;
        const step = Math.max(4, Math.floor(10 * dpr));
        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const alpha = data[(y * canvas.width + x) * 4 + 3] ?? 255;
            total++;
            if (alpha < 80) cleared++;
          }
        }
        return total === 0 ? 0 : cleared / total;
      } catch {
        return 0;
      }
    };

    const getPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    // Pointer Events
    const handleStart = (clientX: number, clientY: number) => {
      drawing = true;
      lastX = -1;
      lastY = -1;
      const { x, y } = getPos(clientX, clientY);
      brushTo(x, y);
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!drawing) return;
      const { x, y } = getPos(clientX, clientY);
      brushTo(x, y);
      strokeCount++;

      // Check threshold every 6 move samples or after 18 strokes
      if (strokeCount % 6 === 0) {
        if (scratchedRatio() >= REVEAL_THRESHOLD || strokeCount >= 30) {
          triggerReveal();
        }
      }
    };

    const handleEnd = () => {
      if (!drawing) return;
      drawing = false;
      lastX = -1;
      lastY = -1;
      if (scratchedRatio() >= REVEAL_THRESHOLD || strokeCount >= 18) {
        triggerReveal();
      }
    };

    // Native Touch Listeners with { passive: false } to stop mobile scroll while scratching
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };

    // Mouse / Pointer Listeners
    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleEnd();
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", sizeCanvas);

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);

      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [revealed, triggerReveal]);

  const scrollToCountdown = useCallback(() => {
    document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="scratch-card" className="relative overflow-hidden bg-cream px-4 py-16 sm:px-6 sm:py-28">
      <FloatingPetals count={8} className="opacity-60" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <EyebrowLabel>A Special Date Awaits</EyebrowLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-burgundy sm:text-5xl">
          Scratch to Reveal Our Wedding Date
        </h2>
        <GoldDivider className="mt-4 sm:mt-6" />

        <div
          ref={wrapRef}
          className="relative mx-auto mt-8 aspect-[16/11] sm:aspect-[16/10] w-full max-w-lg select-none overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-gold/60 shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--color-burgundy)_45%,transparent)] touch-none"
        >
          {/* Hidden content beneath the scratch surface */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ivory via-blush/40 to-ivory px-4 py-6 text-center">
            <p className="font-body text-[0.6rem] font-bold uppercase tracking-[0.4em] text-dusty-rose sm:text-xs">
              Save the Date
            </p>
            <p className="mt-2 font-display text-2xl font-bold tracking-wider text-burgundy sm:text-4xl md:text-5xl">
              SATURDAY
            </p>
            <p className="mt-1 font-script text-4xl font-normal text-dusty-rose sm:text-6xl md:text-7xl">
              21 November 2026
            </p>
            <p className="mt-2 font-display text-xs italic text-gold-deep sm:text-base md:text-lg">
              Let the countdown to forever begin!
            </p>
          </div>

          {/* Scratch surface canvas */}
          {!revealed && (
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full cursor-pointer touch-none transition-opacity duration-400 ${
                canvasFading ? "opacity-0" : "opacity-100"
              }`}
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
              aria-label="Scratch the surface to reveal the wedding date"
              role="img"
            />
          )}
        </div>

        {/* Revealed action button */}
        {revealed ? (
          <div className="mt-8 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              type="button"
              onClick={scrollToCountdown}
              className="rounded-full bg-burgundy px-7 py-3 font-body text-xs font-bold uppercase tracking-[0.25em] text-ivory shadow-lg transition-all hover:bg-dusty-rose hover:scale-105 active:scale-95"
            >
              Continue to Our Wedding ↓
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="font-body text-xs tracking-wide text-muted-foreground">
              Rub your finger or mouse across the card to scratch
            </p>
            <button
              type="button"
              onClick={triggerReveal}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-deep/50 bg-ivory/80 px-4 py-1.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-burgundy transition-all hover:bg-gold/20 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-deep" />
              Tap to Reveal Instantly
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
