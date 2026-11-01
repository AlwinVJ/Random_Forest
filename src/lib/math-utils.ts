/**
 * Random Forest Lab - Reusable Pure Mathematical & Statistical Functions
 * Implements rigorous numerical algorithms with edge-case handling.
 */

/**
 * Calculates Matthews Correlation Coefficient (MCC) from a confusion matrix.
 *
 * Formula:
 *   MCC = (TP * TN - FP * FN) / sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN))
 *
 * Scikit-Learn / Bio-statistics Convention:
 *   If any sum in the denominator is zero, MCC is mathematically defined as 0.0
 *   to prevent NaN propagation.
 */
export function calculateMCC(
  tp: number,
  tn: number,
  fp: number,
  fn: number
): number {
  if (tp < 0 || tn < 0 || fp < 0 || fn < 0) {
    throw new RangeError("Confusion matrix values must be non-negative.");
  }

  const numerator = tp * tn - fp * fn;
  const d1 = tp + fp;
  const d2 = tp + fn;
  const d3 = tn + fp;
  const d4 = tn + fn;

  // Zero denominator protection
  if (d1 === 0 || d2 === 0 || d3 === 0 || d4 === 0) {
    return 0.0;
  }

  const denominator = Math.sqrt(d1 * d2 * d3 * d4);
  return denominator === 0 ? 0.0 : numerator / denominator;
}

/**
 * Generates synthetic minority sample vector via linear SMOTE interpolation.
 *
 * Formula:
 *   x_new = x_i + lambda * (x_nn - x_i)
 *
 * Parameters:
 *   xi: Seed minority observation vector.
 *   xnn: Selected minority K-nearest neighbor vector.
 *   lambda: Random interpolation coefficient in [0.0, 1.0].
 */
export function generateSmoteInterpolation(
  xi: number[],
  xnn: number[],
  lambda: number
): number[] {
  if (lambda < 0 || lambda > 1 || Number.isNaN(lambda)) {
    throw new RangeError(
      `Interpolation coefficient lambda must be in [0, 1], received ${lambda}.`
    );
  }

  if (xi.length !== xnn.length) {
    throw new Error(
      `Vector dimension mismatch: xi has dimension ${xi.length}, but xnn has dimension ${xnn.length}.`
    );
  }

  if (xi.length === 0) {
    throw new Error("Vectors cannot be empty.");
  }

  if (lambda === 0) {
    return [...xi];
  }
  if (lambda === 1) {
    return [...xnn];
  }

  return xi.map((xi_j, j) => {
    const diff = xnn[j] - xi_j;
    return xi_j + lambda * diff;
  });
}

/**
 * Calculates theoretical TreeSHAP computational complexity estimate.
 *
 * Primary Reference: Lundberg et al. (Nature Machine Intelligence, 2020)
 *
 * Formula for Tree Ensemble per sample:
 *   Complexity = O(T * L * D^2)
 *
 * Parameters:
 *   numTrees (T): Number of trees in the ensemble.
 *   maxLeaves (L): Maximum number of leaf nodes per tree.
 *   maxDepth (D): Maximum tree depth.
 *
 * Assumptions:
 *   - Evaluates tree paths using feature dependencies.
 *   - Polynomial in tree depth D, contrasting with generic KernelSHAP's exponential O(2^p).
 */
export function calculateTreeShapComplexity(
  numTrees: number,
  maxLeaves: number,
  maxDepth: number
): number {
  if (numTrees <= 0 || maxLeaves <= 0 || maxDepth <= 0) {
    return 0;
  }

  if (
    !Number.isFinite(numTrees) ||
    !Number.isFinite(maxLeaves) ||
    !Number.isFinite(maxDepth)
  ) {
    return 0;
  }

  return numTrees * maxLeaves * Math.pow(maxDepth, 2);
}

/**
 * Calculates Gini Impurity for a categorical node sample distribution.
 * I_G(t) = 1 - sum(p_k^2)
 */
export function calculateGini(classCounts: number[]): number {
  const total = classCounts.reduce((acc, c) => acc + c, 0);
  if (total <= 0) return 0.0;
  const sumSquared = classCounts.reduce((acc, c) => {
    const p = c / total;
    return acc + p * p;
  }, 0);
  return 1.0 - sumSquared;
}

/**
 * Calculates Shannon Entropy in bits (base-2).
 * H(t) = - sum(p_k * log2(p_k))
 */
export function calculateEntropy(classCounts: number[]): number {
  const total = classCounts.reduce((acc, c) => acc + c, 0);
  if (total <= 0) return 0.0;
  return classCounts.reduce((acc, c) => {
    if (c === 0) return acc;
    const p = c / total;
    return acc - p * Math.log2(p);
  }, 0);
}

/**
 * Calculates Brier Score probability calibration metric.
 * Brier = (1 / N) * sum((p_hat_i - y_i)^2)
 */
export function calculateBrierScore(
  yTrue: number[],
  yProb: number[]
): number {
  if (yTrue.length !== yProb.length || yTrue.length === 0) {
    throw new Error("Length mismatch or empty array.");
  }
  const sumSq = yTrue.reduce((acc, y, i) => {
    const diff = yProb[i] - y;
    return acc + diff * diff;
  }, 0);
  return sumSq / yTrue.length;
}

/**
 * Calculates Bayes Optimal Decision Threshold under asymmetric financial loss.
 * tau* = C_FP / (C_FP + C_FN)
 */
export function calculateBayesOptimalThreshold(
  costFP: number,
  costFN: number
): number {
  if (costFP < 0 || costFN < 0 || costFP + costFN === 0) {
    throw new RangeError("Costs must be non-negative and sum to > 0.");
  }
  return costFP / (costFP + costFN);
}

/**
 * Parallel scaling speedup: S(p) = T_1 / T_p
 */
export function calculateSpeedup(t1: number, tp: number): number {
  if (tp <= 0 || t1 <= 0) return 0.0;
  return t1 / tp;
}

/**
 * Parallel core efficiency: E(p) = S(p) / p
 */
export function calculateParallelEfficiency(
  speedup: number,
  pWorkers: number
): number {
  if (pWorkers <= 0) return 0.0;
  return speedup / pWorkers;
}

/**
 * Amdahl's Law speedup limit: S = 1 / ((1 - s) + s / p)
 */
export function calculateAmdahlSpeedup(
  parallelFraction: number,
  pWorkers: number
): number {
  if (parallelFraction < 0 || parallelFraction > 1 || pWorkers <= 0) {
    return 0.0;
  }
  const serialFraction = 1.0 - parallelFraction;
  return 1.0 / (serialFraction + parallelFraction / pWorkers);
}

/**
 * Population Stability Index (PSI) for covariate and prediction drift detection.
 * PSI = sum((P_b - Q_b) * ln(P_b / Q_b))
 */
export function calculatePSI(
  baselineDist: number[],
  liveDist: number[]
): number {
  if (baselineDist.length !== liveDist.length || baselineDist.length === 0) {
    throw new Error("Distributions must have identical non-zero bin counts.");
  }
  let psi = 0.0;
  for (let i = 0; i < baselineDist.length; i++) {
    const p = baselineDist[i];
    const q = liveDist[i];
    if (p <= 0 || q <= 0) continue;
    psi += (p - q) * Math.log(p / q);
  }
  return psi;
}
