import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HyperparameterLabModule } from "@/components/lab/HyperparameterLabModule";

describe("HyperparameterLabModule Render Tests", () => {
  it("renders the 18 Hyperparameters tab initially without errors", () => {
    render(<HyperparameterLabModule />);
    expect(screen.getByText("Exhaustive Hyperparameter Reference: All 18 Parameters")).toBeDefined();
    expect(screen.getAllByText("n_estimators")[0]).toBeDefined();
    expect(screen.getAllByText("max_depth")[0]).toBeDefined();
    expect(screen.getAllByText("criterion")[0]).toBeDefined();
    expect(screen.getAllByText("monotonic_cst")[0]).toBeDefined();
  });

  it("filters hyperparameters by category", () => {
    render(<HyperparameterLabModule />);
    const computeFilterBtn = screen.getAllByRole("button", { name: /^Compute & System$/i })[0];
    fireEvent.click(computeFilterBtn);

    // In compute & system, n_jobs and oob_score should be visible
    expect(screen.getAllByText("n_jobs")[0]).toBeDefined();
    expect(screen.getAllByText("oob_score")[0]).toBeDefined();
  });

  it("selects a hyperparameter card and displays its deep dive details", () => {
    render(<HyperparameterLabModule />);
    const njobsCard = screen.getAllByText("n_jobs")[0].closest("button")!;
    fireEvent.click(njobsCard);

    expect(screen.getAllByText("Core Function & Definition")[0]).toBeDefined();
    expect(screen.getAllByText("Internal Working Mechanism")[0]).toBeDefined();
    expect(screen.getAllByText("Production Tuning Recommendation")[0]).toBeDefined();
  });

  it("clicks CPU & Parallelism Deep Dive tab and renders without errors", () => {
    render(<HyperparameterLabModule />);
    const cpuTab = screen.getByRole("button", { name: /CPU Parallelization \(n_jobs\)/i });
    fireEvent.click(cpuTab);

    expect(screen.getByText("CPU Parallelization Deep Dive: Understanding n_jobs")).toBeDefined();
    expect(screen.getByText("Physical vs Logical Cores")).toBeDefined();
    expect(screen.getByText("Python GIL & Joblib Loky")).toBeDefined();
    expect(screen.getByText(/The Dreaded Nested Parallelism Anti-Pattern/i)).toBeDefined();
  });

  it("clicks Key Interactions tab and displays all 4 interaction analyses", () => {
    render(<HyperparameterLabModule />);
    const interactionsTab = screen.getByRole("button", { name: /Hyperparameter Interactions/i });
    fireEvent.click(interactionsTab);

    expect(screen.getByText("Four Critical Hyperparameter Interactions")).toBeDefined();
    expect(screen.getByText(/Interaction 1: n_estimators × max_features/i)).toBeDefined();
    expect(screen.getByText(/Interaction 2: max_depth × min_samples_leaf/i)).toBeDefined();
    expect(screen.getByText(/Interaction 3: bootstrap × max_samples/i)).toBeDefined();
    expect(screen.getByText(/Interaction 4: class_weight × min_samples_leaf/i)).toBeDefined();
  });

  it("clicks 8 Production Presets tab and displays all battle-tested configurations", () => {
    render(<HyperparameterLabModule />);
    const presetsTab = screen.getByRole("button", { name: /8 Production Presets/i });
    fireEvent.click(presetsTab);

    expect(screen.getByText("Eight Battle-Tested Production Presets")).toBeDefined();
    expect(screen.getAllByText("1. General-Purpose Baseline")[0]).toBeDefined();
    expect(screen.getAllByText("2. High-Accuracy / Competitive Kaggle")[0]).toBeDefined();
    expect(screen.getAllByText("3. Regularized / Overfitting-Controlled Forest")[0]).toBeDefined();
    expect(screen.getAllByText("4. Large Dataset / Computational Efficiency")[0]).toBeDefined();
    expect(screen.getAllByText("5. Imbalanced Classification")[0]).toBeDefined();
    expect(screen.getAllByText("6. Reproducible Experimentation")[0]).toBeDefined();
    expect(screen.getAllByText("7. Memory-Constrained / Edge Deployment")[0]).toBeDefined();
    expect(screen.getAllByText("8. Monotonic / Domain-Constrained")[0]).toBeDefined();
  });
});



