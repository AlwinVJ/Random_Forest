import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Sigma,
  Calculator,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  DifficultyBadge,
  Meta,
  PageHeader,
  SectionHeading,
  Callout,
} from "@/components/lab/primitives";
import { MathView } from "@/components/lab/MathView";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mathematical-deep-dive")({
  head: () => ({
    meta: [
      { title: "Mathematical Deep Dive — Random Forest Lab" },
      {
        name: "description",
        content:
          "Rigorous mathematical proofs, probability derivations, variance formulas, and asymptotic theorems behind Random Forest.",
      },
      { property: "og:title", content: "Mathematical Deep Dive — Random Forest Lab" },
      {
        property: "og:description",
        content: "The complete mathematical foundations that make Random Forest work.",
      },
    ],
  }),
  component: MathDeepDivePage,
});

interface MathTopic {
  id: string;
  category: "Probability" | "Statistics" | "Asymptotics" | "Ensemble Theory" | "Complexity";
  title: string;
  formula: string;
  intuition: string;
  variables: { sym: string; def: string }[];
  derivation: string[];
  numericalExample: {
    problem: string;
    calculation: string;
    interpretation: string;
  };
  rfConnection: string;
}

const mathTopics: MathTopic[] = [
  {
    id: "prob-foundations",
    category: "Probability",
    title: "1. Axiomatic Probability & Independence",
    formula: "P(A \\cap B) = P(A) \\cdot P(B) \\iff A \\perp B",
    intuition:
      "Probability provides the formal language to quantify uncertainty. When two events are independent, knowledge of one event gives zero information about the occurrence of the other.",
    variables: [
      { sym: "P(A)", def: "Probability of event A occurring (0 ≤ P(A) ≤ 1)" },
      { sym: "A \\perp B", def: "A and B are statistically independent random events" },
    ],
    derivation: [
      "By definition of conditional probability: P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} for P(B) > 0.",
      "If events A and B are independent, P(A \\mid B) = P(A).",
      "Substituting gives: P(A) = \\frac{P(A \\cap B)}{P(B)} \\implies P(A \\cap B) = P(A) \\cdot P(B).",
    ],
    numericalExample: {
      problem: "Two independent trees have error rates of P(E_1) = 0.20 and P(E_2) = 0.20.",
      calculation: "P(E_1 \\cap E_2) = 0.20 \\times 0.20 = 0.040 \\; (4.0\\%)",
      interpretation: "The probability that both independent trees simultaneously make an error drops from 20% to just 4%.",
    },
    rfConnection:
      "Random Forest strives to make tree errors as close to pairwise independent as possible, so that simultaneous mistakes become vanishingly rare.",
  },
  {
    id: "conditional-prob",
    category: "Probability",
    title: "2. Conditional Probability & Bayes' Rule",
    formula: "P(Y = c \\mid X = x) = \\frac{P(X = x \\mid Y = c) P(Y = c)}{P(X = x)}",
    intuition:
      "Updating our belief about the probability of a target class Y given newly observed feature evidence X.",
    variables: [
      { sym: "P(Y = c \\mid X = x)", def: "Posterior probability of class c given feature vector x" },
      { sym: "P(Y = c)", def: "Prior probability (base rate of class c in dataset)" },
      { sym: "P(X = x \\mid Y = c)", def: "Likelihood of observing features x among class c instances" },
    ],
    derivation: [
      "Joint probability expansion: P(X \\cap Y) = P(X \\mid Y)P(Y) = P(Y \\mid X)P(X).",
      "Equating both expressions: P(Y \\mid X)P(X) = P(X \\mid Y)P(Y).",
      "Dividing both sides by marginal evidence P(X) yields Bayes' theorem.",
    ],
    numericalExample: {
      problem: "In a medical dataset, base cancer rate P(C) = 0.01. Test sensitivity P(+|C) = 0.95, false positive rate P(+|¬C) = 0.05.",
      calculation: "P(C \\mid +) = \\frac{0.95 \\times 0.01}{(0.95 \\times 0.01) + (0.05 \\times 0.99)} = \\frac{0.0095}{0.0095 + 0.0495} = 0.161",
      interpretation: "Even with a 95% sensitive test, rare prior probability (1%) means only 16.1% of test-positive cases actually have cancer.",
    },
    rfConnection:
      "Leaf nodes in a classification tree estimate the local posterior class probability P(Y=c|X ∈ Leaf) based on empirical training class proportions.",
  },
  {
    id: "sampling-replacement",
    category: "Probability",
    title: "3. Sampling With Replacement (Multinomial Draws)",
    formula: "P(x_i \\text{ chosen } k \\text{ times}) = \\binom{N}{k} \\left(\\frac{1}{N}\\right)^k \\left(1 - \\frac{1}{N}\\right)^{N-k}",
    intuition:
      "Drawing N items with replacement from an urn of N items means each item has independent identical chances on every single draw.",
    variables: [
      { sym: "N", def: "Total number of observations in original dataset" },
      { sym: "k", def: "Number of times a specific observation is duplicated in the bootstrap sample" },
    ],
    derivation: [
      "On each of the N draws, the probability of selecting item i is p = 1/N.",
      "The probability of not selecting item i on a single draw is 1 - p = 1 - 1/N.",
      "Because draws are independent and identically distributed, the count of selections follows Binomial(N, 1/N).",
    ],
    numericalExample: {
      problem: "In a sample of N = 6, calculate the probability an item appears exactly twice (k = 2).",
      calculation: "P(k=2) = \\binom{6}{2} \\left(\\frac{1}{6}\\right)^2 \\left(\\frac{5}{6}\\right)^4 = 15 \\times \\frac{1}{36} \\times \\frac{625}{1296} = 0.2009 \\; (20.1\\%)",
      interpretation: "There is a 20.1% chance that any specific data point appears as an exact duplicate in the bootstrap sample.",
    },
    rfConnection:
      "This process creates duplicate emphasis on certain data points in each tree, forcing trees to explore different localized data structures.",
  },
  {
    id: "binomial-dist",
    category: "Probability",
    title: "4. Binomial Distribution of Majority Voting",
    formula: "P(K = k) = \\binom{B}{k} p^k (1 - p)^{B - k}",
    intuition:
      "Models the number of correct votes K among B trees when each tree has an independent probability p of predicting the correct class.",
    variables: [
      { sym: "B", def: "Total number of trees in the Random Forest ensemble" },
      { sym: "p", def: "Individual tree classification accuracy (probability of correct vote)" },
      { sym: "K", def: "Random variable representing the total count of correct tree votes" },
    ],
    derivation: [
      "Let I_b ∈ {0, 1} be the indicator that tree b votes correctly, with P(I_b = 1) = p.",
      "The total correct votes K = ∑ I_b is the sum of B independent Bernoulli trials.",
      "The binomial PMF computes the probability of obtaining exactly k successes and B - k failures across any of the (B choose k) combinations.",
    ],
    numericalExample: {
      problem: "For B = 25 trees with individual accuracy p = 0.65, calculate the expected number of correct votes and its variance.",
      calculation: "E[K] = Bp = 25 \\times 0.65 = 16.25, \\quad \\operatorname{Var}(K) = Bp(1-p) = 25 \\times 0.65 \\times 0.35 = 5.6875",
      interpretation: "The expected majority vote margin is 16.25 out of 25, safely above the 13-vote winning threshold.",
    },
    rfConnection:
      "Underpins the Condorcet jury theorem: as B increases, the cumulative probability P(K > B/2) converges rapidly to 1.0.",
  },
  {
    id: "expected-value",
    category: "Statistics",
    title: "5. Expected Value & Linearity of Expectation",
    formula: "\\mathbb{E}\\left[\\sum_{b=1}^{B} c_b X_b\\right] = \\sum_{b=1}^{B} c_b \\mathbb{E}[X_b]",
    intuition:
      "Expectation is the probability-weighted average outcome. Linearity of expectation holds universally, regardless of whether the variables are independent or correlated!",
    variables: [
      { sym: "\\mathbb{E}[X]", def: "Expected value (population mean) of random variable X" },
      { sym: "c_b", def: "Arbitrary scalar constants" },
    ],
    derivation: [
      "\\mathbb{E}[aX + bY] = \\iint (ax + by) p(x, y) \\, dx \\, dy.",
      "= a \\iint x p(x, y) \\, dx \\, dy + b \\iint y p(x, y) \\, dx \\, dy.",
      "= a \\int x p(x) \\, dx + b \\int y p(y) \\, dy = a\\mathbb{E}[X] + b\\mathbb{E}[Y].",
    ],
    numericalExample: {
      problem: "An ensemble averages B = 100 trees, each with expected prediction E[T_b(x)] = 42.5. Find the ensemble expectation.",
      calculation: "\\mathbb{E}[\\bar{T}(x)] = \\mathbb{E}\\left[\\frac{1}{100} \\sum_{b=1}^{100} T_b(x)\\right] = \\frac{1}{100} (100 \\times 42.5) = 42.5",
      interpretation: "Averaging models never changes expected prediction; it preserves the exact same expected value (and bias).",
    },
    rfConnection:
      "Proves that Random Forest averaging cannot introduce artificial systematic bias compared to its base decision trees.",
  },
  {
    id: "variance-covariance",
    category: "Statistics",
    title: "6. Variance, Covariance & Correlation",
    formula: "\\operatorname{Cov}(X, Y) = \\mathbb{E}[(X - \\mu_X)(Y - \\mu_Y)] = \\rho \\sigma_X \\sigma_Y",
    intuition:
      "Variance measures individual model dispersion. Covariance measures the degree to which two estimators make similar errors in the same direction.",
    variables: [
      { sym: "\\operatorname{Var}(X)", def: "Variance of X, E[(X - μ)²] = E[X²] - μ²" },
      { sym: "\\operatorname{Cov}(X, Y)", def: "Covariance between random variables X and Y" },
      { sym: "\\rho", def: "Pearson correlation coefficient (-1 ≤ ρ ≤ 1)" },
    ],
    derivation: [
      "Expand the definition: \\operatorname{Cov}(X, Y) = \\mathbb{E}[XY - X\\mu_Y - Y\\mu_X + \\mu_X\\mu_Y].",
      "Using linearity: = \\mathbb{E}[XY] - \\mu_X\\mu_Y - \\mu_X\\mu_Y + \\mu_X\\mu_Y = \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y].",
      "Dividing by standard deviations yields Pearson correlation ρ.",
    ],
    numericalExample: {
      problem: "Two trees have variance σ² = 16. Their pairwise correlation is ρ = 0.25. Compute their covariance.",
      calculation: "\\operatorname{Cov}(T_1, T_2) = \\rho \\sigma_1 \\sigma_2 = 0.25 \\times \\sqrt{16} \\times \\sqrt{16} = 0.25 \\times 16 = 4.0",
      interpretation: "Positive covariance of 4.0 indicates mild co-movement of error terms.",
    },
    rfConnection:
      "Random feature subsampling directly targets and minimizes Cov(T_i, T_j) across all tree pairs in the forest.",
  },
  {
    id: "oob-limit",
    category: "Asymptotics",
    title: "7. Asymptotic Out-of-Bag (OOB) Limit",
    formula: "\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = e^{-1} = \\frac{1}{2.71828\\dots} \\approx 0.367879",
    intuition:
      "No matter how massive your dataset is, exactly ~36.8% of observations will naturally be omitted from any single bootstrap sample.",
    variables: [
      { sym: "N", def: "Dataset observation sample size" },
      { sym: "e", def: "Euler's mathematical constant (base of natural logarithm)" },
    ],
    derivation: [
      "Let L = \\lim_{N \\to \\infty} (1 - 1/N)^N.",
      "Take the natural logarithm: \\ln(L) = \\lim_{N \\to \\infty} N \\ln(1 - 1/N) = \\lim_{N \\to \\infty} \\frac{\\ln(1 - 1/N)}{1/N}.",
      "Apply L'Hôpital's Rule (0/0 indeterminate form): differentiate numerator and denominator with respect to N.",
      "\\frac{d}{dN} \\ln(1 - 1/N) = \\frac{1}{1 - 1/N} \\cdot \\frac{1}{N^2}, \\quad \\frac{d}{dN} \\left(\\frac{1}{N}\\right) = -\\frac{1}{N^2}.",
      "Ratio of derivatives: \\lim_{N \\to \\infty} \\frac{1/(N^2 (1 - 1/N))}{-1/N^2} = \\lim_{N \\to \\infty} -\\frac{1}{1 - 1/N} = -1.",
      "Exponentiating both sides: L = e^{-1} = 1/e \\approx 0.367879.",
    ],
    numericalExample: {
      problem: "Evaluate (1 - 1/N)^N for N = 10, N = 100, and N = 1000.",
      calculation: "N=10: (0.9)^{10} = 0.3487; \\quad N=100: (0.99)^{100} = 0.3660; \\quad N=1000: (0.999)^{1000} = 0.3677",
      interpretation: "By N = 1000, empirical inclusion matches the infinite-limit constant to within 0.0002.",
    },
    rfConnection:
      "Guarantees that ~36.8% of training data is always available out-of-bag to validate each tree without requiring separate validation splits.",
  },
  {
    id: "expected-unique-rows",
    category: "Asymptotics",
    title: "8. Expected Unique Observations in Bootstrap",
    formula: "\\mathbb{E}[U] = N \\left[ 1 - \\left(1 - \\frac{1}{N}\\right)^N \\right] \\approx N (1 - e^{-1}) \\approx 0.632121 \\times N",
    intuition:
      "A bootstrap sample of size N contains on average ~63.2% unique original observations, with the remaining ~36.8% being duplicate repetitions.",
    variables: [
      { sym: "U", def: "Number of unique observations appearing in the bootstrap sample" },
      { sym: "N", def: "Total original sample size" },
    ],
    derivation: [
      "Let I_i be an indicator variable equal to 1 if observation i is selected at least once, and 0 otherwise.",
      "The total unique count is U = ∑_{i=1}^N I_i.",
      "\\mathbb{E}[I_i] = P(I_i = 1) = 1 - P(x_i \\notin D^*) = 1 - (1 - 1/N)^N.",
      "By linearity of expectation: \\mathbb{E}[U] = \\sum_{i=1}^N \\mathbb{E}[I_i] = N [1 - (1 - 1/N)^N].",
    ],
    numericalExample: {
      problem: "For an industrial dataset with N = 50,000 observations, calculate the expected number of unique rows in each tree's training sample.",
      calculation: "\\mathbb{E}[U] \\approx 50000 \\times 0.632121 = 31,606 \\text{ unique rows}",
      interpretation: "Each tree trains on ~31,606 unique rows, leaving ~18,394 rows out-of-bag for validation.",
    },
    rfConnection:
      "Explains why base trees maintain diversity despite being drawn from the exact same underlying dataset.",
  },
  {
    id: "law-large-numbers",
    category: "Asymptotics",
    title: "9. Strong Law of Large Numbers (LLN)",
    formula: "P\\left( \\lim_{B \\to \\infty} \\frac{1}{B} \\sum_{b=1}^{B} T_b(x) = \\mathbb{E}[T(x)] \\right) = 1",
    intuition:
      "As the number of trees B grows without bound, the sample average of their predictions converges almost surely to the true expected value. Random Forest cannot diverge or overfit by adding more trees!",
    variables: [
      { sym: "B", def: "Number of estimators (n_estimators)" },
      { sym: "\\mathbb{E}[T(x)]", def: "True expected prediction over the random parameter distribution Θ" },
    ],
    derivation: [
      "Leo Breiman (2001) applied the Strong Law of Large Numbers to Random Forest estimators.",
      "Because trees T_b(x; Θ_b) are independently parameterized by identically distributed random vectors Θ_b, Kolmogorov's Strong Law guarantees that the empirical ensemble average converges almost surely to E_Θ[T(x; Θ)].",
      "This implies the generalization error converges to a finite bound, proving that Random Forests DO NOT overfit as n_estimators → ∞.",
    ],
    numericalExample: {
      problem: "Observe prediction stability as B increases from 10 to 500 trees.",
      calculation: "B=10: \\hat{y}=0.742; \\quad B=50: \\hat{y}=0.704; \\quad B=100: \\hat{y}=0.701; \\quad B=500: \\hat{y}=0.7001",
      interpretation: "Fluctuations decay at rate 1/√B, stabilizing firmly around the expected value 0.700.",
    },
    rfConnection:
      "Provides theoretical proof that increasing n_estimators is always safe and never degrades generalization error.",
  },
  {
    id: "central-limit-theorem",
    category: "Asymptotics",
    title: "10. Central Limit Theorem (CLT) for Ensembles",
    formula: "\\sqrt{B} \\left( \\frac{1}{B} \\sum_{b=1}^{B} T_b(x) - \\mu \\right) \\xrightarrow{d} \\mathcal{N}(0, \\sigma^2)",
    intuition:
      "Even if individual decision tree outputs are highly non-normal (stepped, discrete, or skewed), the distribution of their averaged prediction approaches a Gaussian distribution.",
    variables: [
      { sym: "\\mu", def: "Expected prediction E[T(x)]" },
      { sym: "\\sigma^2", def: "Variance of individual tree predictions" },
      { sym: "\\mathcal{N}(0, \\sigma^2)", def: "Normal Gaussian distribution with mean 0 and variance σ²" },
    ],
    derivation: [
      "Let Z_b = T_b(x) - μ be zero-mean independent random variables with finite variance σ².",
      "The characteristic function φ_{Z_b}(t/\\sqrt{B}) expands as 1 - \\frac{t^2 \\sigma^2}{2B} + o(t^2/B).",
      "The characteristic function of the normalized sum is [φ(t/\\sqrt{B})]^B = [1 - t²σ²/(2B)]^B → e^{-t²σ²/2}.",
      "By Lévy's continuity theorem, this characteristic function corresponds uniquely to the Gaussian distribution N(0, σ²).",
    ],
    numericalExample: {
      problem: "For an individual tree variance σ² = 36 and B = 100 trees, compute the standard error of the ensemble prediction.",
      calculation: "\\operatorname{SE} = \\frac{\\sigma}{\\sqrt{B}} = \\frac{\\sqrt{36}}{\\sqrt{100}} = \\frac{6}{10} = 0.60",
      interpretation: "The 95% confidence interval for the regression prediction is ŷ ± 1.96(0.60) = ŷ ± 1.18.",
    },
    rfConnection:
      "Enables constructing reliable confidence and prediction intervals around Random Forest regression predictions.",
  },
  {
    id: "bias-variance-decomp",
    category: "Ensemble Theory",
    title: "11. Full Bias-Variance-Noise Decomposition",
    formula: "\\mathbb{E}[(Y - \\hat{f}(X))^2] = \\operatorname{Bias}(\\hat{f}(X))^2 + \\operatorname{Var}(\\hat{f}(X)) + \\sigma_\\epsilon^2",
    intuition:
      "Any supervised model's test error is composed of: (1) systematic wrongness (Bias²), (2) sensitivity to training data fluctuations (Variance), and (3) inherent unpredictability in nature (Noise).",
    variables: [
      { sym: "\\operatorname{Bias}(\\hat{f})", def: "f(X) - E[f̂(X)] (distance between truth and expected model)" },
      { sym: "\\operatorname{Var}(\\hat{f})", def: "E[(f̂(X) - E[f̂(X)])²] (model fluctuation variance)" },
      { sym: "\\sigma_\\epsilon^2", def: "Var(ε) irreducible noise floor" },
    ],
    derivation: [
      "Let Y = f(X) + ε with E[ε] = 0 and Var(ε) = σ²_ε.",
      "E[(Y - f̂)²] = E[( (f - f̂) + ε )²] = E[(f - f̂)²] + 2E[(f - f̂)ε] + E[ε²].",
      "Since noise ε is independent of data and model, E[(f - f̂)ε] = 0.",
      "E[(f - f̂)²] = E[ ( (f - E[f̂]) + (E[f̂] - f̂) )² ] = (f - E[f̂])² + E[(f̂ - E[f̂])²] = Bias² + Variance.",
    ],
    numericalExample: {
      problem: "A model has Bias = 2.0, Variance = 15.0, and Noise = 4.0. Compute expected test MSE.",
      calculation: "\\text{MSE} = (2.0)^2 + 15.0 + 4.0 = 4.0 + 15.0 + 4.0 = 23.0",
      interpretation: "Variance accounts for 65.2% of the total error, signaling high opportunity for ensemble variance reduction.",
    },
    rfConnection:
      "Single deep decision trees have Bias² ≈ 0 but Variance >> 0. Random Forest specifically eliminates the Variance component.",
  },
  {
    id: "breiman-hastie-var",
    category: "Ensemble Theory",
    title: "12. Breiman-Hastie Ensemble Variance Formula",
    formula: "\\operatorname{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2",
    intuition:
      "The definitive equation of Random Forest: averaging B correlated trees reduces the second term to zero, but leaves the first term ρσ² as an insurmountable floor. To beat the floor, you MUST lower correlation ρ!",
    variables: [
      { sym: "\\rho", def: "Average pairwise Pearson correlation between trees" },
      { sym: "\\sigma^2", def: "Individual tree variance" },
      { sym: "B", def: "Number of trees in the forest" },
    ],
    derivation: [
      "\\operatorname{Var}\\left(\\frac{1}{B} \\sum_{b=1}^B T_b\\right) = \\frac{1}{B^2} \\left[ \\sum_{b=1}^B \\operatorname{Var}(T_b) + \\sum_{i \\ne j} \\operatorname{Cov}(T_i, T_j) \\right].",
      "Substitute Var(T_b) = σ² and Cov(T_i, T_j) = ρσ².",
      "= \\frac{1}{B^2} [ B\\sigma^2 + B(B - 1)\\rho\\sigma^2 ] = \\frac{\\sigma^2}{B} + \\frac{B - 1}{B} \\rho\\sigma^2.",
      "= \\frac{\\sigma^2}{B} + \\rho\\sigma^2 - \\frac{\\rho\\sigma^2}{B} = \\rho\\sigma^2 + \\frac{1 - \\rho}{B}\\sigma^2.",
    ],
    numericalExample: {
      problem: "Compare ensemble variance for B = 100 with ρ = 0.40 vs ρ = 0.10 when σ² = 100.",
      calculation: "\\text{For } \\rho=0.40: 40 + 0.60 = 40.60; \\quad \\text{For } \\rho=0.10: 10 + 0.90 = 10.90",
      interpretation: "Dropping correlation from 0.40 to 0.10 slashes ensemble variance by 73.2%!",
    },
    rfConnection:
      "This single formula is why Random Forest randomly samples candidate features at every split: it drives ρ down.",
  },
  {
    id: "correlated-errors",
    category: "Ensemble Theory",
    title: "13. Correlated Errors and Decorrelation Mechanics",
    formula: "\\rho = \\frac{\\operatorname{Cov}(T_i, T_j)}{\\sigma_i \\sigma_j} \\implies \\Delta \\rho < 0 \\text{ via } m = \\lfloor\\sqrt{p}\\rfloor",
    intuition:
      "If every tree splits on the same dominant feature at the root, trees become clones. Randomly hiding features forces alternative features to be explored, decorrelating predictions.",
    variables: [
      { sym: "m", def: "Candidate feature subset size evaluated per split" },
      { sym: "p", def: "Total number of available features in dataset" },
    ],
    derivation: [
      "Let F* be the single most dominant predictive feature in dataset D.",
      "Under pure Bagging (m = p), every tree evaluates F* and selects it as the root split with probability ~1.0, inducing high correlation ρ ≈ 0.6 - 0.8.",
      "Under Random Forest (m = √p), the probability that F* is included in the candidate split set is P(F* ∈ subset) = m/p = √p / p = 1/√p.",
      "For p = 100 features, P(F* evaluated) = 10/100 = 10%. In 90% of trees, alternative features are forced into the root split, radically decreasing ρ.",
    ],
    numericalExample: {
      problem: "For p = 64 features, compare the probability a dominant feature is selected for evaluation under Bagging vs Random Forest.",
      calculation: "\\text{Bagging: } m=64 \\implies P = 100\\%; \\quad \\text{Random Forest: } m=\\sqrt{64}=8 \\implies P = \\frac{8}{64} = 12.5\\%",
      interpretation: "Random Forest prevents the dominant feature from dominating 87.5% of split candidates.",
    },
    rfConnection:
      "Directly explains why max_features='sqrt' is the standard default for Random Forest classification.",
  },
  {
    id: "computational-complexity",
    category: "Complexity",
    title: "14. Computational Complexity (Big-O Notation)",
    formula: "\\mathcal{O}_{\\text{train}} = \\mathcal{O}(B \\cdot m \\cdot N \\log N), \\qquad \\mathcal{O}_{\\text{predict}} = \\mathcal{O}(B \\cdot D)",
    intuition:
      "Quantifies the exact scaling behavior of training and querying Random Forests as data size and feature counts grow.",
    variables: [
      { sym: "N", def: "Number of training observations" },
      { sym: "p", def: "Total number of features" },
      { sym: "m", def: "Features sampled per split (e.g. √p)" },
      { sym: "B", def: "Number of trees (n_estimators)" },
      { sym: "D", def: "Average tree depth (typically O(log N))" },
    ],
    derivation: [
      "At each tree level, sorting N samples across m candidate features takes O(m · N log N).",
      "For a balanced tree with depth D = log N, sum over levels: O(m · N log N).",
      "Multiplying across all B trees yields O(B · m · N log N) for training.",
      "Inference traverses from root to leaf down depth D for B trees: O(B · D).",
    ],
    numericalExample: {
      problem: "Compare training operations for Bagging (m = 100) vs Random Forest (m = √100 = 10) for N = 10,000 and B = 100.",
      calculation: "\\text{Bagging: } 100 \\times 100 \\times 10^4 \\log_2(10^4) \\approx 1.33 \\times 10^9 \\text{ ops}; \\quad \\text{RF: } 1.33 \\times 10^8 \\text{ ops}",
      interpretation: "Random Forest trains approximately 10x faster than pure Bagging while achieving superior accuracy!",
    },
    rfConnection:
      "Proves that Random Forest is not only more accurate than Bagging due to tree decorrelation, but also asymptotically faster to train.",
  },
];

const categories = [
  "All",
  "Probability",
  "Statistics",
  "Asymptotics",
  "Ensemble Theory",
  "Complexity",
] as const;

function MathDeepDivePage() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("breiman-hastie-var");

  const filteredTopics =
    selectedCat === "All"
      ? mathTopics
      : mathTopics.filter((t) => t.category === selectedCat);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        crumbs={[
          { label: "Course", to: "/" },
          { label: "Advanced Concepts" },
          { label: "Mathematical Deep Dive" },
        ]}
        eyebrow="Mathematical Foundations"
        title="Mathematical Deep Dive"
        intro="Fourteen core theoretical results from probability, asymptotic analysis, and statistical learning theory that prove why Random Forest generalizes."
      >
        <Meta>90 min rigorous study</Meta>
        <DifficultyBadge level="Advanced" />
      </PageHeader>

      {/* Central Theorem Callout */}
      <div className="mt-8">
        <Callout type="tip" title="The Fundamental Law of Ensembles">
          The central mathematical result governing Random Forest is the Breiman-Hastie equation:
          <span className="font-mono font-semibold text-foreground"> Var = ρσ² + ((1 - ρ)/B)σ²</span>.
          Averaging B trees reduces independent noise to zero, but the error floor is bounded by
          pairwise tree correlation ρ. Every algorithmic decision in Random Forest exists to drive ρ down.
        </Callout>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2 font-mono">
          <Filter className="size-3.5 text-primary" />
          Filter:
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCat === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mathematical Topics Accordion / Cards */}
      <div className="mt-8 space-y-6">
        {filteredTopics.map((t, idx) => {
          const isExpanded = expandedId === t.id;

          return (
            <div
              key={t.id}
              className={`surface overflow-hidden transition-all duration-200 ${
                isExpanded ? "border-primary/50 shadow-lg ring-1 ring-primary/20" : ""
              }`}
            >
              {/* Header Banner */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : t.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer bg-card hover:bg-secondary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
                      {t.category.toUpperCase()}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{t.title}</h3>
                  </div>
                  <div className="mt-2 font-mono text-sm text-accent overflow-x-auto">
                    <MathView math={t.formula} />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-center text-xs shrink-0"
                >
                  {isExpanded ? "Hide Derivation & Proof" : "Explore Derivation & Proof"}
                </Button>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="border-t border-border bg-secondary/10 p-6 space-y-6 animate-fade-up">
                  {/* 1. Intuition */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-semibold text-muted-foreground tracking-wider mb-2">
                      Intuitive Principle
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground">{t.intuition}</p>
                  </div>

                  {/* 2. Governing Formula & Variables */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-semibold text-muted-foreground tracking-wider mb-2">
                      Mathematical Formulation & Variables
                    </h4>
                    <div className="surface bg-grid p-4 text-center overflow-x-auto">
                      <MathView math={t.formula} display />
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                      {t.variables.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 rounded bg-secondary/40 p-2 border border-border">
                          <span className="font-mono text-accent font-semibold">
                            <MathView math={v.sym} />:
                          </span>
                          <span className="text-muted-foreground">{v.def}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Step-by-Step Derivation */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-semibold text-muted-foreground tracking-wider mb-2">
                      Step-by-Step Mathematical Derivation
                    </h4>
                    <div className="surface divide-y divide-border overflow-hidden">
                      {t.derivation.map((d, i) => (
                        <div key={i} className="flex items-start gap-3 p-3.5 text-xs">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-[11px] font-semibold">
                            {i + 1}
                          </span>
                          <div className="flex-1 text-foreground leading-relaxed overflow-x-auto">
                            <MathView math={d} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Numerical Example */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-semibold text-muted-foreground tracking-wider mb-2">
                      Concrete Numerical Example
                    </h4>
                    <div className="rounded-lg border border-border bg-background p-4 text-xs space-y-2">
                      <p className="font-medium text-foreground">{t.numericalExample.problem}</p>
                      <div className="rounded bg-secondary/40 p-2 font-mono text-accent overflow-x-auto">
                        <MathView math={t.numericalExample.calculation} />
                      </div>
                      <p className="text-muted-foreground">{t.numericalExample.interpretation}</p>
                    </div>
                  </div>

                  {/* 5. Random Forest Connection */}
                  <div className="surface border-l-4 border-l-accent p-4 text-xs">
                    <span className="font-semibold text-foreground">Random Forest Connection: </span>
                    <span className="text-muted-foreground leading-relaxed">{t.rfConnection}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
