import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Boxes, Sigma, FolderGit2, Shuffle, Vote, Scale, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForestDiagram } from "@/components/lab/ForestDiagram";
import { Eyebrow, ModuleCard, SectionHeading, StatusBadge, PlaceholderViz } from "@/components/lab/primitives";
import { featuredModules, roadmap } from "@/content/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Random Forest Lab — From Mathematics to Implementation" },
      { name: "description", content: "Explore how hundreds of decision trees work together. Learn the mathematics, algorithms and Python implementation of Random Forest." },
      { property: "og:title", content: "Random Forest Lab — From Mathematics to Implementation" },
      { property: "og:description", content: "A university-level course on Random Forest: theory, math and practice." },
    ],
  }),
  component: Index,
});

const stats = [
  { v: "10", l: "Learning Modules", icon: BookOpen },
  { v: "25+", l: "Core Concepts", icon: Boxes },
  { v: "15+", l: "Mathematical Topics", icon: Sigma },
  { v: "2", l: "Practical Projects", icon: FolderGit2 },
];

const labs = [
  { t: "Bootstrap Sampling", d: "Watch rows get drawn with replacement.", icon: Shuffle },
  { t: "Majority Voting", d: "See trees cast votes for a final class.", icon: Vote },
  { t: "Bias-Variance Tradeoff", d: "Explore how depth and trees shift error.", icon: Scale },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      {/* Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow>Machine Learning / Ensemble Methods</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Understand the Intelligence Behind <span className="text-gradient">Random Forest.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Explore how hundreds of decision trees work together to make powerful predictions. Learn the mathematics, understand the algorithms, and master practical implementation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/ensemble-learning">Start Learning <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/roadmap">Explore the Curriculum</Link></Button>
          </div>
        </div>
        <ForestDiagram />
      </section>

      {/* Stats */}
      <section className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="surface p-5">
            <s.icon className="size-4 text-accent" />
            <div className="mt-4 text-3xl font-semibold tracking-tight">{s.v}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Roadmap */}
      <section className="mt-24">
        <SectionHeading index="ROADMAP" title="Your learning journey" desc="Eight stages from first principles to production-ready implementation." />
        <ol className="relative space-y-3 border-l border-border pl-6 md:pl-8">
          {roadmap.map((r) => (
            <li key={r.n} className="relative">
              <span className="absolute -left-[31px] top-5 size-3 rounded-full border-2 border-primary bg-background md:-left-[39px]" />
              <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="font-mono text-sm text-primary">{r.n}</span>
                <div className="flex-1">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground">{r.desc}</div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" />{r.time}</span>
                <StatusBadge status={r.status} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Modules */}
      <section className="mt-24">
        <SectionHeading index="MODULES" title="Featured modules" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredModules.map((m) => <ModuleCard key={m.n} {...m} />)}
        </div>
      </section>

      {/* Lab preview */}
      <section className="mt-24">
        <SectionHeading index="LAB" title="Experiment with Random Forest." desc="Hands-on simulators — previewed here, fully interactive in the next phase." />
        <div className="grid gap-4 md:grid-cols-3">
          {labs.map((l) => (
            <Link key={l.t} to="/playground" className="surface group overflow-hidden hover:border-primary/40">
              <PlaceholderViz label={l.t} height={140} />
              <div className="p-5">
                <div className="flex items-center gap-2 font-medium"><l.icon className="size-4 text-primary" />{l.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{l.d}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 overflow-hidden rounded-2xl border border-border bg-card bg-grid p-10 text-center md:p-14">
        <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">Ready to understand how Random Forest actually works?</h2>
        <Button asChild size="lg" className="mt-8"><Link to="/ensemble-learning">Start Your Learning Journey <ArrowRight /></Link></Button>
      </section>
    </div>
  );
}
