import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlgorithmComparisonModule } from "@/components/lab/AlgorithmComparisonModule";

describe("AlgorithmComparisonModule Render Tests", () => {
  it("renders the Multi-Criteria Comparison Matrix tab initially with all 9 algorithms", () => {
    render(<AlgorithmComparisonModule />);
    expect(screen.getByText("Comprehensive Multi-Algorithm Comparison Matrix")).toBeDefined();

    // Check presence of all 9 algorithm families
    expect(screen.getAllByText("Random Forest")[0]).toBeDefined();
    expect(screen.getAllByText("Linear Models")[0]).toBeDefined();
    expect(screen.getAllByText("Support Vector Machines")[0]).toBeDefined();
    expect(screen.getAllByText("K-Nearest Neighbors")[0]).toBeDefined();
    expect(screen.getAllByText("Decision Trees")[0]).toBeDefined();
    expect(screen.getAllByText("Gradient Boosting")[0]).toBeDefined();
    expect(screen.getAllByText("Naive Bayes")[0]).toBeDefined();
    expect(screen.getAllByText("Neural Networks (MLP)")[0]).toBeDefined();
    expect(screen.getAllByText("Ensemble Meta-Learning")[0]).toBeDefined();
  });

  it("filters comparison matrix by specific criterion", () => {
    render(<AlgorithmComparisonModule />);
    const interpretabilityBtn = screen.getByRole("button", { name: /^Interpretability$/i });
    fireEvent.click(interpretabilityBtn);

    expect(screen.getAllByText("1. Interpretability")[0]).toBeDefined();
  });

  it("switches to Algorithm Family Deep Dive tab and inspects algorithms", () => {
    render(<AlgorithmComparisonModule />);
    const deepDiveTab = screen.getByRole("button", { name: /Algorithm Family Deep Dive/i });
    fireEvent.click(deepDiveTab);

    expect(screen.getByText("Algorithm Family Deep Dive Scorecard")).toBeDefined();

    // Select Gradient Boosting
    const gbButton = screen.getAllByRole("button", { name: /Gradient Boosting/i })[0];
    fireEvent.click(gbButton);

    expect(screen.getAllByText("Core Architectural Strengths")[0]).toBeDefined();
    expect(screen.getAllByText("Architectural Limitations & Traps")[0]).toBeDefined();
  });

  it("switches to Practical Selection Guide tab and displays scenarios", () => {
    render(<AlgorithmComparisonModule />);
    const scenariosTab = screen.getByRole("button", { name: /Practical Selection Guide/i });
    fireEvent.click(scenariosTab);

    expect(screen.getByText("Practical Algorithm Selection Guide by Scenario")).toBeDefined();
    expect(screen.getByText("1. Small Structured Datasets (< 1,000 rows)")).toBeDefined();
    expect(screen.getByText("2. Large Tabular Datasets (> 500,000 rows)")).toBeDefined();
    expect(screen.getByText("3. High-Dimensional Sparse Data (Text, Bags-of-Words, Genomics)")).toBeDefined();
    expect(screen.getByText("4. Highly Non-Linear Classification Problems")).toBeDefined();
    expect(screen.getByText("5. Ultra Low-Latency Prediction Systems (< 5ms SLA)")).toBeDefined();
  });

  it("switches to Interactive Decision Framework and interacts with steps", () => {
    render(<AlgorithmComparisonModule />);
    const decisionTab = screen.getByRole("button", { name: /Interactive Decision Framework/i });
    fireEvent.click(decisionTab);

    expect(screen.getByText("Algorithm Selection Decision Framework")).toBeDefined();
    expect(screen.getByText("Is your data primarily unstructured media (images, audio, raw video) or multi-modal?")).toBeDefined();

    // Click NO to proceed
    const noBtn = screen.getByRole("button", { name: /^NO/i });
    fireEvent.click(noBtn);

    expect(screen.getByText("Do strict legal or regulatory mandates require transparent, inspectable single-equation or flowchart auditability?")).toBeDefined();
  });
});
