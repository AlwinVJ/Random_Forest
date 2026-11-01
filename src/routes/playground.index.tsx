import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/lab/primitives";
import { MathView } from "@/components/lab/MathView";
import { labs } from "@/content/labs";

export const Route = createFileRoute("/playground/")({
  head: () => ({
    meta: [
      { title: "Interactive Playground — Random Forest Lab" },
      {
        name: "description",
        content:
          "Six hands-on browser simulations performing real-time mathematical calculations for Random Forest algorithms.",
      },
      { property: "og:title", content: "Interactive Playground — Random Forest Lab" },
      { property: "og:description", content: "Interactive Random Forest Laboratory Simulators." },
    ],
  }),
  component: PlaygroundIndexPage,
});

function PlaygroundIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        crumbs={[
          { label: "Course", to: "/" },
          { label: "Practice" },
          { label: "Interactive Playground" },
        ]}
        eyebrow="Interactive Simulators"
        title="Random Forest Laboratory"
        intro="Six browser-based experiments performing genuine calculations in real time. Manipulate dataset sizes, split thresholds, and ensemble parameters to verify theoretical theorems empirically."
      />

      <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] text-muted-foreground">
        <span className="rounded border border-border px-2.5 py-1 bg-secondary/30">
          ENGINE: TypeScript / Client-Side
        </span>
        <span className="rounded border border-border px-2.5 py-1 bg-secondary/30">
          EXPERIMENTS: 6 Live Labs
        </span>
        <span className="rounded border border-success/30 px-2.5 py-1 text-success bg-success/10 font-semibold">
          STATUS: Fully Interactive
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {labs.map((l, i) => (
          <div
            key={l.id}
            className="surface flex flex-col justify-between overflow-hidden p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                    <l.icon className="size-4" />
                  </div>
                  <span className="font-mono text-xs text-primary font-bold">
                    LAB 0{i + 1}
                  </span>
                </div>
                <div className="flex gap-1">
                  {l.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="mt-3.5 text-base font-semibold text-foreground">{l.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{l.desc}</p>

              {/* Math snippet preview */}
              <div className="mt-4 rounded-md border border-border bg-secondary/20 p-2 text-center text-xs overflow-x-auto">
                <span className="text-[10px] font-mono text-muted-foreground block mb-0.5">
                  {l.formulaName}
                </span>
                <MathView math={l.formula} />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <Button asChild size="sm" className="w-full text-xs gap-1.5">
                <Link to="/playground/$lab" params={{ lab: l.id }}>
                  Launch Experiment <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
