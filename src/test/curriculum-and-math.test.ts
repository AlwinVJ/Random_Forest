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
