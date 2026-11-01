import { describe, expect, it } from "vitest";
import { lessons } from "@/content/lessons";
import { labs } from "@/content/labs";
import { navGroups, allNavItems } from "@/content/nav";

describe("Random Forest Mathematical Algorithms", () => {
  it("calculates exact Gini Impurity for pure and mixed nodes", () => {
    // Pure node (100% Class 0)
    const pureGini = 1 - (Math.pow(1.0, 2) + Math.pow(0.0, 2));
    expect(pureGini).toBe(0);

    // Balanced binary node (50% Class 0, 50% Class 1)
    const balancedGini = 1 - (Math.pow(0.5, 2) + Math.pow(0.5, 2));
    expect(balancedGini).toBe(0.5);

    // Mixed node (40% Class 0, 60% Class 1)
    const mixedGini = 1 - (Math.pow(0.4, 2) + Math.pow(0.6, 2));
    expect(mixedGini).toBeCloseTo(0.48, 5);
  });

  it("calculates exact Shannon Entropy in base-2 bits", () => {
    // Balanced binary node
    const entropy = -(0.5 * Math.log2(0.5) + 0.5 * Math.log2(0.5));
    expect(entropy).toBe(1.0);

    // Pure node (convention 0 * log(0) = 0)
    const p1 = 1.0;
    const pureEntropy = -(p1 * Math.log2(p1));
    expect(Math.abs(pureEntropy)).toBe(0);
  });

  it("calculates Information Gain for a split", () => {
    const parentGini = 0.48;
    const leftWeight = 0.4;
    const leftGini = 0.375;
    const rightWeight = 0.6;
    const rightGini = 0.2778;

    const weightedChildGini = leftWeight * leftGini + rightWeight * rightGini;
    const informationGain = parentGini - weightedChildGini;

    expect(weightedChildGini).toBeCloseTo(0.31668, 4);
    expect(informationGain).toBeCloseTo(0.16332, 4);
  });

  it("verifies the asymptotic Out-of-Bag limit converges to 1/e", () => {
    const oobProbability = (n: number) => Math.pow(1 - 1 / n, n);

    const smallN = oobProbability(5);
    const largeN = oobProbability(10000);
    const theoretical = 1 / Math.E;

    expect(smallN).toBeCloseTo(0.32768, 4);
    expect(largeN).toBeCloseTo(theoretical, 3);
    expect(theoretical).toBeCloseTo(0.367879, 5);
  });

  it("verifies Breiman-Hastie Ensemble Variance reduction", () => {
    const ensembleVariance = (rho: number, sigmaSq: number, b: number) =>
      rho * sigmaSq + ((1 - rho) / b) * sigmaSq;

    const sigmaSq = 100;
    const rho = 0.2;

    const var1Tree = ensembleVariance(rho, sigmaSq, 1);
    const var10Trees = ensembleVariance(rho, sigmaSq, 10);
    const var100Trees = ensembleVariance(rho, sigmaSq, 100);
    const varInf = rho * sigmaSq;

    expect(var1Tree).toBe(100); // 1 tree has full variance
    expect(var10Trees).toBe(28); // 20 + 8 = 28
    expect(var100Trees).toBe(20.8); // 20 + 0.8 = 20.8
    expect(varInf).toBe(20); // Asymptotic correlation floor
  });
});

describe("Curriculum Completeness & Integrity", () => {
  it("ensures all required modules are defined in lessons", () => {
    const expectedSlugs = [
      "ensemble-learning",
      "decision-trees",
      "random-forest",
      "bootstrap-sampling",
      "bagging",
      "classification",
      "regression",
      "bias-variance",
      "hyperparameters",
      "oob-estimation",
      "feature-importance",
      "imbalanced-data",
      "hyperparameter-optimization",
      "classification-project",
      "regression-project",
      "algorithm-comparison",
      "applications",
    ];

    expectedSlugs.forEach((slug) => {
      const lesson = lessons[slug];
      expect(lesson, `Missing lesson for slug: ${slug}`).toBeDefined();
      expect(lesson?.title).toBeTruthy();
      expect(lesson?.intro.length).toBeGreaterThan(50);
      expect(lesson?.whyNecessary.length).toBeGreaterThan(40);
      expect(lesson?.intuition.length).toBeGreaterThan(40);
      expect(lesson?.theory.length).toBeGreaterThan(2);
      expect(lesson?.formulas.length).toBeGreaterThan(0);
      expect(lesson?.workedExample.steps.length).toBeGreaterThan(0);
      expect(lesson?.code.length).toBeGreaterThan(50);
      expect(lesson?.application.length).toBeGreaterThan(20);
      expect(lesson?.mistakes.length).toBeGreaterThan(1);
      expect(lesson?.takeaways.length).toBeGreaterThan(1);
      expect(lesson?.quiz.options.length).toBe(4);
    });
  });

  it("ensures all 6 interactive laboratory experiments are registered", () => {
    expect(labs.length).toBe(6);
    const labIds = labs.map((l) => l.id);
    expect(labIds).toEqual([
      "bootstrap",
      "feature-selection",
      "voting",
      "regression",
      "bias-variance",
      "tree-splitting",
    ]);
  });

  it("ensures navigation groups cover all syllabus paths", () => {
    expect(navGroups.length).toBe(6);
    expect(allNavItems.length).toBeGreaterThanOrEqual(23);
  });
});
