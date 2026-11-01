import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Sigma,
  FolderGit2,
  Shuffle,
  Vote,
  Scale,
  Clock,
  Sparkles,
  GitFork,
  TrendingUp,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForestDiagram } from "@/components/lab/ForestDiagram";
import { Eyebrow, ModuleCard, SectionHeading, StatusBadge } from "@/components/lab/primitives";
import { featuredModules, roadmap } from "@/content/lessons";
import { labs } from "@/content/labs";
import { MathView } from "@/components/lab/MathView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Random Forest Lab — From Mathematics to Implementation" },
      {
        name: "description",
        content:
          "Explore how hundreds of decision trees work together. Master the mathematics, statistical theorems, Python workflows, and interactive simulations of Random Forest.",
      },
      { property: "og:title", content: "Random Forest Lab — From Mathematics to Implementation" },
      {
        property: "og:description",
        content: "A university-level course on Random Forest: theory, math, code, and practice.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { v: "16", l: "Curriculum Modules", icon: BookOpen },
  { v: "6", l: "Interactive Simulators", icon: FlaskConical },
  { v: "14", l: "Mathematical Proofs", icon: Sigma },
  { v: "2", l: "Production Case Studies", icon: FolderGit2 },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      {/* Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow>Machine Learning / Ensemble Architecture</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Understand the Intelligence Behind <span className="text-gradient">Random Forest.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Explore how hundreds of decision trees work together to make resilient predictions.
            Master the mathematical proofs, analyze algorithmic mechanisms, test live browser
            simulations, and implement production Scikit-Learn pipelines.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/ensemble-learning">
                Start Learning <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/playground">Explore Interactive Labs</Link>
            </Button>
          </div>
        </div>
        <ForestDiagram />
      </section>

      {/* Stats */}
      <section className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="surface p-5">
            <s.icon className="size-4 text-accent" />
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{s.v}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Roadmap */}
      <section className="mt-24">
        <SectionHeading
          index="ROADMAP"
          title="Your Structured Learning Journey"
          desc="Eight progressive stages taking you from first principles to production-grade deployment."
        />
        <ol className="relative space-y-3 border-l border-border pl-6 md:pl-8">
          {roadmap.map((r) => (
            <li key={r.n} className="relative">
              <span className="absolute -left-[31px] top-5 size-3 rounded-full border-2 border-primary bg-background md:-left-[39px]" />
              <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="font-mono text-sm text-primary font-bold">{r.n}</span>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{r.title}</div>
                  <div className="text-sm text-muted-foreground">{r.desc}</div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {r.time}
                </span>
                <StatusBadge status={r.status} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Featured Modules */}
      <section className="mt-24">
        <SectionHeading
          index="MODULES"
          title="Core Curriculum Modules"
          desc="Structured lessons with step-by-step derivations, numerical examples, and interactive knowledge checks."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredModules.map((m) => (
            <ModuleCard key={m.n} {...m} />
          ))}
        </div>
      </section>

      {/* Live Interactive Laboratories Showcase */}
      <section className="mt-24">
        <SectionHeading
          index="LABORATORY"
          title="Experiment with Random Forest Live"
          desc="Client-side TypeScript simulators performing real mathematical calculations with interactive sliders."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {labs.slice(0, 3).map((l) => (
            <Link
              key={l.id}
              to="/playground/$lab"
              params={{ lab: l.id }}
              className="surface group overflow-hidden p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <l.icon className="size-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">{l.shortTitle}</span>
                  </div>
                  <span className="rounded bg-success/10 border border-success/30 px-2 py-0.5 text-[10px] text-success font-medium">
                    Live
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{l.desc}</p>
                <div className="mt-3 rounded border border-border bg-secondary/30 p-2 text-center text-[11px] overflow-x-auto">
                  <MathView math={l.formula} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-medium text-primary">
                <span>Launch Lab</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/playground">
              View All 6 Laboratory Simulators <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl border border-border bg-card bg-grid p-10 text-center md:p-14">
        <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
          Ready to master how Random Forest actually operates?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Start from first principles with ensemble theory, or dive straight into mathematical proofs and interactive simulators.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/ensemble-learning">
              Begin Curriculum <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/assessment">Take Knowledge Assessment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
