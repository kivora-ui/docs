import { FeatureGrid } from "@/components/home/feature-grid";
import { GalleryTeaser } from "@/components/home/gallery-teaser";
import { Hero } from "@/components/home/hero";
import { InstallSnippet } from "@/components/home/install-snippet";
import { StatsBar } from "@/components/home/stats-bar";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <InstallSnippet />
      <GalleryTeaser />
    </>
  );
}
