import heroFloral from "@/assets/hero-floral.jpg";
import { FloatingPetals, GoldDivider } from "./Ornaments";

interface WelcomeGateProps {
  onEnter: () => void;
}

export function WelcomeGate({ onEnter }: WelcomeGateProps) {
  return (
    <section
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-end pb-8 sm:justify-center sm:pb-0 overflow-hidden px-4"
    >
      {/* Mobile background (< 640px) */}
      <div
        className="absolute inset-0 bg-cover bg-top sm:hidden"
        style={{ backgroundImage: `url(/images/mobile.png)` }}
      />
      {/* Desktop background (≥ 640px) */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center sm:block"
        style={{ backgroundImage: `url(${heroFloral})` }}
      />
      {/* Overlay: Desktop gets floral blur/tint; Mobile keeps image clear with subtle bottom contrast */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-b from-ivory/70 via-ivory/50 to-ivory/80 backdrop-blur-[2px]" />
      <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-black/5 via-transparent to-ivory/50 pointer-events-none" />

      <FloatingPetals count={8} />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">
        {/* Ik Onkar */}
        <p className="font-display text-xl sm:text-2xl tracking-[0.3em] text-gold-deep drop-shadow-sm">
          ੴ
        </p>

        <GoldDivider className="mt-2 sm:mt-3" />

        {/* Couple Names */}
        <div className="mt-3 sm:mt-6 flex flex-col items-center">
          <h1 className="font-script text-4xl sm:text-7xl leading-tight text-burgundy drop-shadow-sm">
            Namandeep
          </h1>
          <span className="my-0.5 sm:my-1 font-display text-base sm:text-2xl italic text-dusty-rose">
            &amp;
          </span>
          <h1 className="font-script text-4xl sm:text-7xl leading-tight text-burgundy drop-shadow-sm">
            Parminder
          </h1>
        </div>

        <p className="mt-2 sm:mt-4 font-display text-sm sm:text-xl italic tracking-wider text-burgundy/85">
          Wedding Invitation
        </p>

        <GoldDivider className="mt-3 sm:mt-6" />

        {/* CTA Button - Matches bridal theme on mobile, rich gold on desktop */}
        <button
          onClick={onEnter}
          type="button"
          className="group relative mt-5 sm:mt-10 overflow-hidden rounded-full border-2 border-gold/70 bg-gradient-to-r from-[#701A29] via-[#8B2338] to-[#701A29] sm:from-gold-deep sm:via-gold sm:to-gold-deep px-8 py-3.5 sm:px-12 sm:py-4 font-display text-xs sm:text-base font-semibold uppercase tracking-[0.25em] text-ivory shadow-lg shadow-burgundy/30 transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center">
            Open Invitation
          </span>
          {/* Shimmer light sweep */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </button>
      </div>
    </section>
  );
}
