import { wedding } from "@/config/wedding";
import { EyebrowLabel, FloatingPetals, GoldDivider } from "./Ornaments";

/** Section 11 — RSVP contacts, family greetings and the closing farewell. */
export function ClosingSection() {
  return (
    <>
      {/* RSVP contacts */}
      <section id="rsvp-contacts" className="relative overflow-hidden bg-ivory px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <EyebrowLabel>R.S.V.P.</EyebrowLabel>
          <h2 className="mt-4 font-display text-3xl font-semibold uppercase tracking-[0.14em] text-burgundy sm:text-4xl">
            Please Confirm With Our Families
          </h2>
          <GoldDivider className="mt-6" />

          <ul className="mx-auto mt-12 grid max-w-2xl gap-x-8 gap-y-4 sm:grid-cols-2">
            {wedding.rsvpContacts.map((name) => (
              <li
                key={name}
                className="font-display text-lg font-medium text-burgundy sm:text-xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Family greetings & closing */}
      <section id="closing" className="relative overflow-hidden bg-gradient-to-b from-blush/60 via-cream to-ivory px-6 py-24 sm:py-32">
        <FloatingPetals count={9} />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <EyebrowLabel>With Best Compliments From</EyebrowLabel>
          <p className="mt-6 font-script text-5xl leading-tight text-burgundy sm:text-6xl">
            All Relatives &amp; Friends
          </p>

          <GoldDivider className="mt-10" />

          <p className="mx-auto mt-10 max-w-xl font-display text-2xl italic leading-relaxed text-burgundy/90">
            {wedding.closing.message}
          </p>

          <div className="mt-16">
            <h2 className="font-script text-4xl leading-tight text-burgundy sm:text-6xl md:text-7xl">
              Namandeep &amp; Parminder
            </h2>
            <p className="mt-6 font-display text-2xl font-medium tracking-[0.12em] text-gold-deep sm:text-3xl">
              21 November 2026
            </p>
          </div>

          <footer className="mt-16 border-t border-gold/30 pt-8 pb-12 sm:pb-6">
            <p className="font-body text-[0.70rem] sm:text-xs font-semibold tracking-wider text-burgundy">
              Capturing Love, Creating Memories — By SP EDITX WEDDING.
            </p>
            <p className="mt-2 font-body text-[0.60rem] font-medium uppercase tracking-[0.35em] text-dusty-rose">
              Made With Love · Muzaffarpur, Bihar
            </p>
          </footer>
        </div>
      </section>
    </>
  );
}
