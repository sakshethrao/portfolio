import { preload } from "react-dom";
import { Studio } from "@/components/studio/Studio";
import { Builds } from "@/components/builds/Builds";
import { Experience } from "@/components/Experience";
import { Journal } from "@/components/Journal";
import { Contact } from "@/components/Contact";

export default function HomePage() {
  // the desk's wood and room light start downloading with the HTML, not after the scripts
  for (const href of ["/studio/oak-diff.webp", "/studio/oak-nor.webp", "/studio/oak-rough.webp"]) preload(href, { as: "image", crossOrigin: "anonymous" });
  preload("/studio/room.hdr", { as: "fetch", crossOrigin: "anonymous" });
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
