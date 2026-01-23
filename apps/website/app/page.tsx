import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Industries from "@/components/Industries"; // Add this import
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Industries /> {/* Add this line */}
      <Pricing />
      <CTA />
    </>
  );
}