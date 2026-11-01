import { createFileRoute } from "@tanstack/react-router";
import { Brain, Sigma, Workflow, Wrench, Clock, ListChecks, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, PageHeader, ProgressBar, SectionHeading } from "@/components/lab/primitives";
import { toast } from "sonner";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Knowledge Assessment — Random Forest Lab" },
      { name: "description", content: "Test your understanding of Random Forest across concepts, maths, algorithms and practice." },
      { property: "og:title", content: "Knowledge Assessment — Random Forest Lab" },
      { property: "og:description", content: "Assess your Random Forest knowledge." },
    ],
  }),
  component: AssessmentPage,
});

const cats = [
  { t: "Conceptual Questions", n: 12, icon: Brain, p: 0 },
  { t: "Mathematical Questions", n: 10, icon: Sigma, p: 0 },
  { t: "Algorithmic Questions", n: 8, icon: Workflow, p: 0 },
  { t: "Practical Questions", n: 10, icon: Wrench, p: 0 },
];

const samples = [
  { cat: "Conceptual", q: "Why are Random Forest trees decorrelated?", level: "Beginner" as const },
  { cat: "Mathematical", q: "Derive the probability a row is excluded from a bootstrap sample.", level: "Intermediate" as const },
  { cat: "Algorithmic", q: "Order the steps of training a single tree within a forest.", level: "Intermediate" as const },
  { cat: "Practical", q: "Which hyperparameter would you tune first for a slow model?", level: "Advanced" as const },
];

function AssessmentPage() {
  const soon = () => toast("Coming in the next development phase");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Course", to: "/" }, { label: "Practice" }, { label: "Knowledge Assessment" }]} eyebrow="Assessment" title="Knowledge Assessment" intro="Forty questions across four areas. Measure what you know and find what to revisit." />

      <div className="surface mt-8 grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Full course quiz</h2>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><ListChecks className="size-4" />40 questions</span>
            <span className="flex items-center gap-1.5"><Clock className="size-4" />~45 minutes</span>
            <span className="flex items-center gap-1.5"><Target className="size-4" />Pass at 70%</span>
          </div>
        </div>
        <Button size="lg" onClick={soon}>Begin assessment</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c) => (
          <button key={c.t} onClick={soon} className="surface p-5 text-left hover:border-primary/40">
            <c.icon className="size-5 text-primary" />
            <div className="mt-4 font-medium">{c.t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.n} questions</div>
            <div className="mt-4"><ProgressBar value={c.p} /></div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">Not started</div>
          </button>
        ))}
      </div>

      <section className="mt-14">
        <SectionHeading title="Sample questions" />
        <div className="grid gap-4 md:grid-cols-2">
          {samples.map((s, i) => (
            <div key={s.q} className="surface p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary">Q{i + 1} · {s.cat.toUpperCase()}</span>
                <DifficultyBadge level={s.level} />
              </div>
              <p className="mt-3 font-medium">{s.q}</p>
              <div className="mt-4 h-9 rounded-md border border-dashed border-border" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
