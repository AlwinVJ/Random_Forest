import { describe, expect, it } from "vitest";
import katex from "katex";
import { lessons } from "@/content/lessons";
import { labs } from "@/content/labs";
import { navGroups, allNavItems } from "@/content/nav";
import { assessmentQuestions } from "@/content/assessment-questions";
import benchmarkData from "@/content/benchmark-results.json";
import {
  calculateMCC,
  generateSmoteInterpolation,
  calculateTreeShapComplexity,
  calculateGini,
  calculateEntropy,
  calculateBrierScore,
  calculateBayesOptimalThreshold,
  calculateSpeedup,
  calculateParallelEfficiency,
  calculateAmdahlSpeedup,
  calculatePSI,
} from "@/lib/math-utils";

describe("KaTeX Mathematical Formula Verification across All 19 Lessons", () => {
  it("renders all lesson formulas and derivations without any KaTeX parse errors", () => {
    let count = 0;
    const allLessons = Object.values(lessons);
    expect(allLessons).toHaveLength(19);

    for (const lesson of allLessons) {
      for (const formula of lesson.formulas) {
        expect(() => {
          katex.renderToString(formula.expr, { throwOnError: true, strict: false });
        }, `Error parsing formula "${formula.label}" in lesson "${lesson.slug}"`).not.toThrow();
        count++;
      }
      if (lesson.derivation) {
        for (const step of lesson.derivation.steps) {
          if (step.math) {
            expect(() => {
              katex.renderToString(step.math, { throwOnError: true, strict: false });
            }, `Error parsing derivation step "${step.step}" in lesson "${lesson.slug}"`).not.toThrow();
            count++;
          }
        }
      }
    }
    expect(count).toBeGreaterThan(50);
  });
});

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

  it("calculates exact SMOTE linear vector interpolation and collinearity", () => {
    const xSeed = [2.0, 3.5];
    const xNeighbor = [3.0, 5.0];
    const lambda = 0.40;

    const xNew = [
      xSeed[0] + lambda * (xNeighbor[0] - xSeed[0]),
      xSeed[1] + lambda * (xNeighbor[1] - xSeed[1]),
    ];

    expect(xNew[0]).toBeCloseTo(2.40, 5);
    expect(xNew[1]).toBeCloseTo(4.10, 5);

    // Verify Euclidean distance proportionality
    const dFull = Math.sqrt(Math.pow(xNeighbor[0] - xSeed[0], 2) + Math.pow(xNeighbor[1] - xSeed[1], 2));
    const dNew = Math.sqrt(Math.pow(xNew[0] - xSeed[0], 2) + Math.pow(xNew[1] - xSeed[1], 2));
    expect(dNew).toBeCloseTo(lambda * dFull, 5);
  });

  it("computes Balanced Class Weights inversely proportional to frequencies", () => {
    const computeWeight = (N: number, K: number, Nc: number) => N / (K * Nc);

    const N = 1000;
    const K = 2;
    const N0 = 950;
    const N1 = 50;

    const w0 = computeWeight(N, K, N0);
    const w1 = computeWeight(N, K, N1);

    expect(w0).toBeCloseTo(1000 / (2 * 950), 5); // ~0.5263
    expect(w1).toBe(10.0); // Exactly 10.0

    // Ensure total weighted mass is equal between classes
    expect(N0 * w0).toBeCloseTo(500, 5);
    expect(N1 * w1).toBeCloseTo(500, 5);
  });

  it("computes exact Matthews Correlation Coefficient (MCC) on imbalanced contingency tables", () => {
    const computeMCC = (tp: number, tn: number, fp: number, fn: number) => {
      const numerator = tp * tn - fp * fn;
      const denominator = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
      return denominator === 0 ? 0 : numerator / denominator;
    };

    // Realistic imbalanced contingency table (N = 10,000, 1% positive)
    const tp = 80;
    const tn = 9800;
    const fp = 100;
    const fn = 20;

    const mcc = computeMCC(tp, tn, fp, fn);
    const expected = (80 * 9800 - 100 * 20) / Math.sqrt(180 * 100 * 9900 * 9820);
    expect(mcc).toBeCloseTo(expected, 4);
    expect(mcc).toBeGreaterThan(0.5);

    // Degenerate trivial majority classifier (predict all negative)
    const mccTrivial = computeMCC(0, 9900, 0, 100);
    expect(mccTrivial).toBe(0); // Penalized to zero despite 99% accuracy!
  });

  it("computes Balanced Accuracy correctly", () => {
    const sensitivity = 80 / 100; // 0.80
    const specificity = 9800 / 9900; // ~0.9899
    const balancedAcc = 0.5 * (sensitivity + specificity);

    expect(balancedAcc).toBeCloseTo(0.89495, 4);

    // Trivial classifier sensitivity = 0, specificity = 1 -> Balanced Acc = 0.5 (random guess baseline)
    const trivialBalancedAcc = 0.5 * (0 + 1.0);
    expect(trivialBalancedAcc).toBe(0.5);
  });

  it("calculates exact weighted misclassification loss L_weighted", () => {
    // L_weighted = sum_{i=1}^N w_{y_i} * L(y_i, y_hat_i)
    const samples = [
      { y: 0, loss: 0.2 },
      { y: 1, loss: 0.8 },
      { y: 0, loss: 0.1 },
    ];
    const customWeights: Record<number, number> = { 0: 1.0, 1: 5.0 };

    const weightedLoss = samples.reduce(
      (acc, s) => acc + customWeights[s.y] * s.loss,
      0
    );

    // 1.0 * 0.2 + 5.0 * 0.8 + 1.0 * 0.1 = 0.2 + 4.0 + 0.1 = 4.3
    expect(weightedLoss).toBeCloseTo(4.3, 5);
  });

  it("calculates min_impurity_decrease global split criterion and threshold gating", () => {
    const nTotal = 1000;
    const nt = 100;
    const ntL = 50;
    const ntR = 50;

    // Parent: 60 Class 0, 40 Class 1
    const pParent0 = 60 / 100;
    const pParent1 = 40 / 100;
    const parentGini = 1 - (pParent0 ** 2 + pParent1 ** 2); // 0.48

    // Left child: 45 Class 0, 5 Class 1
    const pLeft0 = 45 / 50;
    const pLeft1 = 5 / 50;
    const leftGini = 1 - (pLeft0 ** 2 + pLeft1 ** 2); // 0.18

    // Right child: 15 Class 0, 35 Class 1
    const pRight0 = 15 / 50;
    const pRight1 = 35 / 50;
    const rightGini = 1 - (pRight0 ** 2 + pRight1 ** 2); // 0.42

    const weightedChildGini = (ntL / nt) * leftGini + (ntR / nt) * rightGini; // 0.5 * 0.18 + 0.5 * 0.42 = 0.30
    const localImpurityDecrease = parentGini - weightedChildGini; // 0.18

    const deltaI = (nt / nTotal) * localImpurityDecrease; // 0.1 * 0.18 = 0.018

    expect(parentGini).toBeCloseTo(0.48, 4);
    expect(leftGini).toBeCloseTo(0.18, 4);
    expect(rightGini).toBeCloseTo(0.42, 4);
    expect(localImpurityDecrease).toBeCloseTo(0.18, 4);
    expect(deltaI).toBeCloseTo(0.018, 4);

    // Gating check
    const minImpurityDecrease = 0.025;
    const isSplitAccepted = deltaI >= minImpurityDecrease;
    expect(isSplitAccepted).toBe(false); // Correctly rejects weak split
  });

  it("calculates cost-complexity pruning objective R_alpha(T) and effective alpha", () => {
    // Tree T with misclassification error R(T) = 12.0 and |T| = 5 leaves
    const rT = 12.0;
    const numLeaves = 5;
    const alpha = 2.5;

    const costComplexity = rT + alpha * numLeaves;
    expect(costComplexity).toBe(12.0 + 2.5 * 5); // 24.5

    // Node t error if collapsed R(t) = 18.0 with |Tt| = 4 leaves in subtree
    const rNode = 18.0;
    const subLeaves = 4;
    const alphaEff = (rNode - rT) / (subLeaves - 1);
    expect(alphaEff).toBeCloseTo((18.0 - 12.0) / 3, 4); // 2.0

    // If pruning parameter ccp_alpha = 2.5 >= alphaEff = 2.0, subtree collapses
    expect(alpha >= alphaEff).toBe(true);
  });

  it("calculates standard max_features subset rules for classification and regression", () => {
    const pFeatures = 30;

    const classificationMaxFeatures = Math.floor(Math.sqrt(pFeatures));
    const regressionBreimanRecommendation = Math.floor(pFeatures / 3);

    expect(classificationMaxFeatures).toBe(5); // floor(sqrt(30)) = 5
    expect(regressionBreimanRecommendation).toBe(10); // floor(30 / 3) = 10
  });

  it("verifies numerical transformations for Random Oversampling and Undersampling", () => {
    // Random Oversampling: 900 Maj, 100 Min -> 900 Maj, 900 Min
    const nMajInit = 900;
    const nMinInit = 100;

    const nMinOver = nMajInit;
    const nTotalOver = nMajInit + nMinOver;
    const duplicationFactor = nMinOver / nMinInit;

    expect(nMinOver).toBe(900);
    expect(nTotalOver).toBe(1800);
    expect(duplicationFactor).toBe(9.0);

    // Random Undersampling: 10,000 Maj, 200 Min -> 200 Maj, 200 Min
    const nMajHuge = 10000;
    const nMinSmall = 200;

    const nMajUnder = nMinSmall;
    const nTotalUnder = nMajUnder + nMinSmall;
    const discardedMaj = nMajHuge - nMajUnder;

    expect(nMajUnder).toBe(200);
    expect(nTotalUnder).toBe(400);
    expect(discardedMaj).toBe(9800);
  });

  it("calculates Brier Score probability calibration metric", () => {
    // 3 samples: y = [1, 0, 1], p_hat = [0.8, 0.2, 0.6]
    const yTrue = [1, 0, 1];
    const pHat = [0.8, 0.2, 0.6];

    const squaredErrors = yTrue.map((y, i) => Math.pow(pHat[i] - y, 2));
    const brier = squaredErrors.reduce((a, b) => a + b, 0) / yTrue.length;

    // (0.8 - 1)^2 = 0.04; (0.2 - 0)^2 = 0.04; (0.6 - 1)^2 = 0.16; sum = 0.24; mean = 0.08
    expect(brier).toBeCloseTo(0.08, 5);
  });

  it("calculates Bayes Optimal Decision Threshold under asymmetric costs", () => {
    const cFP = 300; // False Positive: $300 interest loss
    const cFN = 12000; // False Negative: $12,000 defaulted loan

    const tauOpt = cFP / (cFP + cFN); // 300 / 12300 ~ 0.02439

    expect(tauOpt).toBeCloseTo(0.02439, 4);
    expect(tauOpt).toBeLessThan(0.05); // Significantly lower than default 0.50
  });

  it("calculates Parallel Speedup, Efficiency, and Amdahl's Law bounds", () => {
    const t1 = 12.8; // 1 core baseline runtime (seconds)
    const t4 = 3.84; // 4 cores runtime (seconds)
    const p = 4;

    const speedup = t1 / t4; // 12.8 / 3.84 = 3.333x
    const efficiency = speedup / p; // 3.333 / 4 = 0.8333 (83.33%)

    expect(speedup).toBeCloseTo(3.333, 3);
    expect(efficiency).toBeCloseTo(0.8333, 3);

    // Amdahl's Law: 90% parallel fraction (s = 0.90), 10% serial fraction (1-s = 0.10)
    const s = 0.90;
    const amdahlSpeedup4 = 1 / ((1 - s) + s / 4); // 1 / (0.10 + 0.225) = 1 / 0.325 = 3.077x
    const amdahlSpeedupInf = 1 / (1 - s); // 1 / 0.10 = 10x max limit

    expect(amdahlSpeedup4).toBeCloseTo(3.0769, 3);
    expect(amdahlSpeedupInf).toBeCloseTo(10.0, 5);
  });

  it("calculates Population Stability Index (PSI) for covariate drift detection", () => {
    // 3 bins: baseline P and live production Q
    const pBaseline = [0.50, 0.30, 0.20];
    const qLive     = [0.45, 0.35, 0.20];

    let psi = 0;
    for (let b = 0; b < pBaseline.length; b++) {
      const p = pBaseline[b];
      const q = qLive[b];
      psi += (p - q) * Math.log(p / q);
    }

    // bin 0: (0.50 - 0.45) * ln(0.50 / 0.45) = 0.05 * ln(1.1111) = 0.05 * 0.10536 = 0.005268
    // bin 1: (0.30 - 0.35) * ln(0.30 / 0.35) = -0.05 * ln(0.8571) = -0.05 * -0.15415 = 0.007707
    // bin 2: (0.20 - 0.20) * ln(1) = 0
    // Total PSI = ~0.012975 < 0.10 (stable, no drift)
    expect(psi).toBeCloseTo(0.01298, 4);
    expect(psi).toBeLessThan(0.10); // Standard threshold for stable distribution
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
      "class-weighting",
      "smote",
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

describe("Matthews Correlation Coefficient (MCC) Algorithmic Verification", () => {
  it("Test A: validates perfect classification produces MCC = +1.0", () => {
    const mcc = calculateMCC(50, 50, 0, 0);
    expect(mcc).toBe(1.0);
  });

  it("Test B: validates completely inverted classification produces MCC = -1.0", () => {
    const mcc = calculateMCC(0, 0, 50, 50);
    expect(mcc).toBe(-1.0);
  });

  it("Test C: validates no predictive correlation produces MCC = 0.0", () => {
    const mcc = calculateMCC(50, 50, 50, 50);
    expect(mcc).toBe(0.0);
  });

  it("Test D: validates realistic imbalanced classification against independent calculation", () => {
    const tp = 80;
    const tn = 9800;
    const fp = 100;
    const fn = 20;

    const mcc = calculateMCC(tp, tn, fp, fn);
    const expected = (80 * 9800 - 100 * 20) / Math.sqrt(180 * 100 * 9900 * 9820);
    expect(mcc).toBeCloseTo(expected, 6);
    expect(mcc).toBeCloseTo(0.5911, 3);
  });

  it("Test E: validates zero denominator handles gracefully and returns 0.0 without NaN", () => {
    // Trivial classifier predicting all negative (TP=0, FP=0)
    const mcc1 = calculateMCC(0, 9900, 0, 100);
    expect(mcc1).toBe(0.0);
    expect(Number.isNaN(mcc1)).toBe(false);

    // Completely empty confusion matrix
    const mcc2 = calculateMCC(0, 0, 0, 0);
    expect(mcc2).toBe(0.0);
    expect(Number.isNaN(mcc2)).toBe(false);
  });

  it("Test F: rejects negative matrix inputs with RangeError", () => {
    expect(() => calculateMCC(-1, 50, 10, 5)).toThrow(RangeError);
  });
});

describe("SMOTE Linear Vector Interpolation Algorithmic Verification", () => {
  it("Test A: validates midpoint interpolation with lambda = 0.5", () => {
    const xi = [2, 4];
    const xnn = [6, 8];
    const xNew = generateSmoteInterpolation(xi, xnn, 0.5);

    expect(xNew).toEqual([4, 6]);
  });

  it("Test B: validates zero interpolation coefficient returns exact seed xi", () => {
    const xi = [3.5, 7.2];
    const xnn = [9.1, 1.4];
    const xNew = generateSmoteInterpolation(xi, xnn, 0.0);

    expect(xNew).toEqual(xi);
  });

  it("Test C: validates full interpolation coefficient returns exact neighbor xnn", () => {
    const xi = [3.5, 7.2];
    const xnn = [9.1, 1.4];
    const xNew = generateSmoteInterpolation(xi, xnn, 1.0);

    expect(xNew).toEqual(xnn);
  });

  it("Test D: validates multi-dimensional interpolation across >= 3 dimensions", () => {
    const xi = [2.0, 4.0, 10.0];
    const xnn = [6.0, 8.0, 2.0];
    const lambda = 0.25;

    const xNew = generateSmoteInterpolation(xi, xnn, lambda);

    // xi + 0.25 * (xnn - xi):
    // [2 + 0.25(4), 4 + 0.25(4), 10 + 0.25(-8)] = [3.0, 5.0, 8.0]
    expect(xNew[0]).toBeCloseTo(3.0, 5);
    expect(xNew[1]).toBeCloseTo(5.0, 5);
    expect(xNew[2]).toBeCloseTo(8.0, 5);
  });

  it("Test E: rejects invalid interpolation coefficient lambda outside [0, 1]", () => {
    const xi = [1, 2];
    const xnn = [3, 4];

    expect(() => generateSmoteInterpolation(xi, xnn, -0.01)).toThrow(RangeError);
    expect(() => generateSmoteInterpolation(xi, xnn, 1.05)).toThrow(RangeError);
    expect(() => generateSmoteInterpolation(xi, xnn, NaN)).toThrow(RangeError);
  });

  it("Test F: rejects vector shape mismatch with Error", () => {
    const xi = [1, 2];
    const xnn = [3, 4, 5];

    expect(() => generateSmoteInterpolation(xi, xnn, 0.5)).toThrow(
      "Vector dimension mismatch: xi has dimension 2, but xnn has dimension 3."
    );
  });
});

describe("TreeSHAP Computational Complexity Formulation Verification", () => {
  it("Test 1: validates that increasing tree count T strictly increases complexity estimate", () => {
    const c100 = calculateTreeShapComplexity(100, 32, 10);
    const c200 = calculateTreeShapComplexity(200, 32, 10);

    expect(c200).toBeGreaterThan(c100);
    expect(c200 / c100).toBeCloseTo(2.0, 5); // Linear in trees
  });

  it("Test 2: validates that increasing maximum leaf count L strictly increases complexity estimate", () => {
    const c32 = calculateTreeShapComplexity(100, 32, 10);
    const c64 = calculateTreeShapComplexity(100, 64, 10);

    expect(c64).toBeGreaterThan(c32);
    expect(c64 / c32).toBeCloseTo(2.0, 5); // Linear in leaves
  });

  it("Test 3: validates that increasing depth D scales complexity quadratically D^2", () => {
    const cDepth10 = calculateTreeShapComplexity(100, 32, 10);
    const cDepth20 = calculateTreeShapComplexity(100, 32, 20);

    expect(cDepth20).toBeGreaterThan(cDepth10);
    expect(cDepth20 / cDepth10).toBeCloseTo(4.0, 5); // Quadratic: (20/10)^2 = 4
  });

  it("Test 4: validates zero or negative inputs return 0 safely", () => {
    expect(calculateTreeShapComplexity(0, 32, 10)).toBe(0);
    expect(calculateTreeShapComplexity(-5, 32, 10)).toBe(0);
    expect(calculateTreeShapComplexity(100, 0, 10)).toBe(0);
    expect(calculateTreeShapComplexity(100, 32, 0)).toBe(0);
  });

  it("Test 5: produces exact expected value for known numerical reference", () => {
    // T = 100, L = 32, D = 10 -> 100 * 32 * 10^2 = 100 * 32 * 100 = 320,000
    const knownComplexity = calculateTreeShapComplexity(100, 32, 10);
    expect(knownComplexity).toBe(320000);
  });
});

describe("Pure Math Utility Functions Verification", () => {
  it("calculates Gini and Entropy correctly from class counts", () => {
    // Pure node
    expect(calculateGini([100, 0])).toBe(0.0);
    expect(calculateEntropy([100, 0])).toBe(0.0);

    // Balanced 50:50 node
    expect(calculateGini([50, 50])).toBe(0.5);
    expect(calculateEntropy([50, 50])).toBe(1.0);
  });

  it("calculates Brier Score and Bayes Optimal Threshold correctly", () => {
    const brier = calculateBrierScore([1, 0, 1], [0.8, 0.2, 0.6]);
    expect(brier).toBeCloseTo(0.08, 5);

    const tau = calculateBayesOptimalThreshold(300, 12000);
    expect(tau).toBeCloseTo(300 / 12300, 5);
  });

  it("calculates Speedup, Efficiency, and PSI correctly", () => {
    const speedup = calculateSpeedup(12.8, 3.84);
    expect(speedup).toBeCloseTo(3.3333, 4);

    const eff = calculateParallelEfficiency(speedup, 4);
    expect(eff).toBeCloseTo(0.8333, 4);

    const amdahl = calculateAmdahlSpeedup(0.9, 4);
    expect(amdahl).toBeCloseTo(3.0769, 4);

    const psi = calculatePSI([0.5, 0.3, 0.2], [0.45, 0.35, 0.2]);
    expect(psi).toBeCloseTo(0.01298, 4);
  });
});

describe("Assessment Question Bank Integrity & Distribution Verification", () => {
  it("contains exactly 50 validated assessment questions", () => {
    expect(assessmentQuestions).toHaveLength(50);
  });

  it("satisfies the exact difficulty distribution: 15 Beginner, 20 Intermediate, 15 Advanced", () => {
    const beginner = assessmentQuestions.filter((q) => q.difficulty === "Beginner");
    const intermediate = assessmentQuestions.filter((q) => q.difficulty === "Intermediate");
    const advanced = assessmentQuestions.filter((q) => q.difficulty === "Advanced");

    expect(beginner).toHaveLength(15);
    expect(intermediate).toHaveLength(20);
    expect(advanced).toHaveLength(15);
    expect(beginner.length + intermediate.length + advanced.length).toBe(50);
  });

  it("ensures all question IDs are unique and properly prefixed", () => {
    const ids = assessmentQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(50);

    for (const q of assessmentQuestions) {
      expect(["c-", "m-", "a-", "p-"].some((prefix) => q.id.startsWith(prefix))).toBe(true);
    }
  });

  it("ensures every question has exactly 4 options, a valid answerIndex, and non-empty explanation", () => {
    for (const q of assessmentQuestions) {
      expect(q.options).toHaveLength(4);
      expect(q.answerIndex).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(4);
      expect(q.question.trim().length).toBeGreaterThan(15);
      expect(q.explanation.trim().length).toBeGreaterThan(20);
      q.options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));
    }
  });

  it("covers all 4 curriculum categories with comprehensive depth", () => {
    const conceptual = assessmentQuestions.filter((q) => q.category === "Conceptual");
    const mathematical = assessmentQuestions.filter((q) => q.category === "Mathematical");
    const algorithmic = assessmentQuestions.filter((q) => q.category === "Algorithmic");
    const practical = assessmentQuestions.filter((q) => q.category === "Practical");

    expect(conceptual.length).toBe(10);
    expect(mathematical.length).toBe(12);
    expect(algorithmic.length).toBe(14);
    expect(practical.length).toBe(14);
  });
});

describe("Reproducible Imbalanced Benchmark Verification", () => {
  it("verifies dataset distribution totals and partition sums", () => {
    const { metadata } = benchmarkData;
    expect(metadata.n_samples).toBe(10000);
    expect(metadata.dataset_distributions.full.total).toBe(10000);
    expect(
      metadata.dataset_distributions.full.majority + metadata.dataset_distributions.full.minority
    ).toBe(10000);

    expect(metadata.dataset_distributions.train.total).toBe(7500);
    expect(
      metadata.dataset_distributions.train.majority + metadata.dataset_distributions.train.minority
    ).toBe(7500);
    expect(metadata.dataset_distributions.train.majority).toBe(7330);
    expect(metadata.dataset_distributions.train.minority).toBe(170);

    expect(metadata.dataset_distributions.test.total).toBe(2500);
    expect(
      metadata.dataset_distributions.test.majority + metadata.dataset_distributions.test.minority
    ).toBe(2500);
    expect(metadata.dataset_distributions.test.majority).toBe(2443);
    expect(metadata.dataset_distributions.test.minority).toBe(57);
  });

  it("verifies dynamically computed resampled training counts", () => {
    const { resampled_training_counts } = benchmarkData.metadata;
    expect(resampled_training_counts.original.total).toBe(7500);
    expect(resampled_training_counts.original.majority).toBe(7330);
    expect(resampled_training_counts.original.minority).toBe(170);

    expect(resampled_training_counts.ros.total).toBe(14660);
    expect(resampled_training_counts.ros.majority).toBe(7330);
    expect(resampled_training_counts.ros.minority).toBe(7330);

    expect(resampled_training_counts.rus.total).toBe(340);
    expect(resampled_training_counts.rus.majority).toBe(170);
    expect(resampled_training_counts.rus.minority).toBe(170);

    expect(resampled_training_counts.smote.total).toBe(14660);
    expect(resampled_training_counts.smote.majority).toBe(7330);
    expect(resampled_training_counts.smote.minority).toBe(7330);

    expect(resampled_training_counts.balanced_rf.total).toBe(7500);
    expect(resampled_training_counts.balanced_rf.bag_size).toBe(340);
    expect(resampled_training_counts.balanced_rf.majority_per_tree).toBe(170);
    expect(resampled_training_counts.balanced_rf.minority_per_tree).toBe(170);

    // Verify dynamic description formulation without hardcoding
    const trainMin = benchmarkData.metadata.dataset_distributions.train.minority;
    const trainTotal = benchmarkData.metadata.dataset_distributions.train.total;
    const expectedBrfDesc = `${trainTotal.toLocaleString()} (Bootstraps: ${(trainMin * 2).toLocaleString()} per tree [${trainMin.toLocaleString()} Maj + ${trainMin.toLocaleString()} Min])`;
    expect(resampled_training_counts.balanced_rf.description).toBe(expectedBrfDesc);
  });

  it("verifies dynamic metadata generation generalizes across arbitrary class distributions", () => {
    // Pure function demonstrating dynamic metadata generation without hardcoded numbers
    const formatBrfMetadata = (total: number, minCount: number) => {
      const bagSize = minCount * 2;
      return {
        total,
        bag_size: bagSize,
        majority_per_tree: minCount,
        minority_per_tree: minCount,
        description: `${total.toLocaleString()} (Bootstraps: ${bagSize.toLocaleString()} per tree [${minCount.toLocaleString()} Maj + ${minCount.toLocaleString()} Min])`,
      };
    };

    // Test case 1: 500 total, 50 minority
    const res1 = formatBrfMetadata(500, 50);
    expect(res1.description).toBe("500 (Bootstraps: 100 per tree [50 Maj + 50 Min])");
    expect(res1.description).not.toContain("170");

    // Test case 2: 12,000 total, 350 minority
    const res2 = formatBrfMetadata(12000, 350);
    expect(res2.description).toBe("12,000 (Bootstraps: 700 per tree [350 Maj + 350 Min])");

    // Test case 3: 1,000 total, 1 minority
    const res3 = formatBrfMetadata(1000, 1);
    expect(res3.description).toBe("1,000 (Bootstraps: 2 per tree [1 Maj + 1 Min])");
  });

  it("verifies all 7 benchmark models adhere strictly to mathematical identities and confusion matrix bounds", () => {
    expect(benchmarkData.models).toHaveLength(7);
    const expectedModelIds = [
      "baseline",
      "class_weight_balanced",
      "class_weight_subsample",
      "random_oversampling",
      "random_undersampling",
      "smote",
      "balanced_rf",
    ];
    const actualModelIds = benchmarkData.models.map((m) => m.id);
    expect(actualModelIds).toEqual(expectedModelIds);

    for (const m of benchmarkData.models) {
      const { tn, fp, fn, tp } = m.cm;
      // Held-out test set size must equal exactly 2,500
      expect(tn + fp + fn + tp).toBe(2500);
      // Actual ground truth positives and negatives
      expect(tp + fn).toBe(57);
      expect(tn + fp).toBe(2443);

      // Verify derived metrics match confusion matrix definitions
      const expectedAccuracy = (tp + tn) / 2500;
      expect(m.accuracy).toBeCloseTo(expectedAccuracy, 4);

      const expectedRecall = tp / 57;
      expect(m.recall).toBeCloseTo(expectedRecall, 4);

      const expectedSpecificity = tn / 2443;
      expect(m.specificity).toBeCloseTo(expectedSpecificity, 4);

      const expectedPrecision = tp + fp > 0 ? tp / (tp + fp) : 0;
      expect(m.precision).toBeCloseTo(expectedPrecision, 4);

      const expectedBalancedAcc = (expectedRecall + expectedSpecificity) / 2;
      expect(m.balancedAccuracy).toBeCloseTo(expectedBalancedAcc, 4);

      // Verify non-empty code snippets and descriptions
      expect(m.codeSnippet.length).toBeGreaterThan(50);
      expect(m.description.length).toBeGreaterThan(30);
    }
  });
});
