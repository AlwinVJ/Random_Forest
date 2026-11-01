import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { ModuleCard, PageHeader, ProgressBar, StatusBadge } from "@/components/lab/primitives";
import { featuredModules, roadmap } from "@/content/lessons";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Learning Roadmap — Random Forest Lab" },
      { name: "description", content: "The full Random Forest Lab curriculum in eight stages." },
      { property: "og:title", content: "Learning Roadmap — Random Forest Lab" },
      { property: "og:description", content: "The full Random Forest Lab curriculum in eight stages." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Course", to: "/" }, { label: "Learning Roadmap" }]} eyebrow="Overview" title="Learning Roadmap" intro="Eight stages that take you from intuition to implementation." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {roadmap.map((r, i) => (
          <div key={r.n} className="surface p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-semibold text-primary">{r.n}</span>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-3 font-medium">{r.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={Math.max(0, 100 - i * 18)} />
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{r.time}</span>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-14 mb-5 text-xl font-semibold">Start a module</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredModules.map((m) => <ModuleCard key={m.n} {...m} />)}
      </div>
    </div>
  );
}
