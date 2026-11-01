import { createFileRoute } from "@tanstack/react-router";
import { Callout, DifficultyBadge, MathPanel, Meta, PageHeader, SectionHeading } from "@/components/lab/primitives";

export const Route = createFileRoute("/mathematical-deep-dive")({
  head: () => ({
    meta: [
      { title: "Mathematical Deep Dive — Random Forest Lab" },
      { name: "description", content: "Probability, variance, the law of large numbers and the theory behind ensemble variance." },
      { property: "og:title", content: "Mathematical Deep Dive — Random Forest Lab" },
      { property: "og:description", content: "The mathematics that makes Random Forest work." },
    ],
  }),
  component: MathPage,
});

const topics = [
  { cat: "Probability", label: "Probability Theory", expr: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", note: "Foundations for sampling and voting" },
  { cat: "Sampling", label: "Bootstrap Sampling", expr: "P(row ∉ sample) = (1 − 1/n)ⁿ ≈ 0.368" },
  { cat: "Probability", label: "Binomial Distribution", expr: "P(X = k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ", note: "Models the number of correct tree votes" },
  { cat: "Statistics", label: "Expected Value", expr: "E[X] = Σ xᵢ · P(xᵢ)" },
  { cat: "Statistics", label: "Variance", expr: "Var(X) = E[(X − μ)²] = E[X²] − μ²" },
  { cat: "Statistics", label: "Covariance", expr: "Cov(X, Y) = E[(X − μₓ)(Y − μᵧ)]" },
  { cat: "Limits", label: "Law of Large Numbers", expr: "X̄ₙ → μ   as n → ∞" },
  { cat: "Limits", label: "Central Limit Theorem", expr: "√n (X̄ₙ − μ) → 𝒩(0, σ²)" },
  { cat: "Ensembles", label: "Bias-Variance Decomposition", expr: "E[(y − f̂)²] = Bias²[f̂] + Var[f̂] + σ²" },
  { cat: "Ensembles", label: "Ensemble Variance", expr: "Var(f̄) = ρσ² + ((1 − ρ) / B) · σ²", note: "ρ = pairwise tree correlation, B = number of trees" },
];

function MathPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Course", to: "/" }, { label: "Advanced Concepts" }, { label: "Mathematical Deep Dive" }]} eyebrow="Mathematics" title="Mathematical Deep Dive" intro="Ten core results from probability and statistics that explain why Random Forest generalises.">
        <Meta>90 min</Meta>
        <DifficultyBadge level="Advanced" />
      </PageHeader>
      <div className="mt-10">
        <Callout type="tip" title="The central idea">Averaging B decorrelated estimators shrinks variance toward ρσ². Every topic below builds toward that single equation.</Callout>
      </div>
      <div className="mt-10">
        <SectionHeading title="Equation library" desc="Grouped by theme. Derivations and interactive proofs arrive in Phase 2." />
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((t, i) => (
            <div key={t.label}>
              <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>{t.cat.toUpperCase()}
              </div>
              <MathPanel formula={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
