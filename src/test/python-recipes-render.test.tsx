import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PythonRecipesModule } from "@/components/lab/PythonRecipesModule";

describe("PythonRecipesModule Render Tests", () => {
  it("renders Recipe 1: Leak-Free Imbalanced Pipeline initially", () => {
    render(<PythonRecipesModule />);
    expect(
      screen.getByText("Recipe 1: Leak-Free Preprocessing & SMOTE Pipeline with Imbalanced-Learn")
    ).toBeDefined();
    expect(
      screen.getByText(/Crucial Architecture Rule: Why sklearn.pipeline.Pipeline Fails/i)
    ).toBeDefined();
    expect(screen.getByText("imbalanced_rf_pipeline.py")).toBeDefined();
    expect(screen.getByText("Why Feature Scaling is Included for SMOTE")).toBeDefined();
  });

  it("switches to Recipe 2: CalibratedClassifierCV & Risk Probabilities", () => {
    render(<PythonRecipesModule />);
    const calTab = screen.getByRole("button", {
      name: /Recipe 2: CalibratedClassifierCV/i,
    });
    fireEvent.click(calTab);

    expect(
      screen.getByText("Recipe 2: Generating Calibrated Class Probabilities via CalibratedClassifierCV")
    ).toBeDefined();
    expect(screen.getByText("calibrated_rf_probabilities.py")).toBeDefined();
    expect(screen.getByText("Brier Score Loss Formula")).toBeDefined();
    expect(screen.getByText("Binary Log-Loss (Cross-Entropy)")).toBeDefined();
    expect(screen.getByText("Method 1: Sigmoid (Platt Scaling)")).toBeDefined();
    expect(screen.getByText("Method 2: Isotonic Regression")).toBeDefined();
  });

  it("switches to Recipe 3: Multi-Core Benchmarking & Scalability", () => {
    render(<PythonRecipesModule />);
    const multiTab = screen.getByRole("button", {
      name: /Recipe 3: Multi-Core Benchmarking/i,
    });
    fireEvent.click(multiTab);

    expect(
      screen.getByText("Recipe 3: Multi-Core CPU Benchmarking & Parallel Speedup Quantification")
    ).toBeDefined();
    expect(screen.getByText("benchmark_rf_multicore.py")).toBeDefined();
    expect(screen.getByText("Parallel Speedup")).toBeDefined();
    expect(screen.getByText("Parallel Efficiency")).toBeDefined();
    expect(screen.getByText("Amdahl's Law Speedup")).toBeDefined();
    expect(screen.getByText("n_jobs=1")).toBeDefined();
    expect(screen.getByText("n_jobs=-1")).toBeDefined();
  });
});
