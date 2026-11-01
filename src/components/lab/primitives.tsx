import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Check, ChevronRight, Clock, Copy, Info, Lightbulb, AlertTriangle, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, Formula } from "@/content/lessons";
import {
  MathView,
  InlineMath,
  DisplayMath,
  EquationBlock,
  EquationExplanation,
  VariableDefinitions,
  DerivationStep,
} from "./MathView";

export {
  MathView,
  InlineMath,
  DisplayMath,
  EquationBlock,
  EquationExplanation,
  VariableDefinitions,
  DerivationStep,
};

/* ---------- Badges ---------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

const diffStyles: Record<Difficulty, string> = {
  Beginner: "text-success border-success/30 bg-success/10",
  Intermediate: "text-accent border-accent/30 bg-accent/10",
  Advanced: "text-primary border-primary/30 bg-primary/10",
};
export function DifficultyBadge({ level }: { level: Difficulty }) {
  const bars = level === "Beginner" ? 1 : level === "Intermediate" ? 2 : 3;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-xs font-medium", diffStyles[level])}>
      <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((b) => (
          <span key={b} className={cn("w-1 rounded-sm bg-current", b > bars && "opacity-25")} style={{ height: 4 + b * 3 }} />
        ))}
      </span>
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Available" ? "text-success bg-success/10 border-success/30"
    : status === "In progress" ? "text-warning bg-warning/10 border-warning/30"
    : "text-muted-foreground bg-secondary border-border";
  return <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", cls)}>{status}</span>;
}

export function Meta({ icon: Icon = Clock, children }: { icon?: typeof Clock; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

/* ---------- Headings ---------- */
export function SectionHeading({ id, index, title, desc }: { id?: string; index?: string; title: string; desc?: string }) {
  return (
    <div id={id} className="mb-5 scroll-mt-24">
      {index && <div className="mb-1 font-mono text-xs text-primary">{index}</div>}
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      {desc && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3" />}
          {it.to ? <Link to={it.to} className="hover:text-foreground">{it.label}</Link> : <span className="text-foreground">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ crumbs, eyebrow, title, intro, children }: {
  crumbs: { label: string; to?: string }[]; eyebrow?: string; title: string; intro: string; children?: ReactNode;
}) {
  return (
    <header className="animate-fade-up border-b border-border pb-8">
      <Breadcrumbs items={crumbs} />
      {eyebrow && <div className="mt-6 font-mono text-xs tracking-wider text-primary uppercase">{eyebrow}</div>}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>
      {children && <div className="mt-5 flex flex-wrap items-center gap-4">{children}</div>}
    </header>
  );
}

/* ---------- Math ---------- */
export function MathPanel({ formula, className }: { formula: Formula; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-colors hover:border-border/80", className)}>
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
        <span className="text-xs font-semibold text-foreground tracking-tight">{formula.label}</span>
        <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5">∑ FORMULA</span>
      </div>
      <div className="bg-grid/60 px-4 py-5 text-center overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <MathView math={formula.expr} display className="text-base my-0 py-0" />
      </div>
      {formula.note && (
        <div className="border-t border-border bg-secondary/20 px-4 py-2.5 text-xs text-muted-foreground leading-relaxed">
          {formula.note}
        </div>
      )}
    </div>
  );
}

/* ---------- Code ---------- */
const KW = new Set(["from", "import", "as", "def", "return", "for", "in", "if", "else", "elif", "print", "class", "with", "True", "False", "None", "lambda", "and", "or", "not"]);
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(#.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|(\s+|.)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(line))) {
    const [t, c, s, n, w] = m;
    if (c) out.push(<span key={k++} className="text-muted-foreground italic">{t}</span>);
    else if (s) out.push(<span key={k++} className="text-success">{t}</span>);
    else if (n) out.push(<span key={k++} className="text-warning">{t}</span>);
    else if (w && KW.has(w)) out.push(<span key={k++} className="text-primary">{t}</span>);
    else if (w && /^[A-Z]/.test(w)) out.push(<span key={k++} className="text-accent">{t}</span>);
    else out.push(t);
  }
  return out;
}

export function CodeBlock({ code, filename = "main.py" }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">Python</span>
        </div>
        <button
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-6">
        {lines.map((l, i) => (
          <div key={i} className="flex">
            <span className="w-10 shrink-0 pr-4 text-right text-muted-foreground/50 select-none">{i + 1}</span>
            <span className="pr-4 whitespace-pre">{highlight(l)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ---------- Callouts ---------- */
const calloutMap = {
  info: { icon: Info, cls: "border-accent/30 bg-accent/5 text-accent" },
  tip: { icon: Lightbulb, cls: "border-success/30 bg-success/5 text-success" },
  warning: { icon: AlertTriangle, cls: "border-warning/30 bg-warning/5 text-warning" },
};
export function Callout({ type = "info", title, children }: { type?: keyof typeof calloutMap; title: string; children: ReactNode }) {
  const { icon: Icon, cls } = calloutMap[type];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", cls)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Cards ---------- */
export function InfoCard({ icon: Icon = Layers, title, children, className }: { icon?: typeof Layers; title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("surface p-5 transition-colors hover:border-primary/40", className)}>
      <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
        <Icon className="size-4" />
      </div>
      <div className="font-medium">{title}</div>
      {children && <div className="mt-1.5 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export function ModuleCard({ n, title, desc, topics, time, to }: { n: string; title: string; desc: string; topics: number; time: string; to: string }) {
  return (
    <Link to={to} className="group surface flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-primary">MODULE {n}</span>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex gap-4">
          <Meta icon={Layers}>{topics} topics</Meta>
          <Meta>{time}</Meta>
        </div>
        <span className="text-xs font-medium text-primary">Explore</span>
      </div>
    </Link>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
    </div>
  );
}

export function PlaceholderViz({ label = "Interactive visualization", height = 220 }: { label?: string; height?: number }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-grid" style={{ height }}>
      <svg className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 400 200">
        <path d="M0 160 C 80 120, 120 60, 200 90 S 320 40, 400 60" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
        <path d="M0 180 C 100 150, 160 130, 220 140 S 330 100, 400 110" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
      <div className="relative rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">
        {label} · Phase 2
      </div>
    </div>
  );
}

export function ComparisonTable({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
          <tr>{head.map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((c, j) => <td key={j} className={cn("px-4 py-2.5", j === 0 ? "font-medium" : "text-muted-foreground")}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
