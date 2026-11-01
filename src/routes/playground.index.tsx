import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, PlaceholderViz } from "@/components/lab/primitives";
import { labs } from "@/content/labs";

export const Route = createFileRoute("/playground/")({
  head: () => ({
    meta: [
      { title: "Interactive Playground — Random Forest Lab" },
      { name: "description", content: "Laboratory-style simulators for bootstrap sampling, voting, regression and bias-variance." },
      { property: "og:title", content: "Interactive Playground — Random Forest Lab" },
      { property: "og:description", content: "Experiment with Random Forest in the lab." },
    ],
  }),
  component: Playground,
});

function Playground() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Course", to: "/" }, { label: "Practice" }, { label: "Interactive Playground" }]} eyebrow="Laboratory" title="Interactive Playground" intro="Four experiments to build intuition by doing. Pick a lab bench to begin." />
      <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground">
        <span className="rounded border border-border px-2 py-1">ENV: python-3.11</span>
        <span className="rounded border border-border px-2 py-1">SEED: 42</span>
        <span className="rounded border border-warning/30 px-2 py-1 text-warning">STATUS: preview</span>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {labs.map((l, i) => (
          <div key={l.id} className="surface overflow-hidden">
            <PlaceholderViz label={`lab_0${i + 1}`} height={170} />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <l.icon className="size-4 text-primary" />
                <h3 className="font-semibold">{l.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">{l.tags.map((t) => <span key={t} className="rounded bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}</div>
                <Button asChild size="sm"><Link to="/playground/$lab" params={{ lab: l.id }}>Launch Lab <ArrowRight /></Link></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
