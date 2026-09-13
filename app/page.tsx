import { Studio } from "@/components/studio/Studio";
import { Builds } from "@/components/builds/Builds";
import { Experience } from "@/components/Experience";
import { Journal } from "@/components/Journal";
import { Contact } from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Studio />
      <Builds />
      <Experience />
      <Journal />
      <Contact />
    </>
  );
}
