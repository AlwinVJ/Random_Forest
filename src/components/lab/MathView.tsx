import { useMemo, type ReactNode } from "react";
import katex from "katex";
import { Sigma, BookOpen, Calculator, ArrowRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* CORE KATEX RENDERER                                                        */
/* -------------------------------------------------------------------------- */

export interface MathViewProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function MathView({ math, display = false, className = "" }: MathViewProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.warn("KaTeX render error:", err);
      return `<code class="font-mono text-xs text-warning">${math}</code>`;
    }
  }, [math, display]);

  if (display) {
    return (
      <div
        className={cn(
          "my-3.5 overflow-x-auto py-2.5 px-3 text-center text-foreground font-normal tracking-wide",
          "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={cn("inline-block align-middle px-0.5 text-foreground font-normal", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* 6.6 REUSABLE MATHEMATICAL COMPONENTS                                       */
/* -------------------------------------------------------------------------- */

/**
 * Renders an inline mathematical formula with proper vertical alignment and typography.
 */
export function InlineMath({ math, className = "" }: { math: string; className?: string }) {
  return <MathView math={math} display={false} className={cn("text-[0.98em]", className)} />;
}

/**
 * Renders an isolated display mathematical formula centered inside a responsive scroll container.
 */
export function DisplayMath({ math, className = "" }: { math: string; className?: string }) {
  return (
    <div
      className={cn(
        "my-4 overflow-x-auto rounded-lg border border-border/70 bg-secondary/30 py-3.5 px-4 text-center shadow-xs",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
        className
      )}
    >
      <MathView math={math} display={true} className="my-0 py-0" />
    </div>
  );
}

/**
 * Variable definition item mapping a mathematical symbol to its plain-English definition.
 */
export interface VariableDef {
  symbol: string;
  definition: string;
  unit?: string;
}

/**
 * Formatted table mapping equation symbols to their definitions.
 */
export function VariableDefinitions({
  variables,
  title = "Variable Definitions",
}: {
  variables: VariableDef[];
  title?: string;
}) {
  return (
    <div className="mt-3.5 rounded-lg border border-border/60 bg-secondary/20 p-3.5 text-xs">
      <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
        <HelpCircle className="size-3.5 text-primary" />
        <span>{title}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {variables.map((v, idx) => (
          <div key={idx} className="flex items-start gap-2 py-1 border-b border-border/30 last:border-b-0">
            <span className="font-mono font-semibold text-primary shrink-0 min-w-[32px]">
              <InlineMath math={v.symbol} />
            </span>
            <span className="text-muted-foreground leading-relaxed">
              {v.definition}
              {v.unit && <span className="ml-1 text-[10px] text-muted-foreground/75 font-mono">({v.unit})</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Comprehensive equation block displaying an equation with label/numbering, title,
 * explanation, variable definitions, and optional worked numerical example.
 */
export function EquationBlock({
  id,
  equationNumber,
  title,
  math,
  description,
  variables,
  numericalExample,
  interpretation,
  className = "",
}: {
  id?: string;
  equationNumber?: string;
  title: string;
  math: string;
  description?: string;
  variables?: VariableDef[];
  numericalExample?: {
    inputs: string;
    calculation: string;
    result: string;
  };
  interpretation?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "my-6 overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm transition-all hover:border-border/80",
        className
      )}
    >
      {/* Header with Equation Number & Title */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sigma className="size-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
        {equationNumber && (
          <span className="font-mono text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 rounded px-2 py-0.5">
            {equationNumber}
          </span>
        )}
      </div>

      {/* Main Equation Container */}
      <div className="bg-grid/50 p-4 sm:p-6 text-center">
        <div className="overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <MathView math={math} display={true} className="text-base sm:text-lg my-0 py-0" />
        </div>
      </div>

      {/* Body: Description, Variables, and Worked Example */}
      <div className="space-y-3.5 border-t border-border bg-card p-4 sm:p-5 text-sm">
        {description && (
          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">{description}</p>
        )}

        {/* Variable Definitions */}
        {variables && variables.length > 0 && <VariableDefinitions variables={variables} />}

        {/* Worked Numerical Example */}
        {numericalExample && (
          <div className="mt-3.5 rounded-lg border border-accent/30 bg-accent/5 p-3.5 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent mb-2">
              <Calculator className="size-3.5" />
              <span>Worked Numerical Example</span>
            </div>
            <div className="space-y-1.5 font-mono text-[12px]">
              <div>
                <span className="text-muted-foreground">Inputs: </span>
                <span className="text-foreground">{numericalExample.inputs}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Step: </span>
                <span className="text-accent">{numericalExample.calculation}</span>
              </div>
              <div className="pt-1 border-t border-accent/20">
                <span className="text-muted-foreground">Result: </span>
                <span className="text-foreground font-semibold">{numericalExample.result}</span>
              </div>
            </div>
          </div>
        )}

        {/* Interpretation */}
        {interpretation && (
          <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
            <BookOpen className="size-3.5 shrink-0 text-primary mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">Intuition & Interpretation: </span>
              {interpretation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Breakdown of an equation into individual mathematical terms with semantic explanations.
 */
export function EquationExplanation({
  terms,
  title = "Term-by-Term Explanation",
}: {
  terms: { term: string; explanation: string }[];
  title?: string;
}) {
  return (
    <div className="my-4 rounded-xl border border-border bg-secondary/30 p-4 text-xs">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
        {title}
      </div>
      <div className="space-y-2.5">
        {terms.map((t, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1 border-b border-border/40 last:border-0">
            <span className="font-mono font-semibold text-foreground shrink-0 sm:min-w-[120px]">
              <InlineMath math={t.term} />
            </span>
            <span className="text-muted-foreground leading-relaxed">{t.explanation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Step in a multi-stage mathematical derivation.
 */
export function DerivationStep({
  stepNumber,
  title,
  math,
  explanation,
}: {
  stepNumber: number;
  title: string;
  math: string;
  explanation: string;
}) {
  return (
    <div className="flex gap-3.5 py-3 border-l-2 border-primary/40 pl-4 my-3">
      <div className="size-6 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {stepNumber}
      </div>
      <div className="space-y-1.5 flex-1 overflow-hidden">
        <div className="text-xs font-semibold text-foreground">{title}</div>
        <div className="overflow-x-auto py-1.5 px-3 rounded bg-secondary/40 border border-border/50 text-center scrollbar-thin">
          <MathView math={math} display={true} className="my-0 py-0 text-sm sm:text-base" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
