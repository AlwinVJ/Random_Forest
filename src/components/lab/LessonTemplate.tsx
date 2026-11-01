import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Hash,
  XCircle,
  Calculator,
  Layers,
  Sparkles,
  BookOpen,
  Code2,
  ThumbsUp,
  AlertOctagon,
  ArrowUpRight,
} from "lucide-react";
import type { Lesson } from "@/content/lessons";
import { allNavItems } from "@/content/nav";
import {
  Callout,
  CodeBlock,
  DifficultyBadge,
  MathPanel,
  Meta,
  PageHeader,
  SectionHeading,
} from "./primitives";
import { LessonVisual } from "./LessonVisual";
import { LessonQuiz } from "./LessonQuiz";
import { MathView } from "./MathView";

const sectionList = [
  ["introduction", "1. Introduction"],
  ["necessity", "2. Why It's Necessary"],
  ["intuition", "3. Intuition"],
  ["theory", "4. Detailed Theory"],
  ["math", "5. Mathematical Formulation"],
  ["derivation", "6. Mathematical Derivation"],
  ["visual", "7. Architecture Diagram"],
  ["example", "8. Worked Numerical Example"],
  ["rf-connection", "9. Random Forest Connection"],
  ["implementation", "10. Python Implementation"],
  ["application", "11. Real-World Applications"],
  ["mistakes", "12. Common Misconceptions"],
  ["pros-cons", "13. Pros & Limitations"],
  ["takeaways", "14. Key Takeaways"],
  ["quiz", "15. Knowledge Check"],
] as const;

export function LessonTemplate({ lesson }: { lesson: Lesson }) {
  const currentNavIdx = allNavItems.findIndex((i) => i.to === `/${lesson.slug}`);
  const prevLesson = currentNavIdx > 0 ? allNavItems[currentNavIdx - 1] : null;
  const nextLesson =
    currentNavIdx >= 0 && currentNavIdx < allNavItems.length - 1
      ? allNavItems[currentNavIdx + 1]
      : null;

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <article className="min-w-0 flex-1">
        <PageHeader
          crumbs={[
            { label: "Course", to: "/" },
            { label: lesson.section },
            { label: lesson.title },
          ]}
          eyebrow={`Module ${lesson.module}`}
          title={lesson.title}
          intro={lesson.intro}
        >
          <Meta icon={Clock}>{lesson.readTime} read</Meta>
          <DifficultyBadge level={lesson.difficulty} />
        </PageHeader>

        <div className="space-y-14 pt-10">
          {/* 1. Introduction */}
          <section id="introduction" className="scroll-mt-24">
            <SectionHeading index="01" title="Introduction" />
            <p className="text-base leading-7 text-muted-foreground">{lesson.intro}</p>
          </section>

          {/* 2. Why Necessary */}
          <section id="necessity" className="scroll-mt-24">
            <SectionHeading index="02" title="Why This Concept Is Necessary" />
            <div className="surface border-l-4 border-l-primary p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="text-sm leading-relaxed text-foreground">
                  {lesson.whyNecessary}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Intuitive Explanation */}
          <section id="intuition" className="scroll-mt-24">
            <SectionHeading index="03" title="Intuitive Understanding" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Callout type="info" title="Intuition">
                {lesson.intuition}
              </Callout>
              <Callout type="tip" title="The High-Level Mental Model">
                Think of an ensemble like asking a diverse jury of specialists rather than relying
                on a single individual's opinion. Independent perspectives cancel individual biases.
              </Callout>
            </div>
          </section>

          {/* 4. Detailed Theory */}
          <section id="theory" className="scroll-mt-24">
            <SectionHeading index="04" title="Detailed Theoretical Explanation" />
            <div className="space-y-4">
              {lesson.theory.map((paragraph, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/70 bg-card/60 p-5 leading-relaxed text-muted-foreground text-sm"
                >
                  <p>{paragraph}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Mathematical Formulation */}
          <section id="math" className="scroll-mt-24">
            <SectionHeading
              index="05"
              title="Mathematical Formulation"
              desc="Rigorous definitions and governing equations."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.formulas.map((f) => (
                <MathPanel key={f.label} formula={f} />
              ))}
            </div>
          </section>

          {/* 6. Step-by-Step Mathematical Derivation */}
          {lesson.derivation && (
            <section id="derivation" className="scroll-mt-24">
              <SectionHeading
                index="06"
                title={`Mathematical Derivation: ${lesson.derivation.title}`}
                desc={lesson.derivation.description}
              />
              <div className="surface divide-y divide-border overflow-hidden">
                {lesson.derivation.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-4 p-5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 font-mono text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground">{st.step}</div>
                      {st.math && (
                        <div className="my-2.5 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-center overflow-x-auto">
                          <MathView math={st.math} display />
                        </div>
                      )}
                      <div className="text-xs leading-relaxed text-muted-foreground">{st.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Visual Explanation */}
          <section id="visual" className="scroll-mt-24">
            <SectionHeading
              index="07"
              title="Architecture & Mechanism Diagram"
              desc="Visual representation of dataflow, decision rules, and aggregation."
            />
            <LessonVisual slug={lesson.slug} />
          </section>

          {/* 8. Worked Numerical Example */}
          <section id="example" className="scroll-mt-24">
            <SectionHeading
              index="08"
              title={`Numerical Worked Example: ${lesson.workedExample.title}`}
              desc="Step-by-step arithmetic verification with concrete values."
            />
            <div className="surface overflow-hidden">
              <div className="border-b border-border bg-secondary/40 p-4">
                <span className="text-xs font-mono font-medium text-accent uppercase tracking-wider">
                  Problem Statement
                </span>
                <p className="mt-1 text-sm text-foreground">{lesson.workedExample.problem}</p>
              </div>
              <div className="divide-y divide-border">
                {lesson.workedExample.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-4 p-4.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-primary">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{st.title}</div>
                      <div className="my-2 rounded bg-background px-3 py-1.5 font-mono text-xs text-accent overflow-x-auto">
                        <MathView math={st.calculation} />
                      </div>
                      <p className="text-xs text-muted-foreground">{st.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border bg-secondary/20 p-4 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Final Computed Result:</span>
                <span className="font-mono text-sm font-semibold text-success">
                  {lesson.workedExample.result}
                </span>
              </div>
            </div>
          </section>

          {/* 9. Random Forest Connection */}
          <section id="rf-connection" className="scroll-mt-24">
            <SectionHeading index="09" title="How This Powers Random Forest" />
            <div className="surface p-5">
              <div className="flex items-start gap-3">
                <Layers className="mt-1 size-5 shrink-0 text-accent" />
                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">Algorithmic Integration:</p>
                  <p>{lesson.rfConnection}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Python Implementation */}
          <section id="implementation" className="scroll-mt-24">
            <SectionHeading
              index="10"
              title="Practical Python Implementation"
              desc="Production-grade implementation using Scikit-Learn."
            />
            <CodeBlock
              code={lesson.code}
              filename={`${lesson.slug.replace(/-/g, "_")}_workflow.py`}
            />
            {lesson.codeExplanation && (
              <div className="mt-3 text-xs leading-relaxed text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border">
                <span className="font-semibold text-foreground">Code Notes: </span>
                {lesson.codeExplanation}
              </div>
            )}
          </section>

          {/* 11. Real-World Application */}
          <section id="application" className="scroll-mt-24">
            <SectionHeading index="11" title="Real-World Application" />
            <Callout type="info" title="Industry Application Context">
              {lesson.application}
            </Callout>
          </section>

          {/* 12. Common Misconceptions */}
          <section id="mistakes" className="scroll-mt-24">
            <SectionHeading
              index="12"
              title="Common Misconceptions & Pitfalls"
              desc="Crucial mistakes practitioners make and how to avoid them."
            />
            <ul className="space-y-2.5">
              {lesson.mistakes.map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-muted-foreground"
                >
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 13. Pros and Cons */}
          {lesson.prosCons && (
            <section id="pros-cons" className="scroll-mt-24">
              <SectionHeading index="13" title="Advantages & Limitations" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="surface p-4 border-success/30 bg-success/5">
                  <div className="flex items-center gap-2 font-medium text-success text-sm mb-3">
                    <ThumbsUp className="size-4" />
                    Key Advantages
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {lesson.prosCons.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-success shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="surface p-4 border-warning/30 bg-warning/5">
                  <div className="flex items-center gap-2 font-medium text-warning text-sm mb-3">
                    <AlertOctagon className="size-4" />
                    Limitations & Tradeoffs
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {lesson.prosCons.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="size-3.5 text-warning shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* 14. Key Takeaways */}
          <section id="takeaways" className="scroll-mt-24">
            <SectionHeading index="14" title="Key Takeaways" />
            <ul className="space-y-2.5">
              {lesson.takeaways.map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3.5 text-sm text-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 15. Knowledge Check */}
          <section id="quiz" className="scroll-mt-24">
            <SectionHeading index="15" title="Interactive Knowledge Check" />
            <LessonQuiz quiz={lesson.quiz} lessonTitle={lesson.title} />
          </section>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-border pt-8">
            {prevLesson && (
              <Link
                to={prevLesson.to}
                className="surface group flex flex-1 items-center gap-3 p-4 hover:border-primary/40 transition-colors"
              >
                <ArrowLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground uppercase font-mono">
                    Previous Topic
                  </div>
                  <div className="truncate font-medium text-sm text-foreground">
                    {prevLesson.title}
                  </div>
                </div>
              </Link>
            )}

            {nextLesson && (
              <Link
                to={nextLesson.to}
                className="surface group flex flex-1 items-center justify-between p-4 hover:border-primary/40 transition-colors sm:ml-auto"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground uppercase font-mono">
                    Next Topic
                  </div>
                  <div className="truncate font-medium text-sm text-foreground">
                    {nextLesson.title}
                  </div>
                </div>
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </article>

      {/* Sticky Table of Contents on Wide Screens */}
      <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-56 shrink-0 overflow-y-auto pb-10 xl:block">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Hash className="size-3.5 text-primary" />
          Lesson Contents
        </div>
        <ul className="space-y-1 border-l border-border pl-2 text-xs">
          {sectionList.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="block truncate py-1 text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center gap-1 text-[11px] font-medium text-accent">
            <BookOpen className="size-3" />
            Interactive Lab
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Test the math live in the simulator.
          </p>
          <Link
            to="/playground"
            className="mt-2.5 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          >
            Open Playground <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
