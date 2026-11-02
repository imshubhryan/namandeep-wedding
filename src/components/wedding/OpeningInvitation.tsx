import { wedding } from "@/config/wedding";
import heroFloral from "@/assets/hero-floral.jpg";
import { FloatingPetals, GoldDivider } from "./Ornaments";

interface OpeningInvitationProps {
  isVisible?: boolean;
}

export function OpeningInvitation({ isVisible = true }: OpeningInvitationProps) {
  return (
    <section
      id="invitation"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-20"
    >
      {/* Mobile background with slight blur (< 640px) */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden scale-105 blur-[1px]"
        style={{ backgroundImage: `url(/images/abc.jpeg)` }}
      />
      {/* Desktop background (≥ 640px) */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center sm:block"
        style={{ backgroundImage: `url(${heroFloral})` }}
      />

      {/* Background overlay with soft vignette for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/70 via-ivory/50 to-ivory/75 sm:from-ivory/50 sm:via-ivory/30 sm:to-ivory/70 sm:backdrop-blur-[1px]" />
      <FloatingPetals count={10} />

      <div className={`relative z-10 mx-auto max-w-2xl text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <p className="font-body text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.45em] text-burgundy/80">
          Together With Our Families
        </p>

        <GoldDivider className="mt-4 sm:mt-6" />

        {/* Regal centered Couple Names */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center">
          <h1 className="font-script text-5xl leading-tight text-burgundy drop-shadow-sm sm:text-7xl md:text-8xl">
            Namandeep
          </h1>
          <span className="my-1 font-display text-xl sm:text-3xl italic text-dusty-rose">
            weds
          </span>
          <h1 className="font-script text-5xl leading-tight text-burgundy drop-shadow-sm sm:text-7xl md:text-8xl">
            Parminder
          </h1>
        </div>

        <GoldDivider className="mt-6 sm:mt-8" />

        <p className="mt-5 sm:mt-6 font-display text-lg sm:text-2xl italic font-semibold text-burgundy">
          {wedding.tagline}
        </p>

        <p className="mx-auto mt-3 max-w-lg font-body text-xs sm:text-base leading-relaxed font-medium text-foreground">
          {wedding.inviteMessage}
        </p>

        {/* Scroll cue with bottom buffer for floating music button */}
        <div className="mt-8 sm:mt-12 pb-6">
          <a
            href="#scratch-card"
            className="inline-flex flex-col items-center gap-1.5 text-burgundy transition-all hover:text-dusty-rose hover:scale-105 active:scale-95"
            aria-label="Scroll to reveal our wedding date"
          >
            <span className="font-body text-[0.62rem] font-bold uppercase tracking-[0.35em]">
              Scroll to Continue ↓
            </span>
            <span className="animate-soft-pulse block h-7 w-px bg-gold-deep" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
