import type { Project } from "@/lib/types";
import { PhoneShowcase } from "@/components/PhoneShowcase";
import { NurturePreview } from "@/components/nurture/NurturePreview";

/**
 * Picks the right in-device presentation for a project:
 * an interactive re-creation where one exists, otherwise the screenshot viewer.
 */
export function ProjectPhone({
  project,
  scale = 0.82,
}: {
  project: Project;
  scale?: number;
}) {
  if (project.slug === "nurture") {
    return <NurturePreview scale={scale + 0.06} />;
  }
  return (
    <PhoneShowcase
      screens={project.screens}
      title={project.title}
      tech={project.tech}
      scale={scale}
    />
  );
}
