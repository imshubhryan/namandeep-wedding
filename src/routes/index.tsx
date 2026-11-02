import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OpeningInvitation } from "@/components/wedding/OpeningInvitation";
import { ScratchDateCard } from "@/components/wedding/ScratchDateCard";
import { CountdownSection } from "@/components/wedding/CountdownSection";
import { FamilyBlessings } from "@/components/wedding/FamilyBlessings";
import { Festivities } from "@/components/wedding/Festivities";
import { WeddingCeremony } from "@/components/wedding/WeddingCeremony";
import { AnandKaraj } from "@/components/wedding/AnandKaraj";
import { PhotoCarousel } from "@/components/wedding/PhotoCarousel";
import { Venues } from "@/components/wedding/Venues";
import { RsvpSection } from "@/components/wedding/RsvpSection";
import { ClosingSection } from "@/components/wedding/ClosingSection";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { WelcomeGate } from "@/components/wedding/WelcomeGate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Namandeep Weds Parminder — Wedding Invitation | 21 November 2026" },
      {
        name: "description",
        content:
          "Join us for the wedding of Namandeep and Parminder — festivities on 20 November, ceremony and Baraat on 21 November, and Anand Karaj on 22 November 2026 in Muzaffarpur, Bihar.",
      },
      { property: "og:title", content: "Namandeep Weds Parminder — Wedding Invitation" },
      {
        property: "og:description",
        content:
          "Together with our families, we invite you to celebrate the wedding of Namandeep and Parminder — 21 November 2026, Muzaffarpur.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://namandeepparminderwedding.vercel.app/" },
      { property: "og:image", content: "https://namandeepparminderwedding.vercel.app/images/laptop.png" },
      { property: "og:image:secure_url", content: "https://namandeepparminderwedding.vercel.app/images/laptop.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1920" },
      { property: "og:image:height", content: "1080" },
      { property: "og:image:alt", content: "Namandeep Weds Parminder Wedding Invitation" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Namandeep Weds Parminder — Wedding Invitation" },
      {
        name: "twitter:description",
        content:
          "Together with our families, we invite you to celebrate the wedding of Namandeep and Parminder — 21 November 2026, Muzaffarpur.",
      },
      { name: "twitter:image", content: "https://namandeepparminderwedding.vercel.app/images/laptop.png" },
    ],
  }),
  component: WeddingInvitationPage,
});

function WeddingInvitationPage() {
  const [entered, setEntered] = useState(false);
  const { startMusic, MusicPlayerUI } = MusicPlayer();

  const handleEnter = () => {
    startMusic(); // Starts music on user click — guaranteed user gesture
    setEntered(true);
  };

  return (
    <>
      {/* Audio element + floating pause/play button */}
      {MusicPlayerUI}

      {/* Welcome Gate — shown until user clicks "Open Invitation" */}
      {!entered && <WelcomeGate onEnter={handleEnter} />}

      <main className="min-h-screen bg-background overflow-x-hidden">
        <OpeningInvitation isVisible={entered} />
        <ScratchDateCard />
        <CountdownSection />
        <FamilyBlessings />
        <Festivities />
        <WeddingCeremony />
        <AnandKaraj />
        <PhotoCarousel />
        <Venues />
        <RsvpSection />
        <ClosingSection />
      </main>
    </>
  );
}
