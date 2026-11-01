import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { ModuleCard, PageHeader, ProgressBar, StatusBadge } from "@/components/lab/primitives";
import { featuredModules, roadmap } from "@/content/lessons";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Learning Roadmap — Random Forest Lab" },
      {
        name: "description",
        content: "The full Random Forest Lab curriculum organized into eight comprehensive stages.",
      },
      { property: "og:title", content: "Learning Roadmap — Random Forest Lab" },
      {
        property: "og:description",
        content: "The complete curriculum roadmap from first principles to production implementation.",
      },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader
        crumbs={[{ label: "Course", to: "/" }, { label: "Learning Roadmap" }]}
        eyebrow="Curriculum Overview"
        title="Learning Roadmap"
        intro="Eight comprehensive stages that take you from ensemble first principles to statistical derivations, hyperparameter optimization, and real-world production projects."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {roadmap.map((r, i) => (
          <div key={r.n} className="surface p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-primary">{r.n}</span>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-3 font-semibold text-foreground">{r.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5 text-accent" />
                {r.time}
              </span>
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle2 className="size-3.5" /> Fully Available
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Featured Course Modules</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/ensemble-learning">
            Start Stage 01 <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredModules.map((m) => (
          <ModuleCard key={m.n} {...m} />
        ))}
      </div>
    </div>
  );
}
