import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, Hash, XCircle } from "lucide-react";
import type { Lesson } from "@/content/lessons";
import { allNavItems } from "@/content/nav";
import { Callout, CodeBlock, DifficultyBadge, MathPanel, Meta, PageHeader, PlaceholderViz, SectionHeading } from "./primitives";

const sections = [
  ["introduction", "Introduction"],
  ["concept", "Conceptual Understanding"],
  ["math", "Mathematical Foundations"],
  ["visual", "Visual Explanation"],
  ["example", "Numerical Example"],
  ["implementation", "Practical Implementation"],
  ["application", "Real-World Application"],
  ["mistakes", "Common Mistakes"],
  ["takeaways", "Key Takeaways"],
  ["quiz", "Knowledge Check"],
] as const;

export function LessonTemplate({ lesson }: { lesson: Lesson }) {
  const idx = allNavItems.findIndex((i) => i.to === `/${lesson.slug}`);
  const next = allNavItems[idx + 1];
  const s = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <article className="min-w-0 flex-1">
        <PageHeader
          crumbs={[{ label: "Course", to: "/" }, { label: lesson.section }, { label: lesson.title }]}
          eyebrow={`Module ${lesson.module}`}
          title={lesson.title}
          intro={lesson.intro}
        >
          <Meta icon={Clock}>{lesson.readTime} read</Meta>
          <DifficultyBadge level={lesson.difficulty} />
        </PageHeader>

        <div className="space-y-14 pt-10">
          <section>
            <SectionHeading id="introduction" index={s(0)} title="Introduction" />
            <p className="leading-7 text-muted-foreground">{lesson.intro} This lesson builds intuition first, then formalises it with notation, and finally connects it to working Python code.</p>
          </section>

          <section>
            <SectionHeading id="concept" index={s(1)} title="Conceptual Understanding" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Callout type="info" title="Intuition">Think of each tree as an independent expert with a slightly different view of the data.</Callout>
              <Callout type="tip" title="Why it matters">Diversity among learners is what makes the combined answer more reliable.</Callout>
            </div>
          </section>

          <section>
            <SectionHeading id="math" index={s(2)} title="Mathematical Foundations" desc="Key equations used throughout this lesson." />
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.formulas.map((f) => <MathPanel key={f.label} formula={f} />)}
            </div>
          </section>

          <section>
            <SectionHeading id="visual" index={s(3)} title="Visual Explanation" />
            <PlaceholderViz label={`${lesson.title} visual`} />
          </section>

          <section>
            <SectionHeading id="example" index={s(4)} title="Numerical Example" />
            <div className="surface divide-y divide-border">
              {["Define the dataset", "Apply the formula", "Interpret the result"].map((t, i) => (
                <div key={t} className="flex items-start gap-4 p-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11px] text-primary">{i + 1}</span>
                  <div>
                    <div className="text-sm font-medium">{t}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">Worked values will be filled in during Phase 2.</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading id="implementation" index={s(5)} title="Practical Implementation" />
            <CodeBlock code={lesson.code} filename={`${lesson.slug.replace(/-/g, "_")}.py`} />
          </section>

          <section>
            <SectionHeading id="application" index={s(6)} title="Real-World Application" />
            <Callout type="info" title="In practice">{lesson.application}</Callout>
          </section>

          <section>
            <SectionHeading id="mistakes" index={s(7)} title="Common Mistakes" />
            <ul className="space-y-2">
              {lesson.mistakes.map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />{m}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading id="takeaways" index={s(8)} title="Key Takeaways" />
            <ul className="space-y-2">
              {lesson.takeaways.map((m) => (
                <li key={m} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />{m}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading id="quiz" index={s(9)} title="Knowledge Check" />
            <div className="surface p-5">
              <div className="font-medium">{lesson.question.prompt}</div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {lesson.question.options.map((o, i) => (
                  <div key={o} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + i)}</span>{o}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Answer checking arrives in the next development phase.</div>
            </div>
          </section>

          {next && (
            <Link to={next.to} className="surface group flex items-center justify-between p-5 hover:border-primary/40">
              <div>
                <div className="text-xs text-muted-foreground">Next lesson</div>
                <div className="mt-1 font-medium">{next.title}</div>
              </div>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </article>

      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-medium"><Hash className="size-3.5" />On this page</div>
        <ul className="space-y-1.5 border-l border-border">
          {sections.map(([id, t]) => (
            <li key={id}><a href={`#${id}`} className="-ml-px block border-l border-transparent pl-3 text-xs text-muted-foreground hover:border-primary hover:text-foreground">{t}</a></li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
