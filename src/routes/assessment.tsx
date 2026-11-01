import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  Sigma,
  Workflow,
  Wrench,
  Clock,
  ListChecks,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeading, ProgressBar, Callout, DifficultyBadge } from "@/components/lab/primitives";
import { cn } from "@/lib/utils";
import { assessmentQuestions, type AssessmentQuestion } from "@/content/assessment-questions";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Knowledge Assessment — Random Forest Lab" },
      {
        name: "description",
        content:
          "Test your mastery of Random Forest across conceptual theory, mathematics, algorithmic hyperparameters, and Python implementation.",
      },
      { property: "og:title", content: "Knowledge Assessment — Random Forest Lab" },
      {
        property: "og:description",
        content: "Interactive 50-question examination for Random Forest.",
      },
    ],
  }),
  component: AssessmentEnginePage,
});

const categories = ["All", "Conceptual", "Mathematical", "Algorithmic", "Practical"] as const;

function AssessmentEnginePage() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [selectedDiff, setSelectedDiff] = useState<string>("All");
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const filteredQuestions = assessmentQuestions.filter((q) => {
    const matchCat = selectedCat === "All" || q.category === selectedCat;
    const matchDiff = selectedDiff === "All" || q.difficulty === selectedDiff;
    return matchCat && matchDiff;
  });

  const answeredCount = Object.keys(submittedQuestions).length;
  const correctCount = Object.entries(submittedQuestions).filter(
    ([qId, isSubmitted]) =>
      isSubmitted && userAnswers[qId] === assessmentQuestions.find((q) => q.id === qId)?.answerIndex,
  ).length;

  const scorePercentage =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submittedQuestions[questionId]) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setSubmittedQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuestion = (questionId: string) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setSubmittedQuestions((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleResetAll = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        crumbs={[
          { label: "Course", to: "/" },
          { label: "Practice" },
          { label: "Knowledge Assessment" },
        ]}
        eyebrow="Certification Examination"
        title="Knowledge Assessment Engine"
        intro="Fifty rigorous examination questions testing deep conceptual intuition, mathematical derivations, algorithmic hyperparameters, and production Python scenarios."
      />

      {/* Live Exam Dashboard */}
      <div className="surface mt-8 grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Comprehensive Course Examination</h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ListChecks className="size-4 text-accent" /> 50 In-Depth Questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-accent" /> Self-Paced (~60 min)
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="size-4 text-accent" /> Passing Benchmark: 70%
            </span>
          </div>

          {/* Difficulty Distribution Counter */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Pool Balance:</span>
            <span className="rounded bg-success/10 border border-success/30 px-2 py-0.5 text-success">
              15 Beginner
            </span>
            <span className="rounded bg-accent/10 border border-accent/30 px-2 py-0.5 text-accent">
              20 Intermediate
            </span>
            <span className="rounded bg-primary/10 border border-primary/30 px-2 py-0.5 text-primary">
              15 Advanced
            </span>
          </div>
        </div>

        {/* Live Scorecard */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-secondary/40 border border-border p-4 rounded-xl">
          <div className="text-center sm:text-right">
            <div className="text-xs font-mono text-muted-foreground uppercase">Exam Score</div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {correctCount} / {answeredCount}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({scorePercentage}%)
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {scorePercentage >= 70 ? (
                <span className="text-success font-medium">Passing Pace (≥ 70%)</span>
              ) : answeredCount > 0 ? (
                <span className="text-warning font-medium">Below Target (&lt; 70%)</span>
              ) : (
                "Not Started"
              )}
            </div>
          </div>
          {answeredCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              className="text-xs gap-1.5"
            >
              <RotateCcw className="size-3.5" /> Reset Exam
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar: Category & Difficulty */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {cat} {cat !== "All" ? `(${assessmentQuestions.filter((q) => q.category === cat).length})` : `(${assessmentQuestions.length})`}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-mono text-muted-foreground mr-1">Difficulty:</span>
          {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDiff(diff)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                selectedDiff === diff
                  ? "bg-secondary text-foreground font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-8 space-y-6">
        {filteredQuestions.map((q, idx) => {
          const isSubmitted = submittedQuestions[q.id];
          const selectedOption = userAnswers[q.id];
          const isCorrect = isSubmitted && selectedOption === q.answerIndex;

          return (
            <div
              key={q.id}
              className={cn(
                "surface overflow-hidden p-6 transition-all duration-200",
                isSubmitted
                  ? isCorrect
                    ? "border-success/40 bg-success/[0.02]"
                    : "border-warning/40 bg-warning/[0.02]"
                  : "hover:border-primary/40",
              )}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">
                    Q{idx + 1}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    {q.category}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <DifficultyBadge level={q.difficulty} />
                </div>

                {isSubmitted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResetQuestion(q.id)}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                  >
                    <RotateCcw className="size-3" /> Retry
                  </Button>
                )}
              </div>

              {/* Question Prompt */}
              <h3 className="mt-4 text-base font-medium text-foreground leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="mt-5 space-y-2.5">
                {q.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  let stateCls =
                    "border-border bg-secondary/40 hover:bg-secondary/70 hover:border-primary/40 text-foreground cursor-pointer";

                  if (isSubmitted) {
                    if (optIdx === q.answerIndex) {
                      stateCls =
                        "border-success/70 bg-success/15 text-foreground font-medium ring-1 ring-success/30 cursor-default";
                    } else if (optIdx === selectedOption) {
                      stateCls =
                        "border-destructive/70 bg-destructive/15 text-foreground line-through opacity-85 cursor-default";
                    } else {
                      stateCls = "border-border bg-secondary/20 opacity-40 cursor-default";
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-lg border p-3.5 text-left text-sm transition-all",
                        stateCls,
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold",
                          isSubmitted && optIdx === q.answerIndex
                            ? "bg-success text-success-foreground"
                            : isSubmitted && optIdx === selectedOption
                              ? "bg-destructive text-destructive-foreground"
                              : "border border-border bg-background text-muted-foreground",
                        )}
                      >
                        {letter}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isSubmitted && optIdx === q.answerIndex && (
                        <CheckCircle2 className="size-4 shrink-0 text-success" />
                      )}
                      {isSubmitted && optIdx === selectedOption && optIdx !== q.answerIndex && (
                        <XCircle className="size-4 shrink-0 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {isSubmitted && (
                <div
                  className={cn(
                    "mt-5 rounded-lg border p-4 text-sm animate-fade-up",
                    isCorrect
                      ? "border-success/30 bg-success/10 text-foreground"
                      : "border-warning/30 bg-warning/10 text-foreground",
                  )}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="size-4 text-success" />
                        <span className="text-success font-semibold">Correct Analysis!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 text-warning" />
                        <span className="text-warning font-semibold">Incorrect — Conceptual Explanation:</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
