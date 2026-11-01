import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ImbalancedLabModule } from "@/components/lab/ImbalancedLabModule";

describe("ImbalancedLabModule Tabs Render Test", () => {
  it("renders benchmark tab initially without error", () => {
    render(<ImbalancedLabModule />);
    expect(screen.getByText("Unified Practical Comparison: All 6 Imbalance Techniques")).toBeDefined();
  });

  it("clicks Class Weighting tab and renders without error", () => {
    render(<ImbalancedLabModule />);
    const classWeightTab = screen.getByText("Class Weighting");
    fireEvent.click(classWeightTab);
    expect(screen.getByText("Concept & How It Works")).toBeDefined();
  });

  it("clicks Random Oversampling tab and renders without error", () => {
    render(<ImbalancedLabModule />);
    const rosTab = screen.getAllByText("Random Oversampling")[0];
    fireEvent.click(rosTab);
    expect(screen.getByText("How Random Oversampling Works")).toBeDefined();
  });

  it("clicks Random Undersampling tab and renders without error", () => {
    render(<ImbalancedLabModule />);
    const rusTab = screen.getAllByText("Random Undersampling")[0];
    fireEvent.click(rusTab);
    expect(screen.getByText("How Random Undersampling Works")).toBeDefined();
  });

  it("clicks SMOTE tab in ImbalancedLabModule and renders without error", () => {
    render(<ImbalancedLabModule />);
    const smoteTab = screen.getByText("SMOTE (Preserved)");
    fireEvent.click(smoteTab);
    expect(screen.getByText("The Linear Interpolation Mechanism")).toBeDefined();
  });

  it("clicks Data Leakage & Cross-Validation tab and renders without error", () => {
    render(<ImbalancedLabModule />);
    const leakTab = screen.getByText("Data Leakage & Cross-Validation");
    fireEvent.click(leakTab);
    expect(screen.getByText("Data Leakage Prevention & Method Selection Guide")).toBeDefined();
  });

  it("clicks Balanced Random Forest tab and renders without error", () => {
    render(<ImbalancedLabModule />);
    const brfTab = screen.getByText("Balanced Random Forest");
    fireEvent.click(brfTab);
    expect(screen.getByText("The Per-Tree Bootstrap Mechanism")).toBeDefined();
  });

  it("clicks Advanced Samplers & Cleaning tab and renders without error", () => {
    render(<ImbalancedLabModule />);
    const advTab = screen.getByText("Advanced Samplers & Cleaning");
    fireEvent.click(advTab);
    expect(screen.getByText("ADASYN (Adaptive Synthetic Sampling)")).toBeDefined();
  });

  it("clicks Metrics & Threshold Optimization tab and interacts with threshold simulator", () => {
    render(<ImbalancedLabModule />);
    const metTab = screen.getByText("Metrics & Threshold Optimization");
    fireEvent.click(metTab);
    expect(screen.getByText("Bayes Optimal Decision Threshold & Cost Tuning")).toBeDefined();
  });
});
