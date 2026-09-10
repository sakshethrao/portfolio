import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { QuantumSightStrip } from "@/components/QuantumSightStrip";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <QuantumSightStrip />
      <About />
      <Contact />
    </>
  );
}
