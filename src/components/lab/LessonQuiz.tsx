import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/content/lessons";

interface LessonQuizProps {
  quiz: QuizQuestion;
  lessonTitle: string;
}

export function LessonQuiz({ quiz, lessonTitle }: LessonQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === quiz.answerIndex;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="surface overflow-hidden p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-primary" />
          <span className="text-xs font-mono font-semibold uppercase text-primary tracking-wider">
            Concept Verification Check
          </span>
        </div>
        {submitted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Retry
          </Button>
        )}
      </div>

      <div className="mt-4">
        <p className="text-base font-medium text-foreground">{quiz.prompt}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Select the most accurate statement based on {lessonTitle}.
        </p>

        <div className="mt-5 space-y-2.5">
          {quiz.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let stateStyle = "border-border bg-secondary/40 hover:bg-secondary/70 hover:border-primary/40 text-foreground cursor-pointer";

            if (submitted) {
              if (idx === quiz.answerIndex) {
                stateStyle = "border-success/60 bg-success/15 text-foreground font-medium ring-1 ring-success/30 cursor-default";
              } else if (idx === selected) {
                stateStyle = "border-destructive/60 bg-destructive/15 text-foreground line-through opacity-85 cursor-default";
              } else {
                stateStyle = "border-border bg-secondary/20 opacity-50 cursor-default";
              }
            }

            return (
              <button
                key={option}
                type="button"
                disabled={submitted}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-lg border p-3.5 text-left text-sm transition-all",
                  stateStyle,
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold",
                    submitted && idx === quiz.answerIndex
                      ? "bg-success text-success-foreground"
                      : submitted && idx === selected
                        ? "bg-destructive text-destructive-foreground"
                        : "border border-border bg-background text-muted-foreground",
                  )}
                >
                  {letter}
                </span>
                <span className="flex-1">{option}</span>
                {submitted && idx === quiz.answerIndex && (
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                )}
                {submitted && idx === selected && idx !== quiz.answerIndex && (
                  <XCircle className="size-4 shrink-0 text-destructive" />
                )}
              </button>
            );
          })}
        </div>

        {submitted && (
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
                  <span className="text-success">Correct analysis!</span>
                </>
              ) : (
                <>
                  <XCircle className="size-4 text-warning" />
                  <span className="text-warning">Review the concept:</span>
                </>
              )}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {quiz.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
