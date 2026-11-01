import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, FlaskRound, Scale, Settings2 } from "lucide-react";
import { Callout, DifficultyBadge, MathPanel, PageHeader, SectionHeading } from "@/components/lab/primitives";
import { lessons } from "@/content/lessons";

export const Route = createFileRoute("/advanced-techniques")({
  head: () => ({
    meta: [
      { title: "Advanced Techniques — Random Forest Lab" },
      { name: "description", content: "OOB error, feature importance, imbalanced data and hyperparameter optimization." },
      { property: "og:title", content: "Advanced Techniques — Random Forest Lab" },
      { property: "og:description", content: "Go beyond the defaults with advanced Random Forest techniques." },
    ],
  }),
  component: AdvancedPage,
});

const items = [
  { slug: "oob-estimation", to: "/oob-estimation" as const, icon: FlaskRound },
  { slug: "feature-importance", to: "/feature-importance" as const, icon: BarChart3 },
  { slug: "imbalanced-data", to: "/imbalanced-data" as const, icon: Scale },
  { slug: "hyperparameter-optimization", to: "/hyperparameter-optimization" as const, icon: Settings2 },
];

function AdvancedPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Course", to: "/" }, { label: "Advanced Concepts" }, { label: "Advanced Techniques" }]} eyebrow="Documentation" title="Advanced Techniques" intro="Four techniques that separate a default forest from a well-engineered one." />
      <div className="mt-10 space-y-12">
        {items.map(({ slug, to, icon: Icon }, i) => {
          const l = lessons[slug]!;
          return (
            <section key={slug} className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <div>
                <SectionHeading index={`0${i + 1}`} title={l.title} desc={l.intro} />
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-accent" />
                  <DifficultyBadge level={l.difficulty} />
                </div>
                <Link to={to} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  Read the lesson <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                <MathPanel formula={l.formulas[0]!} />
                <Callout type="tip" title="Use case">{l.application}</Callout>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
