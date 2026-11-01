export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Formula {
  label: string;
  expr: string;
  note?: string;
}

export interface DerivationStep {
  step: string;
  math?: string;
  note: string;
}

export interface WorkedStep {
  title: string;
  calculation: string;
  explanation: string;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  module: string;
  section: string;
  title: string;
  intro: string;
  whyNecessary: string;
  intuition: string;
  theory: string[];
  readTime: string;
  difficulty: Difficulty;
  formulas: Formula[];
  derivation?: {
    title: string;
    description: string;
    steps: DerivationStep[];
  };
  workedExample: {
    title: string;
    problem: string;
    steps: WorkedStep[];
    result: string;
  };
  rfConnection: string;
  code: string;
  codeExplanation?: string;
  application: string;
  mistakes: string[];
  prosCons?: {
    pros: string[];
    cons: string[];
  };
  takeaways: string[];
  quiz: QuizQuestion;
}

export const lessons: Record<string, Lesson> = {
  "ensemble-learning": {
    slug: "ensemble-learning",
    module: "01",
    section: "Fundamentals",
    title: "Ensemble Learning",
    intro:
      "Ensemble learning is a machine learning paradigm where multiple base models (weak learners) are strategically trained and combined to solve a computational intelligence problem, achieving significantly superior predictive performance and generalization than any constituent model.",
    whyNecessary:
      "Individual machine learning models frequently suffer from either high bias (underfitting complex patterns) or high variance (overfitting training noise). Ensembles overcome this fundamental bottleneck by aggregating diverse hypotheses, systematically canceling out idiosyncratic model errors while preserving true predictive signal.",
    intuition:
      "The 'Wisdom of Crowds' effect: If you ask 100 people to estimate the weight of an ox, individual guesses may be wildly erratic, but their arithmetic mean is extraordinarily accurate. Similarly, combining independent models allows their uncoordinated mistakes to average toward zero.",
    theory: [
      "In supervised learning, no single inductive bias is optimal across all problem domains (No Free Lunch theorem). A single model explores a restricted hypothesis space and can easily become trapped in poor local optima.",
      "Homogeneous ensembles generate base models using the exact same base algorithm (e.g., hundreds of decision trees in Random Forest), introducing diversity via data resampling and feature subsets.",
      "Heterogeneous ensembles combine distinctly different model families (e.g., logistic regression, support vector machines, neural networks, and gradient boosted trees) using meta-learning or stacking.",
      "The mathematical justification dates back to the Condorcet Jury Theorem (1785): if each voter has an independent probability p > 0.5 of arriving at the correct decision, the probability of a majority vote being correct approaches 1 as the number of voters approaches infinity.",
    ],
    readTime: "14 min",
    difficulty: "Beginner",
    formulas: [
      {
        label: "Ensemble Mean Prediction (Regression)",
        expr: "\\hat{y}(x) = \\frac{1}{B} \\sum_{b=1}^{B} f_b(x)",
        note: "f_b(x) denotes the prediction of the b-th estimator in a committee of B models.",
      },
      {
        label: "Majority Plurality Vote (Classification)",
        expr: "\\hat{y}(x) = \\operatorname{mode}\\{f_1(x), f_2(x), \\dots, f_B(x)\\}",
        note: "Class receiving the highest total count of votes across all estimators.",
      },
      {
        label: "Condorcet Majority Probability",
        expr: "P(\\text{Majority Correct}) = \\sum_{k=\\lfloor B/2 \\rfloor + 1}^{B} \\binom{B}{k} p^k (1-p)^{B-k}",
        note: "Assuming independent estimators with individual accuracy p > 0.5.",
      },
    ],
    derivation: {
      title: "Condorcet Jury Theorem for Majority Voting",
      description: "Deriving how majority voting accuracy scales as an ensemble expands.",
      steps: [
        {
          step: "Model each estimator vote as a Bernoulli trial",
          math: "X_b \\sim \\operatorname{Bernoulli}(p), \\quad P(X_b = 1) = p > 0.5",
          note: "Let X_b = 1 if the b-th estimator correctly predicts the true label, and 0 otherwise.",
        },
        {
          step: "Sum of independent correct votes follows a Binomial distribution",
          math: "K = \\sum_{b=1}^B X_b \\sim \\operatorname{Binomial}(B, p)",
          note: "The ensemble succeeds whenever strictly more than half the voters are correct: K > B / 2.",
        },
        {
          step: "Evaluate probability of ensemble success",
          math: "P(K > B/2) = \\sum_{k=\\lfloor B/2 \\rfloor + 1}^B \\binom{B}{k} p^k (1-p)^{B-k}",
          note: "By the Weak Law of Large Numbers, as B → ∞ with p > 0.5, P(K/B > 0.5) → 1.",
        },
      ],
    },
    workedExample: {
      title: "Majority Vote with 5 Independent Classifiers",
      problem:
        "Consider an ensemble of B = 5 independent binary classifiers, each with an individual accuracy of p = 0.70. Calculate the exact probability that the majority vote is correct.",
      steps: [
        {
          title: "Identify required majority threshold",
          calculation: "k \\ge \\lfloor 5/2 \\rfloor + 1 = 3",
          explanation: "At least 3, 4, or 5 classifiers must predict correctly for majority consensus.",
        },
        {
          title: "Compute P(K = 3)",
          calculation: "P(K=3) = \\binom{5}{3} (0.70)^3 (0.30)^2 = 10 \\times 0.343 \\times 0.09 = 0.3087",
          explanation: "Probability exactly 3 classifiers are correct.",
        },
        {
          title: "Compute P(K = 4)",
          calculation: "P(K=4) = \\binom{5}{4} (0.70)^4 (0.30)^1 = 5 \\times 0.2401 \\times 0.30 = 0.36015",
          explanation: "Probability exactly 4 classifiers are correct.",
        },
        {
          title: "Compute P(K = 5)",
          calculation: "P(K=5) = \\binom{5}{5} (0.70)^5 (0.30)^0 = 1 \\times 0.16807 \\times 1 = 0.16807",
          explanation: "Probability all 5 classifiers are correct.",
        },
        {
          title: "Sum probabilities for total majority success",
          calculation: "P(\\text{Success}) = 0.3087 + 0.36015 + 0.16807 = 0.83692",
          explanation: "Summing mutually exclusive winning scenarios.",
        },
      ],
      result: "83.69% accuracy (a 13.69 percentage-point boost over any individual classifier!)",
    },
    rfConnection:
      "Random Forest is the premier example of a homogeneous bagging ensemble. It deploys unpruned decision trees as base estimators and combines their predictions through majority voting (for classification) or mean averaging (for regression).",
    code: `from sklearn.ensemble import VotingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Generate synthetic dataset
X, y = make_classification(n_samples=1000, n_features=20, n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Build a heterogeneous voting ensemble
clf1 = LogisticRegression(random_state=42)
clf2 = DecisionTreeClassifier(max_depth=4, random_state=42)
clf3 = RandomForestClassifier(n_estimators=50, random_state=42)

ensemble = VotingClassifier(
    estimators=[('lr', clf1), ('dt', clf2), ('rf', clf3)],
    voting='soft'  # Weighted probability averaging
)

ensemble.fit(X_train, y_train)
print(f"Ensemble Test Accuracy: {ensemble.score(X_test, y_test):.4f}")`,
    codeExplanation:
      "VotingClassifier aggregates heterogeneous models. 'voting=soft' averages predicted class probabilities instead of raw discrete labels, producing smoother decision boundaries.",
    application:
      "Financial credit scoring systems combine scores from specialized credit bureau models, internal banking histories, and external behavioral datasets to minimize underwriting default risk.",
    mistakes: [
      "Assuming ensembles always outperform single models even if base learners are completely correlated (diversity is strictly required).",
      "Believing that an ensemble of weak models with p < 0.5 will improve accuracy (Condorcet proves it will converge to 0% accuracy!).",
      "Evaluating ensemble members on the training set rather than an out-of-sample test set.",
    ],
    prosCons: {
      pros: [
        "Consistently higher predictive accuracy and robustness.",
        "Significantly lower variance compared to individual high-capacity models.",
        "Naturally handles non-linear boundaries and complex feature interactions.",
      ],
      cons: [
        "Higher computational training and inference latency.",
        "Loss of direct model interpretability compared to a single decision tree.",
        "Requires more memory to store multiple estimator checkpoints.",
      ],
    },
    takeaways: [
      "Ensembles succeed only when base estimators are both competent (better than chance) and diverse (uncorrelated errors).",
      "Bagging, Boosting, and Stacking represent the three foundational ensemble paradigms in modern machine learning.",
      "Averaging independent estimators reduces variance without altering expected bias.",
    ],
    quiz: {
      prompt: "Under the Condorcet Jury Theorem, what condition is strictly required for an ensemble's accuracy to approach 100% as model count increases?",
      options: [
        "Base models must be completely identical and deterministic",
        "Base models must make independent errors with individual accuracy p > 0.5",
        "Base models must have zero training error",
        "The dataset must contain at least 1,000,000 observations",
      ],
      answerIndex: 1,
      explanation:
        "The theorem mathematically requires estimator independence (uncorrelated error terms) and individual competency (p > 0.5). If p < 0.5, majority voting guarantees the ensemble will converge to 100% incorrectness.",
    },
  },

  "decision-trees": {
    slug: "decision-trees",
    module: "02",
    section: "Fundamentals",
    title: "Decision Trees",
    intro:
      "Decision Trees are non-parametric supervised learning models that recursively partition the feature space into orthogonal hyper-rectangles, making predictions at leaf nodes based on the local majority class or mean target value.",
    whyNecessary:
      "Standard linear models cannot capture complex non-linear feature interactions without extensive manual polynomial feature engineering. Decision trees naturally discover non-linear thresholds and interaction effects directly from raw tabular data.",
    intuition:
      "Think of the game '20 Questions'. At each step, you ask the single binary question (e.g., 'Is Feature X greater than 4.5?') that eliminates the greatest amount of uncertainty, rapidly narrowing down the true category.",
    theory: [
      "Classification and Regression Trees (CART) construct binary trees via greedy recursive binary splitting. At every internal node, the algorithm exhaustively evaluates all candidate features and split thresholds to maximize node purity.",
      "Purity in classification trees is quantified using Gini Impurity (CART standard) or Shannon Entropy (C4.5/ID3 standard). For regression trees, purity is quantified by Mean Squared Error (variance reduction).",
      "Gini Impurity measures the probability that a randomly chosen element from the node set would be incorrectly labeled if it were randomly labeled according to the class distribution in the subset.",
      "Unconstrained decision trees grow until every leaf is pure or contains fewer than min_samples_split observations, which invariably leads to severe overfitting and high estimator variance.",
    ],
    readTime: "18 min",
    difficulty: "Beginner",
    formulas: [
      {
        label: "Gini Impurity",
        expr: "\\operatorname{Gini}(S) = 1 - \\sum_{k=1}^{K} p_k^2",
        note: "p_k is the proportion of observations in node S belonging to class k. 0 = perfectly pure node.",
      },
      {
        label: "Shannon Entropy",
        expr: "H(S) = -\\sum_{k=1}^{K} p_k \\log_2(p_k)",
        note: "Information entropy in bits. Max value for binary classification is 1.0 (50/50 split).",
      },
      {
        label: "Information Gain (Split Criterion)",
        expr: "\\operatorname{IG}(S, A) = \\operatorname{Impurity}(S) - \\sum_{v \\in \\{L, R\\}} \\frac{|S_v|}{|S|} \\operatorname{Impurity}(S_v)",
        note: "Reduction in weighted impurity after splitting parent S into left (L) and right (R) child nodes.",
      },
    ],
    derivation: {
      title: "Gini Impurity Formulation from Misclassification Probability",
      description: "Deriving Gini impurity as the expected error of random classification.",
      steps: [
        {
          step: "Probability of picking an item of class k",
          math: "P(\\text{Item} = k) = p_k",
          note: "Where p_k = N_k / N is the empirical frequency of class k in node S.",
        },
        {
          step: "Probability of randomly assigning label k to that item",
          math: "P(\\text{Assigned} = k) = p_k",
          note: "Assuming we assign labels randomly according to the same empirical distribution.",
        },
        {
          step: "Probability of correct label assignment",
          math: "P(\\text{Correct}) = \\sum_{k=1}^K P(\\text{Item} = k) \\cdot P(\\text{Assigned} = k) = \\sum_{k=1}^K p_k^2",
          note: "Sum over all mutually exclusive classes.",
        },
        {
          step: "Misclassification probability gives Gini impurity",
          math: "\\operatorname{Gini}(S) = 1 - P(\\text{Correct}) = 1 - \\sum_{k=1}^K p_k^2",
          note: "When one class dominates (p_1 = 1), Gini = 1 - 1 = 0 (perfect purity). For balanced binary, Gini = 1 - (0.5² + 0.5²) = 0.5.",
        },
      ],
    },
    workedExample: {
      title: "Calculating Gini Impurity & Information Gain for a Binary Split",
      problem:
        "A parent node S contains 40 positive (+1) and 60 negative (-1) samples (total N = 100). A candidate split partitions S into Left (30+, 10-) and Right (10+, 50-). Calculate the parent Gini, weighted child Gini, and Information Gain.",
      steps: [
        {
          title: "Compute Parent Node Gini",
          calculation: "\\operatorname{Gini}(S) = 1 - [(40/100)^2 + (60/100)^2] = 1 - [0.16 + 0.36] = 0.480",
          explanation: "Parent node has 40% positive and 60% negative samples.",
        },
        {
          title: "Compute Left Child Gini (N_L = 40)",
          calculation: "\\operatorname{Gini}(S_L) = 1 - [(30/40)^2 + (10/40)^2] = 1 - [0.5625 + 0.0625] = 0.375",
          explanation: "Left child contains 75% positive and 25% negative samples.",
        },
        {
          title: "Compute Right Child Gini (N_R = 60)",
          calculation: "\\operatorname{Gini}(S_R) = 1 - [(10/60)^2 + (50/60)^2] = 1 - [0.0278 + 0.6944] = 0.2778",
          explanation: "Right child contains 16.7% positive and 83.3% negative samples.",
        },
        {
          title: "Compute Weighted Child Impurity",
          calculation: "\\operatorname{Gini}_{\\text{split}} = \\frac{40}{100}(0.375) + \\frac{60}{100}(0.2778) = 0.150 + 0.1667 = 0.3167",
          explanation: "Weighting each child node's impurity by its proportion of total samples.",
        },
        {
          title: "Calculate Information Gain",
          calculation: "\\operatorname{IG} = \\operatorname{Gini}(S) - \\operatorname{Gini}_{\\text{split}} = 0.480 - 0.3167 = 0.1633",
          explanation: "The split yields a 0.1633 reduction in impurity.",
        },
      ],
      result: "Information Gain = 0.1633 (a substantial increase in purity!)",
    },
    rfConnection:
      "Random Forest uses Decision Trees as its fundamental atomic building blocks. However, while individual trees are usually pruned to prevent overfitting, Random Forest intentionally grows fully deep, unpruned trees to minimize bias, relying on ensemble averaging to eradicate variance.",
    code: `from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_iris

# Load Iris dataset (3 classes, 4 features)
iris = load_iris()
X, y = iris.data, iris.target

# Fit a pruned decision tree to prevent overfitting
dt = DecisionTreeClassifier(criterion='gini', max_depth=3, min_samples_split=5, random_state=42)
dt.fit(X, y)

# Print human-readable decision tree rules
rules = export_text(dt, feature_names=list(iris.feature_names))
print("Decision Tree Rules:\\n", rules)
print(f"Training Accuracy: {dt.score(X, y):.4f}")`,
    codeExplanation:
      "DecisionTreeClassifier constructs a binary split tree. Setting max_depth=3 limits tree complexity, ensuring readable rule paths and bounding estimator variance.",
    application:
      "Hospital emergency room triage systems use decision trees to rapidly classify incoming chest-pain patients into high-risk cardiac arrest versus low-risk gastrointestinal categories in seconds.",
    mistakes: [
      "Believing a single decision tree is a stable model (trees have high variance; a tiny perturbation in training data can completely alter the root split).",
      "Confusing pre-pruning (max_depth, min_samples_leaf) with post-pruning (cost-complexity pruning via ccp_alpha).",
      "Assuming features must be scaled before tree construction (trees are invariant to monotonic feature scaling).",
    ],
    prosCons: {
      pros: [
        "Highly intuitive, transparent, and interpretable rule structure.",
        "Completely scale-invariant (requires no standardization or normalization).",
        "Naturally accommodates mixed continuous and categorical feature spaces.",
      ],
      cons: [
        "Extreme sensitivity to small variations in training data (high variance).",
        "Greedy splitting can lead to sub-optimal global decision partitions.",
        "Cannot extrapolate outside the domain of the training feature range.",
      ],
    },
    takeaways: [
      "CART trees recursively evaluate all feature thresholds to maximize Gini impurity reduction or variance reduction.",
      "Single decision trees have low bias when grown deep, but suffer from notoriously high variance.",
      "Feature scaling (e.g., StandardScaler) has zero effect on tree split decisions because splits rely strictly on rank order.",
    ],
    quiz: {
      prompt: "What is the numerical Gini impurity of a perfectly pure node containing 85 observations of Class 1 and 0 observations of any other class?",
      options: ["0.0", "0.5", "1.0", "0.85"],
      answerIndex: 0,
      explanation:
        "For a pure node, p_1 = 85/85 = 1.0. Therefore, Gini = 1 - (1.0)² = 0.0. A Gini impurity of 0 represents maximum possible purity.",
    },
  },

  "random-forest": {
    slug: "random-forest",
    module: "03",
    section: "Fundamentals",
    title: "Random Forest Architecture",
    intro:
      "Random Forest, introduced by Leo Breiman in 2001, is an ensemble learning method that constructs a collection of decorrelated decision trees using bootstrap sampling and random feature subspace selection, aggregating their individual predictions.",
    whyNecessary:
      "Standard bagging reduces variance only when base estimators are decorrelated. If a dataset contains a few dominant features, standard bagged trees will repeatedly split on those same features, resulting in highly correlated trees with minimal variance reduction. Random Forest solves this by injecting random feature subsampling at every split.",
    intuition:
      "Imagine hiring 100 financial analysts. If all 100 look at the exact same quarterly earnings report, they will arrive at nearly identical conclusions (high correlation). But if you give each analyst a different random sample of transactions AND force them to inspect different financial metrics at each step, their diverse perspectives produce a truly robust consensus.",
    theory: [
      "Breiman's Random Forest injects two distinct levels of randomness: (1) Observation-level randomness via Bootstrap Sampling (Bagging), and (2) Feature-level randomness via Random Subspace Selection at every single tree split.",
      "At each internal node, instead of scanning all p features for the best split threshold, the algorithm randomly samples a subset of m candidate features (typically m = ⌊√p⌋ for classification and m = ⌊p/3⌋ for regression).",
      "Only the randomly sampled m features are evaluated to determine the split. This guarantees that trees do not all choose the same dominant predictor at the root, drastically lowering pairwise tree correlation ρ.",
      "Predictions are aggregated across all B trees. Since the trees are grown deep without pruning, individual trees maintain low bias. The ensemble averaging shrinks the overall variance toward ρσ².",
    ],
    readTime: "20 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Candidate Feature Subspace Size",
        expr: "m = \\lfloor \\sqrt{p} \\rfloor \\quad (\\text{Classification}), \\qquad m = \\lfloor p/3 \\rfloor \\quad (\\text{Regression})",
        note: "p is the total number of features in the dataset. Controlled by max_features in Scikit-Learn.",
      },
      {
        label: "Forest Prediction Aggregation (Regression)",
        expr: "\\hat{f}_{\\text{rf}}(x) = \\frac{1}{B} \\sum_{b=1}^{B} T_b(x; \\Theta_b)",
        note: "Θ_b represents the random parameter vector governing bootstrap sample and split feature choices for tree b.",
      },
      {
        label: "Ensemble Variance as a Function of Correlation",
        expr: "\\operatorname{Var}(\\hat{f}_{\\text{rf}}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2",
        note: "ρ is the average pairwise correlation between trees; σ² is individual tree variance.",
      },
    ],
    derivation: {
      title: "Ensemble Variance with Correlated Estimators",
      description: "Mathematical proof that lower tree correlation directly reduces ensemble variance.",
      steps: [
        {
          step: "Define the ensemble estimator as the sample mean of B trees",
          math: "\\bar{T}(x) = \\frac{1}{B} \\sum_{b=1}^B T_b(x), \\quad \\operatorname{Var}(T_b) = \\sigma^2",
          note: "Each tree is identically distributed with variance σ² and pairwise correlation Cov(T_i, T_j) = ρσ² for i ≠ j.",
        },
        {
          step: "Expand the variance of the sum",
          math: "\\operatorname{Var}\\left(\\frac{1}{B} \\sum_{b=1}^B T_b\\right) = \\frac{1}{B^2} \\left[ \\sum_{b=1}^B \\operatorname{Var}(T_b) + \\sum_{i \\ne j} \\operatorname{Cov}(T_i, T_j) \\right]",
          note: "There are B variance terms and B(B - 1) covariance terms.",
        },
        {
          step: "Substitute σ² and ρσ² into the expansion",
          math: "\\operatorname{Var}(\\bar{T}) = \\frac{1}{B^2} [ B\\sigma^2 + B(B - 1)\\rho\\sigma^2 ] = \\frac{\\sigma^2}{B} + \\frac{B - 1}{B} \\rho\\sigma^2",
          note: "Factor out σ² to group terms.",
        },
        {
          step: "Rearrange into standard Breiman-Hastie form",
          math: "\\operatorname{Var}(\\bar{T}) = \\rho\\sigma^2 + \\frac{1 - \\rho}{B}\\sigma^2",
          note: "As B → ∞, the second term vanishes, leaving ρσ². Hence, the minimum achievable variance is bounded by the pairwise correlation ρ!",
        },
      ],
    },
    workedExample: {
      title: "Impact of Random Feature Selection on Ensemble Variance",
      problem:
        "Suppose an individual unpruned decision tree has prediction variance σ² = 100. When trained with standard Bagging (all features available), trees have correlation ρ = 0.50. With Random Forest feature subsampling (m = √p), correlation drops to ρ = 0.20. Compare ensemble variance for B = 100 trees.",
      steps: [
        {
          title: "Calculate Standard Bagging Variance (ρ = 0.50, B = 100)",
          calculation: "\\operatorname{Var}_{\\text{bag}} = (0.50)(100) + \\frac{1 - 0.50}{100}(100) = 50 + 0.50 = 50.50",
          explanation: "Standard bagging variance is heavily bounded by the high correlation floor (50.0).",
        },
        {
          title: "Calculate Random Forest Variance (ρ = 0.20, B = 100)",
          calculation: "\\operatorname{Var}_{\\text{rf}} = (0.20)(100) + \\frac{1 - 0.20}{100}(100) = 20 + 0.80 = 20.80",
          explanation: "Random Forest decorrelation lowers the variance floor to 20.0.",
        },
        {
          title: "Compare variance reduction ratio",
          calculation: "\\frac{50.50 - 20.80}{50.50} \\times 100 = 58.81\\%",
          explanation: "Random feature subsampling eliminated nearly 59% of the remaining prediction variance!",
        },
      ],
      result: "Random Forest achieves 20.80 variance vs 50.50 for Bagging (58.8% lower variance)!",
    },
    rfConnection:
      "This architecture is the foundational definition of Random Forest. The dual mechanism of row bootstrapping and column subsampling transforms erratic decision trees into one of the most reliable and competitive algorithms in machine learning history.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score

# Create classification task with 30 features
X, y = make_classification(n_samples=1200, n_features=30, n_informative=15, random_state=42)

# Build a Random Forest with 100 trees and sqrt(30) features per split
rf = RandomForestClassifier(
    n_estimators=100,
    max_features='sqrt',  # m = floor(sqrt(30)) = 5 candidate features per split
    bootstrap=True,       # Enable row resampling with replacement
    oob_score=True,       # Out-of-Bag validation
    n_jobs=-1,            # Parallelize across all CPU cores
    random_state=42
)

rf.fit(X, y)
print(f"OOB Accuracy Score: {rf.oob_score_:.4f}")
print(f"Number of Features Evaluated per Split: {rf.max_features_}")`,
    codeExplanation:
      "RandomForestClassifier defaults to max_features='sqrt' for classification. Setting n_jobs=-1 distributes tree construction in parallel across all available CPU threads with zero IPC overhead.",
    application:
      "Microsoft Kinect depth cameras utilized Random Forest ensembles running in parallel on embedded chips to perform real-time pixel-level human body part segmentation in 30 frames per second.",
    mistakes: [
      "Assuming max_features controls the total number of features passed to each tree (it controls features evaluated at each split node within the tree).",
      "Believing adding more trees (e.g. 1000 instead of 100) can cause the forest to overfit (adding trees only decreases variance; it never increases variance).",
      "Thinking Random Forest requires categorical feature encoding when using custom libraries (Scikit-Learn requires numerical encoding, but algorithmic trees natively handle categories).",
    ],
    prosCons: {
      pros: [
        "Unrivaled out-of-the-box performance on tabular datasets.",
        "Built-in out-of-bag validation without requiring explicit cross-validation sets.",
        "High resistance to overfitting even with large tree counts.",
      ],
      cons: [
        "Black-box nature compared to a single decision tree.",
        "Slow prediction latency when querying thousands of trees in real-time low-latency APIs.",
        "Cannot extrapolate values beyond the minimum/maximum bounds seen in training data.",
      ],
    },
    takeaways: [
      "Random Forest injects two levels of randomness: bootstrap row selection and random feature column selection.",
      "The random feature subset size m = √p decorrelates trees, lowering pairwise correlation ρ and reducing total ensemble variance.",
      "Random Forests do not overfit when increasing n_estimators; adding trees stabilizes predictions toward the expected ensemble mean.",
    ],
    quiz: {
      prompt: "What does the hyperparameter max_features specifically control in a Scikit-Learn Random Forest?",
      options: [
        "The number of features randomly chosen to evaluate at each candidate split node",
        "The total number of columns provided in the training matrix X",
        "The maximum depth to which each individual tree is allowed to expand",
        "The maximum number of trees constructed in the forest",
      ],
      answerIndex: 0,
      explanation:
        "max_features specifies the size of the random candidate subset of features considered whenever finding the best split at any node within any tree. It is evaluated afresh at every single split.",
    },
  },

  "bootstrap-sampling": {
    slug: "bootstrap-sampling",
    module: "04",
    section: "Fundamentals",
    title: "Bootstrap Sampling",
    intro:
      "Bootstrap sampling is a fundamental statistical resampling technique introduced by Bradley Efron in 1979, where samples of size N are drawn uniformly at random with replacement from an original dataset of size N.",
    whyNecessary:
      "In classical statistics, estimating estimator variance or confidence intervals would require drawing repeated independent datasets from the true population distribution—an impossible feat in practice. Bootstrapping allows us to approximate population sampling using the empirical distribution of a single training dataset.",
    intuition:
      "Imagine an urn holding 100 numbered balls. You reach in, pull out ball #42, write '42' on a notepad, and DROP BALL #42 BACK INTO THE URN before pulling the next ball. Because the ball is returned, some numbers appear multiple times, while others are never drawn at all.",
    theory: [
      "Let D = {z_1, z_2, ..., z_N} be a training dataset of N observations. A bootstrap sample D* is constructed by sampling N times with replacement from D.",
      "Because sampling is with replacement, the probability that any specific observation z_i is NOT chosen in a single draw is (1 - 1/N).",
      "Across all N independent draws, the probability that an observation is completely omitted from the bootstrap sample is P(z_i ∉ D*) = (1 - 1/N)^N.",
      "In the limit as N approaches infinity, this probability converges analytically to e⁻¹ ≈ 0.3679. Therefore, approximately 63.2% of the original observations appear at least once in each bootstrap sample, while 36.8% form the Out-of-Bag (OOB) set.",
    ],
    readTime: "14 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Probability of Omission (Single Draw)",
        expr: "P(\\text{Not Chosen in Draw } 1) = 1 - \\frac{1}{N}",
        note: "Each of the N observations has an equal 1/N probability of being drawn.",
      },
      {
        label: "Probability of Being Out-of-Bag (N Draws)",
        expr: "P(\\text{OOB}) = \\left(1 - \\frac{1}{N}\\right)^N \\xrightarrow{N \\to \\infty} e^{-1} \\approx 0.367879",
        note: "Fundamental limit based on Euler's constant e.",
      },
      {
        label: "Expected Unique Observations",
        expr: "E[\\text{Unique Rows}] = N \\left[1 - \\left(1 - \\frac{1}{N}\\right)^N\\right] \\approx 0.632121 \\times N",
        note: "Approximately 63.2% of the training dataset is represented in each tree.",
      },
    ],
    derivation: {
      title: "Derivation of the 63.2% Bootstrap Inclusion Law",
      description: "Mathematical proof of the asymptotic Out-of-Bag probability using calculus limits.",
      steps: [
        {
          step: "Define probability of selecting a particular row in one draw",
          math: "P(\\text{Selected}) = \\frac{1}{N} \\implies P(\\text{Not Selected}) = 1 - \\frac{1}{N}",
          note: "Uniform sampling with replacement ensures independent and identical trials.",
        },
        {
          step: "Compute probability of not being selected in all N draws",
          math: "P(\\text{OOB}) = \\prod_{k=1}^N \\left(1 - \\frac{1}{N}\\right) = \\left(1 - \\frac{1}{N}\\right)^N",
          note: "Because draws are independent with replacement.",
        },
        {
          step: "Evaluate the limit as dataset size N approaches infinity",
          math: "\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = \\lim_{N \\to \\infty} \\left(1 + \\frac{-1}{N}\\right)^N = e^{-1} = \\frac{1}{e}",
          note: "By the standard definition of the exponential function: lim (1 + x/N)^N = e^x with x = -1.",
        },
        {
          step: "Calculate numerical percentage",
          math: "P(\\text{OOB}) = \\frac{1}{2.71828...} \\approx 0.367879 \\approx 36.8\\%",
          note: "Complement probability of being included at least once: 1 - 0.367879 = 0.632121 (63.2%).",
        },
      ],
    },
    workedExample: {
      title: "Empirical vs Asymptotic OOB Verification for Small and Large N",
      problem:
        "Calculate the exact theoretical probability of an observation being Out-of-Bag for: (A) a small dataset of N = 5 samples, and (B) a production dataset of N = 10,000 samples.",
      steps: [
        {
          title: "Compute for N = 5",
          calculation: "P(\\text{OOB}_{N=5}) = \\left(1 - \\frac{1}{5}\\right)^5 = (0.80)^5 = 0.32768",
          explanation: "For small N = 5, exactly 32.77% are OOB and 67.23% are selected.",
        },
        {
          title: "Compute for N = 10",
          calculation: "P(\\text{OOB}_{N=10}) = \\left(1 - \\frac{1}{10}\\right)^{10} = (0.90)^{10} = 0.34868",
          explanation: "At N = 10, probability is already close to 35%.",
        },
        {
          title: "Compute for N = 10,000",
          calculation: "P(\\text{OOB}_{N=10000}) = \\left(1 - \\frac{1}{10000}\\right)^{10000} = (0.9999)^{10000} \\approx 0.367861",
          explanation: "Virtually indistinguishable from theoretical e⁻¹ = 0.367879.",
        },
      ],
      result: "Demonstrates rapid convergence: by N = 100, P(OOB) is already within 0.001 of 36.8%!",
    },
    rfConnection:
      "Bootstrap sampling provides Random Forest with diverse training sets from a single fixed corpus. Crucially, the 36.8% unselected Out-of-Bag rows serve as a built-in validation partition for every tree, eliminating the need for separate validation sets.",
    code: `import numpy as np

# Simulate bootstrap sampling on N = 10,000 observations
np.random.seed(42)
N = 10000
original_indices = np.arange(N)

# Draw N samples with replacement
bootstrap_sample = np.random.choice(original_indices, size=N, replace=True)

unique_count = len(np.unique(bootstrap_sample))
oob_count = N - unique_count

print(f"Original Dataset Size : {N}")
print(f"Unique Samples Chosen : {unique_count} ({unique_count / N * 100:.2f}%)")
print(f"Out-of-Bag Samples   : {oob_count} ({oob_count / N * 100:.2f}%)")
print(f"Theoretical e^-1     : {np.exp(-1) * 100:.2f}%")`,
    codeExplanation:
      "np.random.choice with replace=True implements true bootstrap sampling. Measuring np.unique confirms the theoretical 63.2% inclusion rate.",
    application:
      "Clinical genomics studies with small patient cohort sizes (N = 50) use bootstrap resampling to assess the stability and confidence intervals of diagnostic biomarker discovery models.",
    mistakes: [
      "Sampling WITHOUT replacement (that produces the exact same dataset shuffled, offering zero bootstrap diversity).",
      "Believing bootstrap samples contain less data than the original (it contains the exact same number of rows N, but with duplicate frequencies).",
      "Evaluating training metrics on the bootstrap sample instead of the Out-of-Bag rows.",
    ],
    prosCons: {
      pros: [
        "Generates pseudo-independent datasets from a single fixed data corpus.",
        "Produces an innate validation dataset (Out-of-Bag) for free.",
        "Enables robust non-parametric statistical confidence interval estimation.",
      ],
      cons: [
        "Individual bootstrap samples omit ~36.8% of available data points.",
        "Can slightly worsen class imbalance if rare positive instances are missed in a sample.",
        "Duplicates can mask duplicates or duplicate outliers.",
      ],
    },
    takeaways: [
      "Bootstrap sampling draws N items from N with replacement.",
      "Asymptotically, (1 - 1/N)^N converges to 1/e ≈ 36.8% Out-of-Bag observations.",
      "Approximately 63.2% of available rows populate any given bootstrap sample.",
    ],
    quiz: {
      prompt: "What mathematical constant directly governs the percentage of observations excluded from a large bootstrap sample?",
      options: [
        "Euler's constant e (as e⁻¹ ≈ 36.8%)",
        "Pi (π/4 ≈ 78.5%)",
        "The golden ratio φ ≈ 61.8%",
        "Natural logarithm of 2 ≈ 69.3%",
      ],
      answerIndex: 0,
      explanation:
        "The limit of (1 - 1/N)^N as N → ∞ is e⁻¹ = 1/e ≈ 0.367879. Hence Euler's constant e mathematically determines the 36.8% OOB rate.",
    },
  },

  "bagging": {
    slug: "bagging",
    module: "05",
    section: "Fundamentals",
    title: "Bagging (Bootstrap Aggregation)",
    intro:
      "Bagging, short for Bootstrap Aggregating, was introduced by Leo Breiman in 1996. It creates an ensemble by training multiple base models on independent bootstrap samples of the training data and combining their predictions via voting or averaging.",
    whyNecessary:
      "High-capacity learning algorithms like deep decision trees or neural networks are unstable: small changes in training data produce dramatically different decision surfaces (high variance). Bagging dampens this instability, reducing prediction variance without inflating bias.",
    intuition:
      "Think of taking multiple independent photographs of a fast-moving object under noisy light. Any single photograph might suffer from blur or grain, but stacking and averaging 100 aligned exposures cancels out sensor noise, leaving a crystal-clear image.",
    theory: [
      "Suppose we have an ideal set of B independent training datasets drawn from a true distribution P. If we trained a model f̂_b on each and averaged them, the expected prediction would match any individual model, but its variance would be reduced by a factor of 1/B.",
      "Because we only have a single dataset D, Bagging approximates this ideal by drawing B bootstrap samples D*¹ ... D*ᴮ with replacement.",
      "Bagging is effective specifically for unstable learners (models with high variance and low bias). For stable learners (e.g., linear regression or k-nearest neighbors with large k), bagging provides negligible variance reduction and can slightly degrade performance.",
      "Random Forest is an extension of Bagging: while pure Bagging considers all p features at every split, Random Forest additionally subsamples features at every split to decorrelate the trees.",
    ],
    readTime: "12 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Bagged Estimator (Regression)",
        expr: "\\hat{f}_{\\text{bag}}(x) = \\frac{1}{B} \\sum_{b=1}^{B} \\hat{f}^{*b}(x)",
        note: "f̂*ᵇ(x) is the base model trained on the b-th bootstrap dataset D*ᵇ.",
      },
      {
        label: "Bagged Estimator (Classification)",
        expr: "\\hat{y}_{\\text{bag}}(x) = \\operatorname{argmax}_{c} \\sum_{b=1}^{B} \\mathbb{I}(\\hat{f}^{*b}(x) = c)",
        note: "Plurality vote across all B bagged classifiers.",
      },
      {
        label: "Theoretical Variance Reduction (Independent Estimators)",
        expr: "\\operatorname{Var}(\\hat{f}_{\\text{bag}}) = \\frac{1}{B} \\operatorname{Var}(\\hat{f})",
        note: "Valid under the ideal assumption that bootstrap models are completely independent (Cov = 0).",
      },
    ],
    derivation: {
      title: "Variance Reduction in Ideal Bagging",
      description: "Mathematical proof that averaging independent estimators reduces variance by 1/B.",
      steps: [
        {
          step: "Assume B independent estimators with variance σ²",
          math: "f_1(x), f_2(x), \\dots, f_B(x) \\quad \\text{with} \\quad \\operatorname{Var}(f_b(x)) = \\sigma^2, \\quad \\operatorname{Cov}(f_i, f_j) = 0",
          note: "Each estimator has identical bias and variance.",
        },
        {
          step: "Express the variance of the average",
          math: "\\operatorname{Var}\\left(\\frac{1}{B} \\sum_{b=1}^B f_b(x)\\right) = \\frac{1}{B^2} \\sum_{b=1}^B \\operatorname{Var}(f_b(x))",
          note: "Linearity of variance for independent random variables (zero cross-covariance terms).",
        },
        {
          step: "Simplify the summation",
          math: "\\operatorname{Var}(\\bar{f}(x)) = \\frac{1}{B^2} (B \\sigma^2) = \\frac{\\sigma^2}{B}",
          note: "The variance drops inversely proportional to the number of estimators B!",
        },
      ],
    },
    workedExample: {
      title: "Bagging Variance Reduction with Real-World Non-Zero Correlation",
      problem:
        "In reality, bootstrap samples share ~63.2% of data, so estimators are correlated (ρ = 0.25). If individual tree variance is σ² = 80, calculate the bagged variance for B = 5, B = 50, and B = 500 trees.",
      steps: [
        {
          title: "Formula: Var = ρσ² + (1 - ρ)σ² / B",
          calculation: "\\operatorname{Var} = (0.25)(80) + \\frac{(0.75)(80)}{B} = 20 + \\frac{60}{B}",
          explanation: "Baseline correlation floor is 20.0.",
        },
        {
          title: "For B = 5 trees",
          calculation: "\\operatorname{Var}_{B=5} = 20 + \\frac{60}{5} = 20 + 12 = 32.0",
          explanation: "A 60% reduction from the initial single-tree variance of 80.",
        },
        {
          title: "For B = 50 trees",
          calculation: "\\operatorname{Var}_{B=50} = 20 + \\frac{60}{50} = 20 + 1.2 = 21.2",
          explanation: "Very close to the theoretical correlation floor.",
        },
        {
          title: "For B = 500 trees",
          calculation: "\\operatorname{Var}_{B=500} = 20 + \\frac{60}{500} = 20 + 0.12 = 20.12",
          explanation: "Diminishing returns: increasing trees from 50 to 500 only saves an additional 1.08 variance.",
        },
      ],
      result: "Demonstrates that B = 100 to 200 trees captures almost all available bagging variance reduction.",
    },
    rfConnection:
      "Random Forest is an algorithmic advancement of Bagging. Pure Bagging uses all features at every split. Random Forest uses Bagging PLUS random feature subspace sampling, which drives the correlation ρ even lower, achieving superior variance reduction.",
    code: `from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

X, y = load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Single Decision Tree baseline
tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train, y_train)

# Bagged Decision Trees (Pure Bagging: max_features=1.0)
bag = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100,
    max_samples=1.0,   # Bootstrap sample size N
    max_features=1.0,  # Pure bagging: all features considered
    bootstrap=True,
    random_state=42
)
bag.fit(X_train, y_train)

print(f"Single Tree Test Accuracy : {tree.score(X_test, y_test):.4f}")
print(f"Bagged Forest Test Accuracy: {bag.score(X_test, y_test):.4f}")`,
    codeExplanation:
      "BaggingClassifier allows wrapping any arbitrary Scikit-Learn estimator. Here, wrapping DecisionTreeClassifier with max_features=1.0 performs classical Breiman (1996) Bagging.",
    application:
      "Supply chain logistics providers bag neural networks to forecast product demand across regional fulfillment hubs, smoothing out unexpected spike noise in historical purchase logs.",
    mistakes: [
      "Applying bagging to linear regression (linear regression is a low-variance, stable estimator; bagging yields virtually zero improvement).",
      "Confusing Bagging with Boosting (Bagging trains models in parallel independently; Boosting trains models sequentially on previous residuals).",
      "Stopping at B = 10 trees when the variance curve typically requires B = 100 to reach the asymptotic floor.",
    ],
    prosCons: {
      pros: [
        "Directly slashes variance for unstable, high-capacity models.",
        "Embarrassingly parallel: all B models can be trained concurrently across multiple nodes.",
        "Does not increase bias while decreasing variance.",
      ],
      cons: [
        "Cannot fix models with high bias (underfitting).",
        "Higher memory and latency requirements at inference time.",
        "Less effective than Random Forest when a single feature dominates the data.",
      ],
    },
    takeaways: [
      "Bagging combines Bootstrap Sampling with model Aggregation.",
      "Bagging targets and reduces variance, leaving model bias largely unaffected.",
      "Base estimators must be unstable (high variance) for bagging to produce significant accuracy gains.",
    ],
    quiz: {
      prompt: "For which type of machine learning model is Bagging MOST effective at improving test performance?",
      options: [
        "High-variance, low-bias models (e.g., deep unpruned decision trees)",
        "High-bias, low-variance models (e.g., simple linear regression)",
        "Zero-variance constant predictors",
        "K-Nearest Neighbors with k equal to the total dataset size",
      ],
      answerIndex: 0,
      explanation:
        "Bagging's primary mathematical mechanism is variance reduction through averaging. Therefore, it provides massive gains for high-variance models (like deep trees) and virtually zero benefit for rigid, low-variance models.",
    },
  },

  "classification": {
    slug: "classification",
    module: "06",
    section: "Core Concepts",
    title: "Random Forest Classification",
    intro:
      "Random Forest Classification aggregates the predictions of hundreds of individual decision trees to predict discrete class labels, combining discrete majority voting and continuous class probability estimation.",
    whyNecessary:
      "Single classification trees produce rigid, jagged decision boundaries with extreme sensitivity to sample outliers. Random Forest averages these discontinuous boundaries into smooth, continuous, probabilistic decision manifolds.",
    intuition:
      "Imagine a medical board of 100 doctors reviewing an MRI scan. If 85 doctors diagnose a benign cyst and 15 diagnose a malignant tumor, the board not only concludes 'Benign' (majority vote), but also provides an 85% confidence score.",
    theory: [
      "Hard Voting (Plurality Voting) tallies the discrete class prediction of each tree T_b(x) and assigns the final label to the class receiving the mode count.",
      "Soft Voting (Probability Averaging) averages the predicted class probability vectors output by each tree's leaf node. The final class is the one with the highest mean probability.",
      "In Scikit-Learn, RandomForestClassifier uses soft voting by default when calling predict_proba(), and assigns predict() based on the argmax of those aggregated probabilities.",
      "For multi-class classification with K classes, the ensemble generates a K-dimensional probability simplex vector where ∑ P(y=k|x) = 1.0.",
    ],
    readTime: "15 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Hard Voting Rule",
        expr: "\\hat{y}_{\\text{hard}}(x) = \\operatorname{mode}\\{T_1(x), T_2(x), \\dots, T_B(x)\\}",
        note: "Class with the maximum discrete tree vote count.",
      },
      {
        label: "Soft Probability Aggregation",
        expr: "P(y = c \\mid x) = \\frac{1}{B} \\sum_{b=1}^{B} P_b(y = c \\mid x)",
        note: "P_b(y=c|x) is the proportion of class c samples in the leaf of tree b.",
      },
      {
        label: "Final Soft Classification Decision",
        expr: "\\hat{y}_{\\text{soft}}(x) = \\operatorname{argmax}_{c \\in \\{1, \\dots, K\\}} P(y = c \\mid x)",
        note: "Assigns the class with the highest average probability.",
      },
    ],
    workedExample: {
      title: "Hard Voting vs Soft Voting Discrepancy",
      problem:
        "An ensemble of B = 3 trees evaluates a binary test instance. Tree 1 predicts Class 1 with 95% probability. Tree 2 predicts Class 0 with 52% probability. Tree 3 predicts Class 0 with 51% probability. Compare Hard Voting vs Soft Voting outcomes.",
      steps: [
        {
          title: "Determine individual hard predictions",
          calculation: "T_1: \\text{Class 1 (95\\%)}, \\quad T_2: \\text{Class 0 (52\\%)}, \\quad T_3: \\text{Class 0 (51\\%)}",
          explanation: "Trees 2 and 3 barely vote for Class 0; Tree 1 strongly votes for Class 1.",
        },
        {
          title: "Evaluate Hard Voting Mode",
          calculation: "\\operatorname{Votes} = \\{ \\text{Class 0}: 2, \\; \\text{Class 1}: 1 \\} \\implies \\hat{y}_{\\text{hard}} = \\text{Class 0}",
          explanation: "Class 0 wins the raw democratic vote (2 to 1).",
        },
        {
          title: "Evaluate Soft Voting Probability Averaging",
          calculation: "P(y=1) = \\frac{0.95 + 0.48 + 0.49}{3} = \\frac{1.92}{3} = 0.640 \\; (64.0\\%)",
          explanation: "Average probability for Class 1 across all 3 trees.",
        },
        {
          title: "Calculate Class 0 Probability",
          calculation: "P(y=0) = 1.0 - 0.640 = 0.360 \\; (36.0\\%) \\implies \\hat{y}_{\\text{soft}} = \\text{Class 1}",
          explanation: "Class 1 wins because Tree 1 was exceptionally confident, while Trees 2 & 3 were uncertain.",
        },
      ],
      result: "Hard vote predicts Class 0, while Soft vote predicts Class 1 (Soft voting captures certainty!)",
    },
    rfConnection:
      "RandomForestClassifier implements this exact probabilistic aggregation. Soft voting generally yields superior calibration and ROC-AUC scores because it accounts for individual tree confidence rather than flattening predictions into binary tallies.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split

# Load binary classification dataset
X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# Build Random Forest Classifier
clf = RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42)
clf.fit(X_train, y_train)

# Predict probabilities and discrete classes
y_probs = clf.predict_proba(X_test)[:, 1]
y_pred = clf.predict(X_test)

print(f"ROC-AUC Score: {roc_auc_score(y_test, y_probs):.4f}")
print("\\nClassification Report:\\n", classification_report(y_test, y_pred))`,
    codeExplanation:
      "predict_proba() returns probabilities for both classes. Taking column [:, 1] gives the estimated likelihood of the positive class for calculating ROC-AUC.",
    application:
      "E-commerce payment gateways use Random Forest classifiers to score the probability that a credit card transaction is fraudulent within 50 milliseconds of checkout.",
    mistakes: [
      "Using a default 0.5 decision threshold on severely imbalanced datasets (e.g. 99:1 fraud).",
      "Assuming Scikit-Learn's predict() uses hard voting (it computes argmax over averaged probabilities).",
      "Ignoring the difference between accuracy and ROC-AUC / PR-AUC when evaluating performance.",
    ],
    prosCons: {
      pros: [
        "Produces reliable continuous class probabilities.",
        "Smooths out jagged decision boundaries inherent to single decision trees.",
        "Handles multi-class classification natively without One-vs-Rest wrappers.",
      ],
      cons: [
        "Tree probabilities are stepped and not perfectly calibrated (Platt scaling may be needed).",
        "Higher memory consumption for multi-class problems with many classes.",
        "Sensitive to extreme class imbalance unless class_weight is adjusted.",
      ],
    },
    takeaways: [
      "Hard voting counts discrete votes; soft voting averages leaf class probability distributions.",
      "Soft voting is generally preferred because it weights confident tree predictions more heavily.",
      "Random Forest decision boundaries are piecewise constant but approximate smooth curves as tree count grows.",
    ],
    quiz: {
      prompt: "How does Scikit-Learn's RandomForestClassifier compute the output of predict_proba(X)?",
      options: [
        "By averaging the class probability distributions of all individual trees in the forest",
        "By taking the discrete majority vote and assigning 1.0 or 0.0",
        "By fitting a logistic regression meta-model on top of the trees",
        "By selecting the single most accurate tree's probability",
      ],
      answerIndex: 0,
      explanation:
        "RandomForestClassifier averages the empirical class proportions from the terminating leaf node across all B trees, yielding the ensemble's soft predicted class probabilities.",
    },
  },

  "regression": {
    slug: "regression",
    module: "07",
    section: "Core Concepts",
    title: "Random Forest Regression",
    intro:
      "Random Forest Regression aggregates the predictions of multiple regression trees by computing the arithmetic mean of continuous leaf outputs, capturing non-linear relationships without parametric assumptions.",
    whyNecessary:
      "Standard linear regression assumes a linear relationship between features and targets. Individual decision trees model non-linear steps but suffer from high prediction variance. Random Forest regression smooths the step functions into an accurate, non-linear regression surface.",
    intuition:
      "Imagine appraising a house. One real estate agent checks square footage, another compares neighborhood school ratings, and a third inspects recent local sales. Averaging their independent valuation figures cancels out individual pricing biases.",
    theory: [
      "Regression trees recursively partition continuous feature spaces to minimize Mean Squared Error (MSE) or Mean Absolute Error (MAE) at each split.",
      "In any terminating leaf node L, the predicted value is the empirical mean of all training target values falling into that partition: ŷ_leaf = (1/|L|) ∑ y_i.",
      "The Random Forest regressor combines B regression trees by calculating their unweighted arithmetic mean: ŷ(x) = (1/B) ∑ T_b(x).",
      "Extrapolation Limitation: Because every tree prediction is a weighted average of training target values, a tree-based ensemble CANNOT predict values strictly higher than the maximum training target or strictly lower than the minimum training target.",
    ],
    readTime: "15 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Ensemble Continuous Prediction",
        expr: "\\hat{y}(x) = \\frac{1}{B} \\sum_{b=1}^{B} T_b(x)",
        note: "Arithmetic average of B continuous regression tree predictions.",
      },
      {
        label: "Regression Tree Split Objective (Variance Reduction)",
        expr: "\\Delta \\operatorname{Var} = \\operatorname{MSE}(S) - \\left( \\frac{|S_L|}{|S|} \\operatorname{MSE}(S_L) + \\frac{|S_R|}{|S|} \\operatorname{MSE}(S_R) \\right)",
        note: "Greedy criterion to choose the split threshold that maximizes reduction in mean squared error.",
      },
      {
        label: "Leaf Prediction Formulation",
        expr: "\\hat{c}_{\\text{leaf}} = \\frac{1}{|S_{\\text{leaf}}|} \\sum_{i \\in S_{\\text{leaf}}} y_i",
        note: "Optimal constant prediction minimizing MSE within a partition.",
      },
    ],
    workedExample: {
      title: "Regression Split Optimization and Averaging",
      problem:
        "A node S contains 4 target values: {10, 14, 18, 22}. Compare parent MSE with a split partitioning the values into Left {10, 14} and Right {18, 22}.",
      steps: [
        {
          title: "Compute Parent Mean and MSE",
          calculation: "\\bar{y}_S = \\frac{10+14+18+22}{4} = 16.0, \\quad \\operatorname{MSE}(S) = \\frac{(-6)^2 + (-2)^2 + 2^2 + 6^2}{4} = \\frac{80}{4} = 20.0",
          explanation: "Parent variance is 20.0.",
        },
        {
          title: "Compute Left Child MSE ({10, 14})",
          calculation: "\\bar{y}_L = 12.0, \\quad \\operatorname{MSE}(S_L) = \\frac{(-2)^2 + 2^2}{2} = 4.0",
          explanation: "Left child variance is 4.0.",
        },
        {
          title: "Compute Right Child MSE ({18, 22})",
          calculation: "\\bar{y}_R = 20.0, \\quad \\operatorname{MSE}(S_R) = \\frac{(-2)^2 + 2^2}{2} = 4.0",
          explanation: "Right child variance is 4.0.",
        },
        {
          title: "Compute Weighted Split MSE and Variance Reduction",
          calculation: "\\operatorname{MSE}_{\\text{split}} = 0.5(4.0) + 0.5(4.0) = 4.0 \\implies \\Delta \\operatorname{Var} = 20.0 - 4.0 = 16.0",
          explanation: "The split eliminates 80% of the target variance!",
        },
      ],
      result: "Variance reduction = 16.0. Leaf predictions are 12.0 (Left) and 20.0 (Right).",
    },
    rfConnection:
      "RandomForestRegressor executes this split logic across all trees. Its continuous output is the smoothed average across all trees, eliminating the harsh stepwise plateaus characteristic of a single regression tree.",
    code: `from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import fetch_california_housing
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import numpy as np

# Load regression dataset
X, y = fetch_california_housing(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X[:3000], y[:3000], test_size=0.25, random_state=42)

# Fit Random Forest Regressor
rf_reg = RandomForestRegressor(n_estimators=100, max_features=0.5, random_state=42)
rf_reg.fit(X_train, y_train)

preds = rf_reg.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, preds))
r2 = r2_score(y_test, preds)

print(f"Test RMSE : {rmse:.4f}")
print(f"Test R^2  : {r2:.4f}")`,
    codeExplanation:
      "RandomForestRegressor averages continuous predictions. Setting max_features=0.5 evaluates half the features at each split, offering strong decorrelation for regression.",
    application:
      "Real estate pricing platforms use Random Forest regressors to estimate property market values based on square footage, zip code, bedrooms, and recent neighborhood transactions.",
    mistakes: [
      "Expecting Random Forest to extrapolate temporal growth trends (e.g., predicting future stock prices higher than any historical price; trees cannot extrapolate).",
      "Evaluating regression models using classification metrics like accuracy.",
      "Ignoring outlier targets (squared error loss heavily penalizes extreme outliers; consider criterion='absolute_error' if outliers are noisy).",
    ],
    prosCons: {
      pros: [
        "Captures complex non-linear relationships without manual feature transformation.",
        "Robust to feature scaling and outliers in input features.",
        "Provides accurate, smooth continuous response surfaces.",
      ],
      cons: [
        "Strictly unable to extrapolate beyond the range of training target values.",
        "Can be computationally slow to evaluate for deep forests with high estimator counts.",
        "Biased toward the mean in regions with sparse training observations.",
      ],
    },
    takeaways: [
      "Random Forest Regressor aggregates tree outputs via arithmetic mean averaging.",
      "Splits are chosen to maximize variance reduction (MSE reduction).",
      "Tree ensembles cannot extrapolate beyond the minimum and maximum target values observed during training.",
    ],
    quiz: {
      prompt: "Why can Random Forest regressors NOT extrapolate continuous trends (e.g. predicting future inflation higher than historical records)?",
      options: [
        "Because leaf predictions are bounded bounded averages of training set targets",
        "Because decision trees can only output binary numbers 0 and 1",
        "Because random sampling permanently deletes negative target numbers",
        "Because Scikit-Learn explicitly clips all predictions to zero",
      ],
      answerIndex: 0,
      explanation:
        "Every leaf node in a decision tree outputs the empirical mean of the training samples that landed in that leaf. No matter how extreme the test input x is, it will terminate in one of these leaves, bounding predictions strictly within the training target range [min(y_train), max(y_train)].",
    },
  },

  "bias-variance": {
    slug: "bias-variance",
    module: "08",
    section: "Core Concepts",
    title: "Bias-Variance Tradeoff",
    intro:
      "The Bias-Variance Tradeoff is the central theoretical framework in machine learning that decomposes expected generalization error into three fundamental components: squared bias, variance, and irreducible environmental noise.",
    whyNecessary:
      "Understanding this tradeoff explains why Random Forest works so extraordinarily well: an individual unpruned decision tree has near-zero bias but massive variance. Random Forest preserves the low bias while mathematically driving the variance down through ensemble averaging.",
    intuition:
      "Consider archery. High Bias means your arrows consistently group tightly in the wrong corner of the target (systematic error). High Variance means your arrows scatter wildly all over the target (instability). The goal is low bias AND low variance: arrows tightly clustered in the bullseye.",
    theory: [
      "For a true data-generating process Y = f(X) + ε with noise variance Var(ε) = σ²_ε, the expected mean squared error of an estimator f̂(X) decomposes as: E[(Y - f̂(X))²] = Bias(f̂(X))² + Var(f̂(X)) + σ²_ε.",
      "Bias² quantifies the systematic error introduced by approximating a complex real-world phenomenon with a simplified model algorithm.",
      "Variance quantifies how much the learned model f̂(X) fluctuates when trained on a different random dataset from the same underlying distribution.",
      "For an ensemble of B estimators, each with variance σ² and average pairwise correlation ρ, the ensemble variance is: Var(Ensemble) = ρσ² + ((1 - ρ)/B)σ².",
      "As B → ∞, the second term approaches zero, but the variance is strictly bounded from below by ρσ². To minimize ensemble variance, we must minimize tree correlation ρ via random feature subsampling!",
    ],
    readTime: "16 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "Bias-Variance-Noise Decomposition",
        expr: "\\mathbb{E}[(Y - \\hat{f}(X))^2] = \\operatorname{Bias}(\\hat{f}(X))^2 + \\operatorname{Var}(\\hat{f}(X)) + \\sigma_\\epsilon^2",
        note: "Total expected error decomposes into squared bias, variance, and irreducible noise.",
      },
      {
        label: "Ensemble Variance Formula (Breiman-Hastie)",
        expr: "\\operatorname{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2",
        note: "ρ is the average pairwise correlation; B is the number of trees; σ² is individual tree variance.",
      },
      {
        label: "Asymptotic Variance Floor",
        expr: "\\lim_{B \\to \\infty} \\operatorname{Var}(\\bar{f}) = \\rho \\sigma^2",
        note: "As tree count increases, variance cannot fall below the correlation floor ρσ².",
      },
    ],
    derivation: {
      title: "Expected Mean Squared Error Decomposition",
      description: "Rigorous step-by-step derivation of the Bias-Variance-Noise identity.",
      steps: [
        {
          step: "Express expected error conditioning on X",
          math: "\\mathbb{E}[(Y - \\hat{f})^2] = \\mathbb{E}[( (f + \\epsilon) - \\hat{f} )^2] = \\mathbb{E}[( (f - \\hat{f}) + \\epsilon )^2]",
          note: "Where Y = f + ε, with E[ε] = 0 and Var(ε) = σ²_ε, independent of f̂.",
        },
        {
          step: "Expand the squared binomial",
          math: "= \\mathbb{E}[(f - \\hat{f})^2] + 2\\mathbb{E}[(f - \\hat{f})\\epsilon] + \\mathbb{E}[\\epsilon^2]",
          note: "Since ε is independent of f and f̂, E[(f - f̂)ε] = E[f - f̂]E[ε] = 0.",
        },
        {
          step: "Add and subtract the expected prediction E[f̂] inside the first term",
          math: "\\mathbb{E}[(f - \\hat{f})^2] = \\mathbb{E}[ ( (f - \\mathbb{E}[\\hat{f}]) + (\\mathbb{E}[\\hat{f}] - \\hat{f}) )^2 ]",
          note: "Standard trick to decompose distance into bias and variance.",
        },
        {
          step: "Expand and simplify expectations",
          math: "= (f - \\mathbb{E}[\\hat{f}])^2 + \\mathbb{E}[(\\hat{f} - \\mathbb{E}[\\hat{f}])^2] = \\operatorname{Bias}(\\hat{f})^2 + \\operatorname{Var}(\\hat{f})",
          note: "The cross-term is 2(f - E[f̂])E[E[f̂] - f̂] = 0.",
        },
        {
          step: "Combine all three terms",
          math: "\\mathbb{E}[(Y - \\hat{f})^2] = \\operatorname{Bias}(\\hat{f})^2 + \\operatorname{Var}(\\hat{f}) + \\sigma_\\epsilon^2",
          note: "Complete proof showing that total prediction error is the sum of Bias², Variance, and irreducible noise.",
        },
      ],
    },
    workedExample: {
      title: "Quantifying the Variance Floor of a Random Forest",
      problem:
        "An individual tree has variance σ² = 50 and bias² = 5. Irreducible noise is σ²_ε = 10. (A) If trees are correlated at ρ = 0.40, compute total error for B = 100 trees. (B) If random feature subsampling drops correlation to ρ = 0.15, compute the new total error.",
      steps: [
        {
          title: "Compute Variance for Case A (ρ = 0.40, B = 100)",
          calculation: "\\operatorname{Var}_A = (0.40)(50) + \\frac{1 - 0.40}{100}(50) = 20 + 0.30 = 20.30",
          explanation: "Ensemble variance with moderate tree correlation.",
        },
        {
          title: "Compute Total Expected Error for Case A",
          calculation: "\\operatorname{Error}_A = \\operatorname{Bias}^2 + \\operatorname{Var}_A + \\sigma_\\epsilon^2 = 5 + 20.30 + 10 = 35.30",
          explanation: "Summing bias², variance, and noise.",
        },
        {
          title: "Compute Variance for Case B (ρ = 0.15, B = 100)",
          calculation: "\\operatorname{Var}_B = (0.15)(50) + \\frac{1 - 0.15}{100}(50) = 7.50 + 0.425 = 7.925",
          explanation: "Ensemble variance with lower tree correlation.",
        },
        {
          title: "Compute Total Expected Error for Case B",
          calculation: "\\operatorname{Error}_B = 5 + 7.925 + 10 = 22.925",
          explanation: "Total prediction error drops dramatically.",
        },
      ],
      result: "Total prediction error drops from 35.30 down to 22.93 (a 35.1% error reduction purely from decorrelation!)",
    },
    rfConnection:
      "This theorem is the foundational mathematical justification for Random Forest. It proves that simply adding more trees cannot reduce error beyond the correlation floor ρσ². Lowering tree correlation ρ via random feature subsampling is the true secret behind Random Forest's supremacy.",
    code: `import numpy as np

# Simulate Bias-Variance decomposition across an ensemble
sigma_sq = 50.0  # Individual tree variance
bias_sq = 5.0    # Individual tree bias squared
noise = 10.0     # Irreducible error

def ensemble_error(B, rho):
    variance = rho * sigma_sq + ((1 - rho) / B) * sigma_sq
    return bias_sq + variance + noise

# Test different forest sizes and correlations
for rho in [0.5, 0.2, 0.05]:
    err_10 = ensemble_error(10, rho)
    err_100 = ensemble_error(100, rho)
    err_inf = bias_sq + rho * sigma_sq + noise
    print(f"Correlation rho={rho:.2f}: B=10 Error: {err_10:.2f} | B=100 Error: {err_100:.2f} | Asymptotic Floor: {err_inf:.2f}")`,
    codeExplanation:
      "Simulating the Breiman-Hastie formula demonstrates that when correlation is high (0.5), error is trapped at 40.0. Lowering correlation to 0.05 drops the theoretical floor to 17.5.",
    application:
      "Automated algorithmic trading desks analyze the bias-variance profile of their order execution models to avoid overfitting backtested market microstructure noise.",
    mistakes: [
      "Believing that adding more trees will reduce bias (averaging models leaves the expected bias unchanged).",
      "Assuming irreducible noise can be eliminated by machine learning (irreducible noise represents unmeasured variables and innate stochasticity).",
      "Thinking variance approaches zero as B → ∞ (it approaches ρσ², which is strictly non-zero if trees are correlated).",
    ],
    prosCons: {
      pros: [
        "Provides clear mathematical insight into model errors.",
        "Proves exactly why tree decorrelation is essential.",
        "Guarantees that increasing n_estimators never increases generalization error.",
      ],
      cons: [
        "In real-world practice, exact bias and variance cannot be measured directly because the true population distribution f(x) is unknown.",
        "Simplifying assumptions (equal tree variance and pairwise correlation) are idealizations.",
      ],
    },
    takeaways: [
      "Total Error = Bias² + Variance + Irreducible Noise.",
      "Random Forest leaves low tree bias intact while aggressively driving down variance.",
      "Ensemble variance cannot drop below ρσ²; minimizing tree correlation ρ is the primary objective of random feature subsampling.",
    ],
    quiz: {
      prompt: "In the Breiman-Hastie ensemble variance formula Var = ρσ² + ((1 - ρ)/B)σ², what happens to the ensemble variance as the number of trees B approaches infinity?",
      options: [
        "It approaches the correlation floor ρσ²",
        "It approaches absolute zero",
        "It increases infinitely due to overfitting",
        "It becomes equal to individual tree variance σ²",
      ],
      answerIndex: 0,
      explanation:
        "As B → ∞, the term ((1 - ρ)/B)σ² goes to 0, leaving ρσ². This proves that the minimum achievable ensemble variance is bounded strictly by the correlation between trees multiplied by individual tree variance.",
    },
  },

  "hyperparameters": {
    slug: "hyperparameters",
    module: "09",
    section: "Advanced Concepts",
    title: "Random Forest Hyperparameters",
    intro:
      "Random Forest hyperparameters govern the structural growth of individual trees, the introduction of randomness, parallelization, and ensemble aggregation, directly controlling the bias-variance balance.",
    whyNecessary:
      "While Random Forest has remarkably sensible default settings in Scikit-Learn, unoptimized parameters on complex or imbalanced datasets can lead to unnecessary memory consumption, excessive inference latency, or sub-optimal accuracy.",
    intuition:
      "Think of the knobs on an audio equalizer. You can adjust the treble (tree depth) and bass (number of trees) to tune out background noise while maximizing the clarity of the musical signal.",
    theory: [
      "n_estimators (default=100): The number of trees in the forest. Increasing n_estimators always reduces or stabilizes variance without increasing bias, bounded only by computational resources.",
      "max_features (default='sqrt' for clf, 1.0 for reg): The number of candidate features evaluated at each split. Smaller values decorrelate trees (reducing variance) at the cost of slightly increasing individual tree bias.",
      "max_depth (default=None): Maximum tree depth. If None, nodes expand until all leaves are pure or contain fewer than min_samples_split.",
      "min_samples_split (default=2): Minimum number of samples required to split an internal node. Higher values enforce pre-pruning.",
      "min_samples_leaf (default=1): Minimum number of samples required to be at a leaf node. Setting this to 5-10 smooths regression models and reduces sensitivity to outliers.",
      "bootstrap (default=True): Whether bootstrap samples are used. If False, the whole dataset is used to build each tree.",
      "oob_score (default=False): Whether to use out-of-bag samples to estimate generalization score.",
      "n_jobs (default=None): Number of jobs to run in parallel. Setting to -1 uses all CPU cores.",
    ],
    readTime: "16 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "max_features (Classification Default)",
        expr: "m = \\lfloor \\sqrt{p} \\rfloor",
        note: "Default in Scikit-Learn for RandomForestClassifier.",
      },
      {
        label: "max_features (Regression Default)",
        expr: "m = p \\quad (\\text{or } \\lfloor p/3 \\rfloor \\text{ recommendation})",
        note: "Scikit-Learn uses 1.0 (all features), while Breiman originally recommended p/3.",
      },
      {
        label: "Balanced Class Weight Calculation",
        expr: "w_c = \\frac{N}{K \\times N_c}",
        note: "Weight assigned to class c with N_c samples across K total classes.",
      },
    ],
    workedExample: {
      title: "Calculating Balanced Class Weights for Imbalanced Training",
      problem:
        "A binary medical dataset has N = 1000 total patients with K = 2 classes: 950 healthy (Class 0) and 50 diseased (Class 1). Calculate the weights assigned when class_weight='balanced'.",
      steps: [
        {
          title: "Compute weight for Healthy Class 0 (N_0 = 950)",
          calculation: "w_0 = \\frac{1000}{2 \\times 950} = \\frac{1000}{1900} \\approx 0.5263",
          explanation: "Majority class weight is scaled down to ~0.53.",
        },
        {
          title: "Compute weight for Diseased Class 1 (N_1 = 50)",
          calculation: "w_1 = \\frac{1000}{2 \\times 50} = \\frac{1000}{100} = 10.0",
          explanation: "Minority class weight is amplified by a factor of 10.0.",
        },
        {
          title: "Verify weighted balance",
          calculation: "950 \\times 0.5263 = 500, \\quad 50 \\times 10.0 = 500",
          explanation: "Both classes now exert equal total influence (500 units each) on Gini split impurity!",
        },
      ],
      result: "Class 0 weight = 0.526, Class 1 weight = 10.0 (perfect empirical balance).",
    },
    rfConnection:
      "Tuning these hyperparameters is the direct interface through which machine learning engineers optimize Random Forest models in production environments.",
    code: `from sklearn.ensemble import RandomForestClassifier

# Production-tuned Random Forest configuration
rf_tuned = RandomForestClassifier(
    n_estimators=300,        # Ample trees for asymptotic variance reduction
    max_depth=15,            # Pre-pruning to curb tree depth and save RAM
    min_samples_split=6,     # Guards against isolated outlier splits
    min_samples_leaf=3,      # Ensures each leaf has statistically meaningful sample support
    max_features='sqrt',     # Optimal decorrelation for classification
    bootstrap=True,          # Essential for OOB estimation
    oob_score=True,          # Free cross-validation metric
    class_weight='balanced', # Compensates for label imbalance
    n_jobs=-1,               # Maximize multi-core CPU utilization
    random_state=42
)
print("Configured Random Forest Model:", rf_tuned)`,
    codeExplanation:
      "This configuration balances variance reduction, memory footprint, and class imbalance handling for high-throughput production workloads.",
    application:
      "Online ad-click prediction services tune min_samples_leaf and max_depth to keep model checkpoint sizes small enough to fit inside L3 processor cache for microsecond-level scoring.",
    mistakes: [
      "Increasing n_estimators hoping to solve an underfitting problem (more trees only reduce variance, not bias).",
      "Using max_features=1.0 for classification (this disables random feature selection, degenerating Random Forest into standard Bagging).",
      "Leaving n_jobs=1 on modern 16-core processors (setting n_jobs=-1 speeds up training by 10x-15x).",
    ],
    prosCons: {
      pros: [
        "Defaults work remarkably well on most standard tabular problems.",
        "n_estimators has no risk of catastrophic overfitting.",
        "Offers granular controls for latency, memory, and pruning.",
      ],
      cons: [
        "Training time scales linearly with n_estimators and depth.",
        "Tuning max_features and min_samples_leaf requires systematic search.",
      ],
    },
    takeaways: [
      "n_estimators controls the number of trees; increasing it stabilizes predictions without risk of overfitting.",
      "max_features controls tree decorrelation; sqrt(p) is optimal for classification.",
      "class_weight='balanced' automatically rescales split loss by inverse class frequencies.",
    ],
    quiz: {
      prompt: "What is the primary effect of decreasing max_features from 1.0 (all features) to sqrt(p)?",
      options: [
        "It decreases correlation between trees, driving down ensemble variance",
        "It increases the time required to train each tree",
        "It guarantees that every tree will be 100% pure",
        "It forces the model to perform linear regression",
      ],
      answerIndex: 0,
      explanation:
        "Evaluating fewer features at each split prevents all trees from choosing the same dominant feature, decorrelating the trees and reducing the ensemble variance floor.",
    },
  },

  "oob-estimation": {
    slug: "oob-estimation",
    module: "10",
    section: "Advanced Concepts",
    title: "Out-of-Bag (OOB) Estimation",
    intro:
      "Out-of-Bag (OOB) estimation is an internal validation mechanism unique to bagged ensembles, where each tree is evaluated exclusively on the ~36.8% of training observations omitted from its bootstrap sample.",
    whyNecessary:
      "K-fold cross-validation requires training K separate ensembles (e.g. 5x or 10x the compute time). OOB estimation provides an unbiased estimate of generalization error directly during a single training run, saving massive computational overhead.",
    intuition:
      "Imagine studying for a test with 100 flashcards. For each study session, you randomly pick 63 cards to review and set 37 aside in a drawer. At the end, you test yourself only on the cards that were left in the drawer. You get an honest evaluation without needing to buy a separate practice exam.",
    theory: [
      "For each observation z_i in the training set, identify all trees T_b in the forest that did NOT include z_i in their bootstrap training sample (the Out-of-Bag trees for observation i).",
      "Aggregate predictions for z_i using only this subset of trees. Since observation i was never seen by any of these trees during fitting, this prediction is completely out-of-sample.",
      "The Out-of-Bag error rate is the average loss between the true label y_i and the aggregated OOB prediction f̂_oob(x_i) across all N training samples.",
      "Leo Breiman demonstrated that OOB error is nearly identical to K-fold cross-validation error, making separate cross-validation largely redundant for large Random Forests.",
    ],
    readTime: "12 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "Out-of-Bag Prediction Aggregation",
        expr: "\\hat{f}_{\\text{oob}}(x_i) = \\operatorname{argmax}_c \\sum_{b: x_i \\notin D^{*b}} \\mathbb{I}(T_b(x_i) = c)",
        note: "Prediction formed only by trees that never saw sample x_i during training.",
      },
      {
        label: "Out-of-Bag Generalization Error",
        expr: "\\operatorname{OOB\\_Error} = \\frac{1}{N} \\sum_{i=1}^{N} L(y_i, \\hat{f}_{\\text{oob}}(x_i))",
        note: "Unbiased estimate of test set error computed across all N training samples.",
      },
    ],
    workedExample: {
      title: "Calculating OOB Prediction for a Single Sample",
      problem:
        "In a forest of B = 5 trees, sample x_1 was omitted from trees T_2, T_4, and T_5 (it was in the bootstrap samples of T_1 and T_3). The predictions are: T_1=1, T_2=0, T_3=1, T_4=0, T_5=1. What is the OOB prediction for x_1?",
      steps: [
        {
          title: "Identify OOB trees for sample x_1",
          calculation: "\\text{OOB Trees} = \\{T_2, T_4, T_5\\}",
          explanation: "Exclude T_1 and T_3 because they trained on x_1.",
        },
        {
          title: "Extract predictions from OOB trees only",
          calculation: "T_2(x_1) = 0, \\quad T_4(x_1) = 0, \\quad T_5(x_1) = 1",
          explanation: "Disregard T_1 and T_3.",
        },
        {
          title: "Compute OOB Majority Vote",
          calculation: "\\operatorname{Votes} = \\{ \\text{Class 0}: 2, \\; \\text{Class 1}: 1 \\} \\implies \\hat{y}_{\\text{oob}}(x_1) = 0",
          explanation: "Class 0 receives 2 votes; Class 1 receives 1 vote.",
        },
      ],
      result: "OOB prediction for x_1 is Class 0 (unbiased by training exposure).",
    },
    rfConnection:
      "Setting oob_score=True in Scikit-Learn activates this tracking with virtually zero additional compute overhead during model fitting.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer

X, y = load_breast_cancer(return_X_y=True)

# Train forest with OOB scoring enabled
rf = RandomForestClassifier(n_estimators=200, oob_score=True, random_state=42)
rf.fit(X, y)

print(f"Out-of-Bag Accuracy Score: {rf.oob_score_:.4f}")
print("First 3 OOB Probabilities:\\n", rf.oob_decision_function_[:3])`,
    codeExplanation:
      "rf.oob_score_ provides the aggregate OOB accuracy. rf.oob_decision_function_ provides the exact out-of-sample probability simplex for every training instance.",
    application:
      "Astronomical sky surveys classifying billions of light curves use OOB scores to tune hyperparameters without needing to partition precious confirmed supernova samples into separate validation sets.",
    mistakes: [
      "Computing OOB score when bootstrap=False (if bootstrap is False, there are no OOB samples; Scikit-Learn will raise an error).",
      "Using OOB score with too few trees (e.g. B = 10; some samples may be selected in all 10 trees and have zero OOB estimators).",
      "Believing OOB score is optimistic compared to test set error (empirically, OOB error is slightly pessimistic for small forests).",
    ],
    prosCons: {
      pros: [
        "Zero data leakage: provides genuine out-of-sample validation.",
        "Eliminates the computational cost of K-fold cross-validation.",
        "Allows training on 100% of available labeled data.",
      ],
      cons: [
        "Requires bootstrap=True.",
        "Slightly noisy when forest size B is small (< 50 trees).",
      ],
    },
    takeaways: [
      "Every sample is out-of-bag for approximately 36.8% of the trees.",
      "Aggregating predictions from only these trees gives an honest out-of-sample evaluation.",
      "OOB error provides a free alternative to K-fold cross-validation.",
    ],
    quiz: {
      prompt: "Which trees in the forest are permitted to cast a vote when computing the Out-of-Bag prediction for training sample x_i?",
      options: [
        "Only the trees whose bootstrap training samples excluded sample x_i",
        "All trees in the entire forest",
        "Only the top 10 most accurate trees",
        "Only the trees that correctly classified sample x_i",
      ],
      answerIndex: 0,
      explanation:
        "By definition, an Out-of-Bag prediction for sample x_i can only use the ~36.8% of trees that were never trained on x_i, ensuring the prediction is genuinely out-of-sample.",
    },
  },

  "feature-importance": {
    slug: "feature-importance",
    module: "11",
    section: "Advanced Concepts",
    title: "Feature Importance",
    intro:
      "Feature importance techniques quantify the relative contribution of each predictor variable to the Random Forest's predictive capability, using either impurity-based metrics (MDI) or permutation-based metrics (MDA).",
    whyNecessary:
      "Ensembles are inherently black-box models. Feature importance provides critical model interpretability, helping domain experts identify driving factors, prune uninformative noise features, and validate scientific hypotheses.",
    intuition:
      "If you want to know who is the most essential player on a basketball team, you can look at two things: (1) How many game-winning points they score when on the court (MDI), or (2) How terribly the team performs when that specific player is benched (Permutation Importance).",
    theory: [
      "Mean Decrease in Impurity (MDI / Gini Importance): Sums the total reduction in impurity (Gini or MSE) brought by all splits on a given feature, weighted by the proportion of samples reaching that node, averaged across all B trees.",
      "MDI Cardinality Bias: MDI is heavily biased toward high-cardinality features (features with many unique values, such as customer IDs or fine timestamps), because random noise with many thresholds can easily overfit and appear to reduce impurity during training.",
      "Permutation Feature Importance (Mean Decrease Accuracy / MDA): Evaluates baseline model score on validation data, shuffles the values of a single feature column to destroy its relationship with the target, and measures the resulting drop in model performance.",
      "Correlated Features Effect: When two features are strongly collinear, MDI and permutation importance split the importance between them, making both appear less important than they truly are.",
    ],
    readTime: "15 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "Mean Decrease in Impurity (MDI)",
        expr: "\\operatorname{MDI}(j) = \\frac{1}{B} \\sum_{b=1}^{B} \\sum_{t \\in T_b : v(t)=j} \\frac{N_t}{N} \\Delta i(t)",
        note: "Sum of weighted impurity decreases Δi(t) at all nodes t splitting on feature j across all B trees.",
      },
      {
        label: "Permutation Feature Importance (MDA)",
        expr: "\\operatorname{PFI}(j) = \\operatorname{Score}(D_{\\text{val}}) - \\operatorname{Score}(D_{\\text{val}}^{\\text{perm}(j)})",
        note: "Drop in validation metric when feature j is randomly permuted.",
      },
    ],
    workedExample: {
      title: "Computing MDI Importance for 2 Features",
      problem:
        "In a small forest of B = 2 trees, Feature 1 splits at Node A (weight 0.40, Gini drop 0.20) and Node B (weight 0.30, Gini drop 0.10). Feature 2 splits at Node C (weight 0.50, Gini drop 0.15). Calculate unnormalized MDI for both features.",
      steps: [
        {
          title: "Compute MDI for Feature 1",
          calculation: "\\operatorname{MDI}(F_1) = \\frac{1}{2} [(0.40 \\times 0.20) + (0.30 \\times 0.10)] = \\frac{1}{2} [0.08 + 0.03] = 0.055",
          explanation: "Summing weighted Gini drops across Nodes A and B.",
        },
        {
          title: "Compute MDI for Feature 2",
          calculation: "\\operatorname{MDI}(F_2) = \\frac{1}{2} [(0.50 \\times 0.15)] = \\frac{1}{2} [0.075] = 0.0375",
          explanation: "Summing weighted Gini drop for Node C.",
        },
        {
          title: "Normalize to sum to 1.0",
          calculation: "\\text{Total} = 0.055 + 0.0375 = 0.0925 \\implies F_1 = \\frac{0.055}{0.0925} = 59.5\\%, \\; F_2 = 40.5\\%",
          explanation: "Feature 1 accounts for 59.5% of total tree impurity reduction.",
        },
      ],
      result: "Feature 1 Importance = 0.595, Feature 2 Importance = 0.405.",
    },
    rfConnection:
      "rf.feature_importances_ in Scikit-Learn computes MDI. permutation_importance from sklearn.inspection computes permutation importance on out-of-sample data.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import numpy as np

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# 1. Gini Importance (MDI)
mdi_importances = rf.feature_importances_

# 2. Permutation Importance on Test Data
perm_importance = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=42)

print(f"Top MDI Feature Index : {np.argmax(mdi_importances)} (Score: {np.max(mdi_importances):.4f})")
print(f"Top Permutation Feature Index: {np.argmax(perm_importance.importances_mean)} (Score: {np.max(perm_importance.importances_mean):.4f})")`,
    codeExplanation:
      "permutation_importance tests on held-out test data, avoiding MDI's high-cardinality training bias.",
    application:
      "Pharmaceutical drug discovery teams use permutation feature importance to identify which chemical molecular descriptors most strongly inhibit viral replication enzymes.",
    mistakes: [
      "Relying solely on MDI when features have drastically different cardinalities (e.g. continuous vs binary indicators).",
      "Equating feature importance with causal inference (importance indicates correlation and predictive utility, not causation).",
      "Evaluating permutation importance on training data instead of held-out validation data.",
    ],
    prosCons: {
      pros: [
        "MDI is computed automatically during tree training with zero additional latency.",
        "Permutation importance provides a model-agnostic, unbiased reality check.",
        "Identifies irrelevant noise features for model pruning.",
      ],
      cons: [
        "MDI is biased toward high-cardinality features.",
        "Collinear features dilute each other's importance scores.",
      ],
    },
    takeaways: [
      "MDI measures average training impurity reduction; permutation importance measures test score degradation after shuffling.",
      "Prefer Permutation Feature Importance whenever features have varying cardinalities or numerical scales.",
      "Feature importance does not imply causal relationships.",
    ],
    quiz: {
      prompt: "Why can Mean Decrease in Impurity (MDI) produce severely misleading feature importances on datasets with high-cardinality numerical noise features?",
      options: [
        "High-cardinality features offer many candidate split thresholds, allowing trees to artificially overfit and reduce training impurity",
        "MDI only evaluates the top 2 features in the dataset",
        "MDI can only be computed for binary classification problems",
        "High-cardinality features are automatically deleted by Scikit-Learn",
      ],
      answerIndex: 0,
      explanation:
        "Features with many unique values (like random floating-point IDs) give greedy tree split algorithms numerous opportunities to find coincidental splits that reduce training impurity, artificially inflating their MDI score despite carrying zero true predictive value.",
    },
  },

  "imbalanced-data": {
    slug: "imbalanced-data",
    module: "12",
    section: "Advanced Concepts",
    title: "Imbalanced Data Strategies",
    intro:
      "Imbalanced classification occurs when target classes are unequally represented. In standard Random Forest, trees optimize overall accuracy, causing them to favor the majority class while ignoring critical rare minority events. This comprehensive guide covers Class Weighting, Random Oversampling, Random Undersampling, SMOTE, and an end-to-end unified practical comparison.",
    whyNecessary:
      "In critical domains like fraud detection (99% legitimate, 1% fraud), rare disease diagnostics, and cybersecurity intrusion detection, predicting the majority class for every sample achieves 99% raw accuracy but fails completely. Trees split nodes by maximizing overall impurity reduction, so splitting majority instances yields higher immediate gains unless class weights or resampling strategies force the forest to prioritize rare instances.",
    intuition:
      "Consider a bank transaction fraud monitor. If a false alarm costs $10 in customer verification while a missed fraud costs $5,000 in unrecoverable losses, a rational system must treat minority errors with 500x greater urgency. Class weighting embeds this asymmetric penalty directly into the loss function, while oversampling and undersampling physically rebalance the data manifold.",
    theory: [
      "The Accuracy Paradox: Raw accuracy is mathematically degenerate under severe class imbalance. A trivial majority classifier achieves 99% accuracy while exhibiting 0% minority recall. Evaluation must rely on Precision, Recall, F1-Score, Balanced Accuracy, Precision-Recall AUC (PR-AUC), and the Matthews Correlation Coefficient (MCC).",
      "Technique 1 — Class Weighting (Cost-Sensitive Learning): Class weighting modifies the loss function by scaling the penalty of misclassifying sample i by weight w_{y_i}: L_weighted = sum_{i=1}^N w_{y_i} L(y_i, y_hat_i). In Random Forest, class weights rescale sample weights during Gini/Entropy impurity calculation at every candidate split. Four primary modes exist: (1) class_weight=None (all samples weighted equally), (2) class_weight='balanced' (weights inversely proportional to global class frequencies w_c = N / (K * N_c)), (3) class_weight='balanced_subsample' (weights recalculated dynamically within each tree's individual bootstrap replicate), and (4) custom dictionary weights (e.g., class_weight={0: 1, 1: 5}).",
      "Technique 2 — Random Oversampling (ROS): Random Oversampling duplicates existing minority-class instances with replacement until class parity is reached. For example, a 900:100 dataset is transformed into 900:900 by duplicating minority observations 9 times. Advantage: simple and retains all original observations. Disadvantage: because exact identical feature vectors are duplicated, decision trees create narrow, memorized leaf partitions around duplicate points, substantially increasing the risk of overfitting.",
      "Technique 3 — Random Undersampling (RUS): Random Undersampling randomly discards majority-class instances until classes are balanced. For example, a dataset with 10,000 majority and 200 minority samples is reduced to 200:200, discarding 9,800 majority observations. Advantage: drastically speeds up training and reduces memory usage. Disadvantage: catastrophic information loss—discarding 98% of majority data strips away critical boundary definitions and increases false alarm rates. Best used when dealing with massive datasets (>1M rows) where computational bandwidth is constrained.",
      "Technique 4 — Synthetic Minority Over-sampling Technique (SMOTE): Rather than duplicating existing samples, SMOTE synthesizes novel minority observations along the line segment connecting random k-nearest minority neighbors in continuous feature space: x_new = x_i + lambda * (x_zi - x_i) with lambda ~ U(0,1). This expands the minority decision boundary continuously, overcoming the exact-duplication overfitting defect of Random Oversampling.",
      "Data Leakage Integrity & Pipeline Enforcement: Resampling methods (SMOTE, ROS, RUS) MUST ONLY be applied to training data AFTER the train-test split. Resampling the test or validation set creates artificial test distributions and leaks information between partitions, rendering evaluation metrics invalid. Using imblearn.pipeline.Pipeline guarantees that resampling occurs strictly within training folds during cross-validation.",
      "Unified Comparison Framework: Evaluating Baseline RF, Class Weighting (balanced and balanced_subsample), Random Oversampling, Random Undersampling, and SMOTE on the exact same dataset under identical hyperparameters reveals the fundamental precision-recall trade-off across techniques.",
    ],
    readTime: "24 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "Weighted Misclassification Loss Function",
        expr: "L_{\\text{weighted}} = \\sum_{i=1}^{N} w_{y_i} L(y_i, \\hat{y}_i)",
        note: "N: total samples; y_i: true label; y_hat_i: predicted label/probability; w_{y_i}: asymmetric weight scalar for class y_i; L: base loss.",
      },
      {
        label: "Balanced Class Weight Formula",
        expr: "w_c = \\frac{N}{K \\cdot N_c}",
        note: "N: total training samples, K: number of classes (K=2 for binary), N_c: sample count in class c.",
      },
      {
        label: "SMOTE Synthetic Vector Interpolation",
        expr: "\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\sim \\mathcal{U}(0, 1)",
        note: "x_i: seed minority sample; x_zi: randomly selected k-nearest minority neighbor; λ: uniform random interpolation scalar.",
      },
      {
        label: "Random Oversampling Class Expansion",
        expr: "N_{\\text{min}}^{\\text{new}} = N_{\\text{maj}}, \\qquad N_{\\text{total}}^{\\text{new}} = 2 \\cdot N_{\\text{maj}}",
        note: "Minority samples duplicated with replacement until class equality is established.",
      },
      {
        label: "Random Undersampling Class Reduction",
        expr: "N_{\\text{maj}}^{\\text{new}} = N_{\\text{min}}, \\qquad N_{\\text{total}}^{\\text{new}} = 2 \\cdot N_{\\text{min}}",
        note: "Majority samples randomly dropped until class counts match minority; discarded = N_maj - N_min.",
      },
      {
        label: "Matthews Correlation Coefficient (MCC)",
        expr: "\\operatorname{MCC} = \\frac{\\text{TP} \\cdot \\text{TN} - \\text{FP} \\cdot \\text{FN}}{\\sqrt{(\\text{TP}+\\text{FP})(\\text{TP}+\\text{FN})(\\text{TN}+\\text{FP})(\\text{TN}+\\text{FN})}}",
        note: "Ranges from -1 to +1; robust to severe imbalance where ROC-AUC gives overly optimistic scores.",
      },
      {
        label: "Balanced Accuracy Score",
        expr: "\\text{Balanced Acc} = \\frac{1}{2} \\left( \\frac{\\text{TP}}{\\text{TP} + \\text{FN}} + \\frac{\\text{TN}}{\\text{TN} + \\text{FP}} \\right)",
        note: "Arithmetic mean of sensitivity (recall) and specificity; baseline random guessing yields 0.50.",
      },
    ],
    derivation: {
      title: "Derivations: Weighted Impurity and SMOTE Linear Convexity",
      description:
        "Mathematical derivation showing how class weights modify node split impurity and how SMOTE generates convex combinations in Euclidean space.",
      steps: [
        {
          step: "Weighted Gini Impurity at Split Node",
          math: "Gini_{\\text{weighted}}(t) = 1 - \\sum_{c=1}^K p_w(c \\mid t)^2, \\quad p_w(c \\mid t) = \\frac{\\sum_{i \\in t : y_i=c} w_c}{\\sum_{i \\in t} w_{y_i}}",
          note: "Class weights directly modify the empirical class probabilities p_w(c|t) at tree node t, penalizing majority-dominated impure nodes.",
        },
        {
          step: "SMOTE Convex Combination on Euclidean Line Segment",
          math: "\\mathbf{x}_{\\text{new}}(\\lambda) = (1 - \\lambda) \\mathbf{x}_i + \\lambda \\mathbf{x}_{zi} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\in [0, 1]",
          note: "Because λ is drawn uniformly from [0, 1], x_new is guaranteed to lie on the straight line segment between x_i and x_zi, populating sparsely sampled minority regions without duplicating points.",
        },
        {
          step: "Matthews Correlation Coefficient (MCC) as Pearson Correlation",
          math: "\\operatorname{MCC} = \\frac{\\operatorname{Cov}(Y, \\hat{Y})}{\\sigma_Y \\sigma_{\\hat{Y}}} = \\frac{\\sum (y_i - \\bar{y})(\\hat{y}_i - \\bar{\\hat{y}})}{\\sqrt{\\sum (y_i - \\bar{y})^2 \\sum (\\hat{y}_i - \\bar{\\hat{y}})^2}}",
          note: "Treating binary ground truth Y and binary prediction Y_hat as Bernoulli random variables yields the exact contingency matrix formula for MCC.",
        },
      ],
    },
    workedExample: {
      title: "Step-by-Step SMOTE Vector Generation in 2D Feature Space",
      problem:
        "A financial fraud dataset has 2 features: Transaction Amount x1 ($ x 10) and Transaction Velocity x2 (trans/hr). A seed fraudulent transaction is located at x_1 = [2.0, 3.5]. Three neighboring candidate fraud cases are x_2 = [3.0, 5.0], x_3 = [1.5, 4.0], and x_4 = [4.0, 2.0]. Using k = 2 nearest neighbors, compute Euclidean distances, select the second neighbor x_2, draw lambda = 0.40, and compute the exact synthetic sample coordinate x_new.",
      steps: [
        {
          title: "Compute Euclidean distances from seed sample x_1 = [2.0, 3.5]",
          calculation: "d(x_1, x_2) = \\sqrt{(3.0-2.0)^2 + (5.0-3.5)^2} = \\sqrt{1.0^2 + 1.5^2} = \\sqrt{3.25} \\approx 1.8028 \\\\ d(x_1, x_3) = \\sqrt{(1.5-2.0)^2 + (4.0-3.5)^2} = \\sqrt{(-0.5)^2 + 0.5^2} = \\sqrt{0.50} \\approx 0.7071 \\\\ d(x_1, x_4) = \\sqrt{(4.0-2.0)^2 + (2.0-3.5)^2} = \\sqrt{2.0^2 + (-1.5)^2} = \\sqrt{6.25} = 2.5000",
          explanation: "Comparing Euclidean distances: d(x_1, x_3) = 0.707 < d(x_1, x_2) = 1.803 < d(x_1, x_4) = 2.500.",
        },
        {
          title: "Identify k = 2 Nearest Neighbors and select x_zi",
          calculation: "\\mathcal{N}_2(\\mathbf{x}_1) = \\{\\mathbf{x}_3, \\mathbf{x}_2\\}, \\quad \\text{Algorithm randomly selects } \\mathbf{x}_{zi} = \\mathbf{x}_2 = [3.0, 5.0]",
          explanation: "Candidate pool consists of x_3 and x_2. SMOTE randomly samples x_2 for this interpolation step.",
        },
        {
          title: "Compute Difference Vector",
          calculation: "\\mathbf{v}_{\\text{diff}} = \\mathbf{x}_{zi} - \\mathbf{x}_1 = [3.0 - 2.0, \\; 5.0 - 3.5] = [1.0, \\; 1.5]",
          explanation: "Direction vector from x_1 toward x_2.",
        },
        {
          title: "Generate Synthetic Coordinate with lambda = 0.40",
          calculation: "\\mathbf{x}_{\\text{new}} = [2.0, \\; 3.5] + 0.40 \\times [1.0, \\; 1.5] = [2.0 + 0.40, \\; 3.5 + 0.60] = [2.40, \\; 4.10]",
          explanation: "Synthetic point x_new is positioned at (2.40, 4.10).",
        },
        {
          title: "Verify Collinearity and Euclidean Distance Proportion",
          calculation: "d(\\mathbf{x}_1, \\mathbf{x}_{\\text{new}}) = \\sqrt{(2.40-2.0)^2 + (4.10-3.5)^2} = \\sqrt{0.16 + 0.36} = \\sqrt{0.52} \\approx 0.7211 \\\\ \\lambda \\times d(\\mathbf{x}_1, \\mathbf{x}_2) = 0.40 \\times 1.8028 = 0.7211 \\quad (\\text{Exact match!})",
          explanation: "x_new lies precisely 40% of the distance from x_1 to x_2 along the line segment.",
        },
      ],
      result: "Synthetic instance x_new = [2.40, 4.10] successfully generated without copying existing points.",
    },
    rfConnection:
      "Random Forest provides native support for imbalanced data via class_weight='balanced' and class_weight='balanced_subsample'. When paired with imbalanced-learn pipelines (RandomOverSampler, RandomUnderSampler, SMOTE), practitioners can balance minority sensitivity with computational efficiency while preventing data leakage.",
    code: `import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)
from imblearn.over_sampling import RandomOverSampler, SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline

# 1. Generate imbalanced dataset (98% Majority Class 0, 2% Minority Class 1)
X, y = make_classification(
    n_samples=10000, n_features=20, n_informative=12,
    weights=[0.98, 0.02], flip_y=0.01, random_state=42
)

# 2. Stratified train-test split (resampling strictly on train data to prevent leakage)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42
)

# Common base Random Forest hyperparameters
rf_kwargs = {'n_estimators': 200, 'max_depth': 12, 'random_state': 42, 'n_jobs': -1}

# 3. Define the 6 comparison configurations
pipelines = {
    "Baseline (None)": RandomForestClassifier(**rf_kwargs, class_weight=None),
    "Class Weight ('balanced')": RandomForestClassifier(**rf_kwargs, class_weight="balanced"),
    "Class Weight ('balanced_subsample')": RandomForestClassifier(**rf_kwargs, class_weight="balanced_subsample"),
    "Random Oversampling": ImbPipeline([('ros', RandomOverSampler(random_state=42)), ('rf', RandomForestClassifier(**rf_kwargs))]),
    "Random Undersampling": ImbPipeline([('rus', RandomUnderSampler(random_state=42)), ('rf', RandomForestClassifier(**rf_kwargs))]),
    "SMOTE": ImbPipeline([('smote', SMOTE(k_neighbors=5, random_state=42)), ('rf', RandomForestClassifier(**rf_kwargs))]),
}

# 4. Train, evaluate, and assemble comparison DataFrame
benchmark_rows = []
for name, model in pipelines.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    benchmark_rows.append({
        "Technique": name,
        "Accuracy": accuracy_score(y_test, y_pred),
        "Precision": precision_score(y_test, y_pred, zero_division=0),
        "Recall": recall_score(y_test, y_pred, zero_division=0),
        "F1-score": f1_score(y_test, y_pred, zero_division=0),
        "ROC-AUC": roc_auc_score(y_test, y_prob)
    })

df_comparison = pd.DataFrame(benchmark_rows)
print(df_comparison.to_string(index=False))`,
    codeExplanation:
      "All 6 techniques are trained on the exact same stratified training split and evaluated on the untouched test partition. ImbPipeline encapsulates resampling so it executes strictly on training folds, eliminating data leakage.",
    application:
      "Financial credit card fraud engines evaluate 100M daily transactions. They use class_weight='balanced_subsample' combined with threshold calibration to detect rare fraud with 85%+ recall while keeping false decline rates below 0.5%.",
    mistakes: [
      "Evaluating imbalanced models using raw classification accuracy (e.g. 98% accuracy can have 0% minority recall).",
      "Applying SMOTE, Random Oversampling, or Undersampling before train-test splitting (causes severe data leakage into validation/test sets).",
      "Confusing class_weight='balanced' with class_weight='balanced_subsample' ('balanced' calculates weights globally, while 'balanced_subsample' recalculates per tree bootstrap).",
      "Using Random Undersampling on small datasets (causes catastrophic loss of majority variance).",
      "Assuming Random Oversampling solves class imbalance without risk (exact duplicates cause decision trees to memorize noise and overfit).",
    ],
    prosCons: {
      pros: [
        "Class weighting requires zero synthetic data generation or memory overhead.",
        "SMOTE creates smooth, continuous minority boundaries without duplicating samples.",
        "Random Undersampling drastically speeds up training on massive multi-million row datasets.",
        "imblearn.pipeline.Pipeline integrates seamlessly with Scikit-Learn cross-validation.",
      ],
      cons: [
        "Random Oversampling can cause decision trees to overfit duplicate points.",
        "Random Undersampling discards valuable majority data and variance.",
        "Aggressive rebalancing lowers precision, requiring operational threshold tuning.",
      ],
    },
    takeaways: [
      "Never trust accuracy under severe class imbalance; prioritize Recall, F1-Score, PR-AUC, and MCC.",
      "Class weighting adjusts the loss function: L_weighted = sum w_{y_i} L(y_i, y_hat_i), requiring no data manipulation.",
      "class_weight='balanced_subsample' adapts weights dynamically inside each bootstrap sample.",
      "Random Oversampling duplicates samples (overfitting hazard); SMOTE interpolates between neighbors.",
      "Random Undersampling deletes majority samples (information loss hazard); optimal for massive datasets.",
      "Always apply resampling strictly to training folds via imblearn.pipeline.Pipeline to prevent data leakage.",
    ],
    quiz: {
      prompt: "Why can Random Oversampling cause decision trees in a Random Forest to overfit more severely than SMOTE?",
      options: [
        "Random Oversampling creates exact identical duplicates of minority observations, encouraging trees to memorize narrow, noise-filled leaf partitions",
        "Random Oversampling converts all continuous features into categorical features",
        "Random Oversampling deletes majority samples from the training dataset",
        "Random Oversampling disables bootstrap sampling across the forest",
      ],
      answerIndex: 0,
      explanation:
        "Because Random Oversampling duplicates exact existing samples, decision tree algorithms find it easy to isolate these duplicate data points into tiny, pure leaves. This memorizes training noise rather than learning generalizable boundary manifolds. In contrast, SMOTE generates new synthetic points along line segments, creating geometric diversity.",
    },
  },

  "class-weighting": {
    slug: "class-weighting",
    module: "12A",
    section: "Advanced Concepts",
    title: "Class Weighting in Random Forest",
    intro:
      "Class weighting is a cost-sensitive learning technique that modifies the decision tree loss function by scaling the misclassification penalty according to sample class membership, forcing the ensemble to prioritize rare minority events without altering dataset size.",
    whyNecessary:
      "In standard decision trees, greedy split optimization treats every observation equally. On a dataset with 99% majority and 1% minority instances, splitting the majority class yields far greater impurity reduction than isolating minority instances, leading to models that miss critical rare events. Class weighting forces trees to balance split utility.",
    intuition:
      "Consider a security screener: letting an ordinary passenger pass costs $0, but letting contraband pass carries a catastrophic $100,000 penalty. A rational screener scrutinizes suspicious indicators with extreme attention. Class weighting translates this asymmetric risk profile into the model loss function.",
    theory: [
      "Cost-Sensitive Loss Modification: Class weighting directly rescales the loss incurred on observation i by a scalar weight w_{y_i}: L_weighted = sum_{i=1}^N w_{y_i} L(y_i, y_hat_i). Every term corresponds to: N (total samples), i (sample index), y_i (true label), y_hat_i (predicted probability), L (base loss), and w_{y_i} (class weight multiplier).",
      "Gini Impurity Modification: During candidate split evaluation at tree node t, class weights rescale sample counts to compute weighted empirical class probabilities: p_w(c | t) = (sum_{i in t : y_i=c} w_c) / (sum_{i in t} w_{y_i}). This directly penalizes majority-dominated impure splits.",
      "Scikit-Learn Mode 1 — None: Default setting where all samples carry equal weight (w_0 = w_1 = 1.0). Trees optimize raw accuracy, causing severe minority neglect.",
      "Scikit-Learn Mode 2 — 'balanced': Automatically computes weights inversely proportional to global class frequencies: w_c = N / (K * N_c), where N is total samples, K is number of classes, and N_c is count of class c.",
      "Scikit-Learn Mode 3 — 'balanced_subsample': Recomputes class weights dynamically within each individual tree's bootstrap sample: w_{c,b} = N_b / (K * N_{c,b}). This adapts to local bootstrap fluctuations and provides superior variance control.",
      "Scikit-Learn Mode 4 — Custom Dictionary: Explicitly specifies asymmetric penalties, such as class_weight={0: 1, 1: 5}, defining a 5x penalty for false negatives compared to false positives.",
    ],
    readTime: "18 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "Weighted Misclassification Loss Function",
        expr: "L_{\\text{weighted}} = \\sum_{i=1}^{N} w_{y_i} L(y_i, \\hat{y}_i)",
        note: "w_{y_i} assigns an asymmetric loss penalty according to observation i's true class label.",
      },
      {
        label: "Balanced Class Weight Formula",
        expr: "w_c = \\frac{N}{K \\cdot N_c}",
        note: "N: total training samples, K: number of classes (K=2 for binary), N_c: sample count in class c.",
      },
      {
        label: "Dynamic Bootstrap Subsample Class Weight",
        expr: "w_{c, b} = \\frac{N_b}{K \\cdot N_{c, b}}",
        note: "Calculated per tree bootstrap draw b, where N_b and N_{c,b} are local bootstrap sample counts.",
      },
      {
        label: "Weighted Node Class Proportion in Gini Split",
        expr: "p_w(c \\mid t) = \\frac{\\sum_{i \\in t : y_i=c} w_c}{\\sum_{i \\in t} w_{y_i}}",
        note: "Weighted empirical probability used in calculating Gini impurity at split node t.",
      },
    ],
    derivation: {
      title: "Derivation of Balanced Class Weights and Node Purity",
      description:
        "Mathematical proof showing how balanced class weights equalize the effective influence of majority and minority classes during Gini split evaluation.",
      steps: [
        {
          step: "Total Weighted Sample Contribution by Class",
          math: "W_c = \\sum_{i : y_i = c} w_c = N_c \\cdot w_c = N_c \\cdot \\left( \\frac{N}{K \\cdot N_c} \\right) = \\frac{N}{K}",
          note: "Multiplying class count N_c by weight w_c produces exactly N/K for every class c in the dataset.",
        },
        {
          step: "Equal Effective Influence on Node Purity",
          math: "W_0 = \\frac{N}{2}, \\quad W_1 = \\frac{N}{2} \\implies \\sum_{i : y_i = 0} w_0 = \\sum_{j : y_j = 1} w_1",
          note: "Both classes now exert identical total influence (50% each) on impurity reduction, removing majority bias.",
        },
      ],
    },
    workedExample: {
      title: "Calculating Balanced Class Weights for a 950:50 Medical Dataset",
      problem:
        "A binary medical screening dataset has N = 1,000 total patients with K = 2 classes: 950 Healthy (Class 0) and 50 Diseased (Class 1). Calculate the exact class weights under class_weight='balanced', and compute the total weighted mass for both classes.",
      steps: [
        {
          title: "Compute weight for Healthy Class 0 (N_0 = 950)",
          calculation: "w_0 = \\frac{1000}{2 \\times 950} = \\frac{1000}{1900} \\approx 0.5263",
          explanation: "Majority class weight is scaled down to ~0.53.",
        },
        {
          title: "Compute weight for Diseased Class 1 (N_1 = 50)",
          calculation: "w_1 = \\frac{1000}{2 \\times 50} = \\frac{1000}{100} = 10.000",
          explanation: "Minority class weight is amplified 10-fold.",
        },
        {
          title: "Verify Total Weighted Influence",
          calculation: "W_0 = 950 \\times 0.5263 = 500, \\quad W_1 = 50 \\times 10.0 = 500",
          explanation: "Both classes exert exactly 500 units of influence on tree split evaluations.",
        },
      ],
      result: "Healthy weight = 0.526, Diseased weight = 10.0. Perfect empirical balance is achieved.",
    },
    rfConnection:
      "Setting class_weight='balanced_subsample' in RandomForestClassifier adjusts both node split criteria and leaf probability estimation across all trees without generating synthetic data or consuming extra memory.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=5000, weights=[0.98, 0.02], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# Train with dynamic bootstrap subsample reweighting
rf_weighted = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight='balanced_subsample',
    random_state=42,
    n_jobs=-1
)
rf_weighted.fit(X_train, y_train)

y_pred = rf_weighted.predict(X_test)
print(classification_report(y_test, y_pred, target_names=['Normal', 'Rare Event']))`,
    codeExplanation:
      "class_weight='balanced_subsample' recomputes weights independently within each tree's bootstrap replicate, adapting to local sample fluctuations.",
    application:
      "Semiconductor manufacturing fabs monitor wafer fabrication defects where fault rates are below 0.1%. Using balanced_subsample class weights catches 85% of defects without modifying production telemetry databases.",
    mistakes: [
      "Assuming class_weight modifies the dataset size (it only modifies loss and split criteria; dataset size is unchanged).",
      "Using class_weight='balanced' instead of 'balanced_subsample' on small minority sample sizes (subsample weighting handles local sampling noise better).",
      "Relying on raw classification accuracy to evaluate weighted models.",
    ],
    prosCons: {
      pros: [
        "Zero synthetic data generation or memory overhead.",
        "Preserves exact original feature relationships and geometry.",
        "Fastest imbalanced learning technique (no resampling steps).",
      ],
      cons: [
        "Can increase false positive rate without threshold tuning.",
        "Does not populate sparse regions of feature space like SMOTE.",
      ],
    },
    takeaways: [
      "Class weighting rescales the loss function: L_weighted = sum w_{y_i} L(y_i, y_hat_i).",
      "class_weight='balanced_subsample' adapts weights per bootstrap draw for optimal variance reduction.",
      "Custom class weights {0: 1, 1: 5} allow direct alignment with business cost matrices.",
    ],
    quiz: {
      prompt: "What is the key advantage of class_weight='balanced_subsample' over class_weight='balanced'?",
      options: [
        "It recalculates class weights dynamically inside each tree's individual bootstrap sample, adapting to local sampling fluctuations",
        "It generates synthetic minority samples using linear interpolation",
        "It completely deletes the majority class from training",
        "It forces all trees to have a maximum depth of 1",
      ],
      answerIndex: 0,
      explanation:
        "Because each tree in a Random Forest is trained on an independently drawn bootstrap sample, the local class proportions vary. class_weight='balanced_subsample' recomputes weights per tree to match each bootstrap draw's actual empirical ratio.",
    },
  },

  "smote": {
    slug: "smote",
    module: "12B",
    section: "Advanced Concepts",
    title: "SMOTE (Synthetic Minority Over-sampling)",
    intro:
      "SMOTE (Synthetic Minority Over-sampling Technique) creates artificial minority instances by linear vector interpolation between k-nearest minority neighbors, populating the minority feature space without exact duplication.",
    whyNecessary:
      "Random Oversampling duplicates exact samples, causing decision trees to create narrow, memorized leaves that overfit noise. SMOTE synthesizes continuous diversity along the minority manifold, allowing the ensemble to learn broader, robust decision boundaries.",
    intuition:
      "If you only have two photos of an endangered bird flying left and right, Random Oversampling simply makes photocopies of both photos. SMOTE mathematically estimates what the bird looks like mid-turn, creating new valid perspectives.",
    theory: [
      "Linear Vector Interpolation: For a given minority instance x_i, SMOTE identifies its k-nearest neighbors in minority space, randomly selects one neighbor x_zi, and creates a synthetic instance: x_new = x_i + lambda * (x_zi - x_i) with lambda ~ U(0,1).",
      "Overcoming Duplication Overfitting: Because synthetic instances occupy new coordinates on the line segment connecting real minority points, decision trees learn continuous boundaries instead of memorizing discrete duplicated points.",
      "Failure Modes & Limitations: If minority samples are noisy outliers located deep inside majority territory, standard SMOTE can synthesize points bridging across classes. Advanced variants like Borderline-SMOTE, SMOTE-Tomek, and SMOTE-ENN mitigate this by cleaning boundaries.",
      "Data Leakage Integrity: SMOTE MUST ONLY be applied to the training dataset after splitting. Applying SMOTE before splitting leaks information between folds and produces invalid, over-optimistic evaluation metrics. Use imblearn.pipeline.Pipeline to enforce strict cross-validation isolation.",
    ],
    readTime: "20 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "SMOTE Synthetic Vector Generation",
        expr: "\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\sim \\mathcal{U}(0, 1)",
        note: "x_i: seed minority sample; x_zi: randomly chosen neighbor from k-NN(x_i); λ: uniform random interpolation scalar.",
      },
      {
        label: "Euclidean Feature Distance",
        expr: "d(\\mathbf{x}_i, \\mathbf{x}_j) = \\sqrt{\\sum_{m=1}^{p} (x_{im} - x_{jm})^2}",
        note: "Distance metric used to construct the k-nearest neighbor graph among minority instances.",
      },
      {
        label: "Interpolation Distance Proportionality",
        expr: "d(\\mathbf{x}_i, \\mathbf{x}_{\\text{new}}) = \\lambda \\cdot d(\\mathbf{x}_i, \\mathbf{x}_{zi})",
        note: "Synthetic instance lies strictly along the segment at proportion λ from seed sample x_i.",
      },
    ],
    derivation: {
      title: "SMOTE Metric Space Convex Combination Derivation",
      description:
        "Mathematical derivation showing that SMOTE synthetic points are valid convex combinations guaranteed to lie on the line segment connecting real minority instances.",
      steps: [
        {
          step: "Define Minority Feature Manifold and k-NN Graph",
          math: "\\mathcal{D}_{\\text{min}} = \\{(\\mathbf{x}_i, y_i) \\in \\mathbb{R}^p \\times \\{1\\}\\}, \\quad \\mathcal{N}_k(\\mathbf{x}_i) = \\arg\\min_{S \\subset \\mathcal{D}_{\\text{min}} \\setminus \\{\\mathbf{x}_i\\}, |S|=k} \\sum_{\\mathbf{z} \\in S} \\|\\mathbf{x}_i - \\mathbf{z}\\|_2",
          note: "Constructs the local neighborhood of candidate interpolation partners for seed sample x_i.",
        },
        {
          step: "Convex Combination on Euclidean Line Segment",
          math: "\\mathbf{x}_{\\text{new}}(\\lambda) = (1 - \\lambda) \\mathbf{x}_i + \\lambda \\mathbf{x}_{zi} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\in [0, 1]",
          note: "Because λ is drawn from [0, 1], x_new is a strictly convex combination of x_i and x_zi, populating the interior of the minority class convex hull.",
        },
      ],
    },
    workedExample: {
      title: "Step-by-Step SMOTE Vector Generation in 2D Feature Space",
      problem:
        "A financial fraud dataset has 2 features: Transaction Amount x1 ($ x 10) and Transaction Velocity x2 (trans/hr). A seed fraudulent transaction is located at x_1 = [2.0, 3.5]. Three neighboring candidate fraud cases are x_2 = [3.0, 5.0], x_3 = [1.5, 4.0], and x_4 = [4.0, 2.0]. Using k = 2 nearest neighbors, compute Euclidean distances, select neighbor x_2, draw lambda = 0.40, and compute the synthetic sample coordinate x_new.",
      steps: [
        {
          title: "Compute Euclidean distances from seed sample x_1 = [2.0, 3.5]",
          calculation: "d(x_1, x_2) = \\sqrt{(3.0-2.0)^2 + (5.0-3.5)^2} = \\sqrt{1.0^2 + 1.5^2} = \\sqrt{3.25} \\approx 1.8028 \\\\ d(x_1, x_3) = \\sqrt{(1.5-2.0)^2 + (4.0-3.5)^2} = \\sqrt{(-0.5)^2 + 0.5^2} = \\sqrt{0.50} \\approx 0.7071 \\\\ d(x_1, x_4) = \\sqrt{(4.0-2.0)^2 + (2.0-3.5)^2} = \\sqrt{2.0^2 + (-1.5)^2} = \\sqrt{6.25} = 2.5000",
          explanation: "Comparing Euclidean distances: d(x_1, x_3) = 0.707 < d(x_1, x_2) = 1.803 < d(x_1, x_4) = 2.500.",
        },
        {
          title: "Identify k = 2 Nearest Neighbors and select x_zi",
          calculation: "\\mathcal{N}_2(\\mathbf{x}_1) = \\{\\mathbf{x}_3, \\mathbf{x}_2\\}, \\quad \\text{Algorithm randomly selects } \\mathbf{x}_{zi} = \\mathbf{x}_2 = [3.0, 5.0]",
          explanation: "Candidate pool consists of x_3 and x_2. SMOTE randomly samples x_2 for this interpolation step.",
        },
        {
          title: "Compute Difference Vector",
          calculation: "\\mathbf{v}_{\\text{diff}} = \\mathbf{x}_{zi} - \\mathbf{x}_1 = [3.0 - 2.0, \\; 5.0 - 3.5] = [1.0, \\; 1.5]",
          explanation: "Direction vector from x_1 toward x_2.",
        },
        {
          title: "Generate Synthetic Coordinate with lambda = 0.40",
          calculation: "\\mathbf{x}_{\\text{new}} = [2.0, \\; 3.5] + 0.40 \\times [1.0, \\; 1.5] = [2.0 + 0.40, \\; 3.5 + 0.60] = [2.40, \\; 4.10]",
          explanation: "Synthetic point x_new is positioned at (2.40, 4.10).",
        },
        {
          title: "Verify Collinearity and Euclidean Distance Proportion",
          calculation: "d(\\mathbf{x}_1, \\mathbf{x}_{\\text{new}}) = \\sqrt{(2.40-2.0)^2 + (4.10-3.5)^2} = \\sqrt{0.16 + 0.36} = \\sqrt{0.52} \\approx 0.7211 \\\\ \\lambda \\times d(\\mathbf{x}_1, \\mathbf{x}_2) = 0.40 \\times 1.8028 = 0.7211 \\quad (\\text{Exact match!})",
          explanation: "x_new lies precisely 40% of the distance from x_1 to x_2 along the line segment.",
        },
      ],
      result: "Synthetic instance x_new = [2.40, 4.10] successfully generated without copying existing points.",
    },
    rfConnection:
      "Pairing SMOTE with Random Forest via imblearn.pipeline.Pipeline provides structural diversity for tree construction, expanding decision boundaries while protecting cross-validation integrity.",
    code: `from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=5000, weights=[0.98, 0.02], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# Certified leak-free pipeline: SMOTE runs strictly on training fold
pipe_smote = ImbPipeline([
    ('smote', SMOTE(k_neighbors=5, random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipe_smote.fit(X_train, y_train)

y_pred = pipe_smote.predict(X_test)
print(classification_report(y_test, y_pred, target_names=['Normal', 'Minority']))`,
    codeExplanation:
      "ImbPipeline ensures that SMOTE synthesizes samples strictly on training folds, preserving untouched validation distributions.",
    application:
      "Rare genomics biomarker discovery uses SMOTE to augment scarce patient cohort samples (e.g. 30 rare disease cases vs 3,000 controls), generating continuous feature diversity for genetic signature extraction.",
    mistakes: [
      "Applying SMOTE before train-test splitting (causes catastrophic data leakage into test sets).",
      "Using standard SMOTE on categorical data (use SMOTE-NC instead).",
      "Using SMOTE when minority instances are extreme noisy outliers (causes bridging across classes).",
    ],
    prosCons: {
      pros: [
        "Avoids exact duplicate memorization associated with Random Oversampling.",
        "Populates sparse regions of minority feature space.",
        "Improves minority recall and decision boundary smoothness.",
      ],
      cons: [
        "Can synthesize noise if minority samples overlap with majority.",
        "Higher computational overhead than class weighting.",
      ],
    },
    takeaways: [
      "SMOTE generates synthetic samples via vector interpolation: x_new = x_i + lambda * (x_zi - x_i).",
      "Overcomes Random Oversampling's exact duplication overfitting flaw.",
      "Always execute SMOTE strictly inside training folds using imblearn.pipeline.Pipeline.",
    ],
    quiz: {
      prompt: "How does SMOTE select the location of a new synthetic minority observation?",
      options: [
        "At a random point along the line segment connecting a seed minority instance to one of its k-nearest minority neighbors",
        "At the exact arithmetic mean of the entire dataset",
        "By duplicating an existing minority observation without changes",
        "By randomly deleting majority observations",
      ],
      answerIndex: 0,
      explanation:
        "SMOTE computes x_new = x_i + lambda * (x_zi - x_i) where lambda is drawn uniformly from [0, 1] and x_zi is a k-nearest neighbor from the minority class. This places x_new strictly on the line segment connecting x_i and x_zi.",
    },
  },


  "hyperparameter-optimization": {
    slug: "hyperparameter-optimization",
    module: "13",
    section: "Advanced Concepts",
    title: "Hyperparameter Optimization",
    intro:
      "Hyperparameter optimization is the systematic search for the configuration of hyperparameters that minimizes out-of-sample generalization error across cross-validation folds.",
    whyNecessary:
      "Default settings rarely produce peak performance for complex tabular domains. Systematic optimization discovers synergies between tree depth, feature sampling, and leaf constraints while preventing data leakage.",
    intuition:
      "Imagine finding the combination to a safe. Grid Search tests every combination systematically in sequential order. Random Search tests random combinations scattered across the space, frequently hitting winning combinations in a fraction of the time.",
    theory: [
      "GridSearchCV performs an exhaustive search over a specified Cartesian grid of hyperparameter values, evaluating every combination using K-fold cross-validation.",
      "RandomizedSearchCV samples a fixed number of parameter configurations from specified probability distributions. Bergstra and Bengio (2012) proved that Random Search is dramatically more efficient because in real ML models, only a subset of hyperparameters have high dimension importance.",
      "Cross-Validation Data Leakage: Hyperparameter tuning must be performed strictly within the training folds. Preprocessing steps (scaling, imputation, encoding) must be wrapped inside a Pipeline to ensure no test data leaks into parameter selection.",
      "Nested Cross-Validation: When evaluating the true performance of a tuned model, an outer K-fold loop assesses model generalization while an inner K-fold loop conducts the parameter search.",
    ],
    readTime: "15 min",
    difficulty: "Advanced",
    formulas: [
      {
        label: "Hyperparameter Optimization Objective",
        expr: "\\theta^* = \\operatorname{argmin}_{\\theta \\in \\Theta} \\frac{1}{K} \\sum_{k=1}^{K} \\mathcal{L}(f_{\\theta}(D_{\\text{train},-k}), D_{\\text{val},k})",
        note: "Find configuration θ that minimizes average validation fold loss.",
      },
      {
        label: "Random Search Coverage Probability",
        expr: "P(\\text{Within top } 5\\%) = 1 - (1 - 0.05)^M \\ge 0.95 \\implies M \\ge 59",
        note: "With only 59 random iterations, there is a 95% probability of finding a solution in the top 5% of configurations!",
      },
    ],
    workedExample: {
      title: "Grid Search vs Random Search Computational Cost",
      problem:
        "Suppose we tune 4 hyperparameters: n_estimators (4 values), max_depth (5 values), min_samples_split (4 values), and max_features (3 values) with 5-fold cross-validation. Compare the total model fits for Grid Search vs Random Search (M = 30 iterations).",
      steps: [
        {
          title: "Compute Grid Search combinations",
          calculation: "\\text{Combinations} = 4 \\times 5 \\times 4 \\times 3 = 240 \\text{ configurations}",
          explanation: "Cartesian product of all candidate parameter levels.",
        },
        {
          title: "Compute Grid Search total model fits with 5 folds",
          calculation: "\\text{Fits}_{\\text{grid}} = 240 \\times 5 = 1,200 \\text{ trained forests}",
          explanation: "At 1 second per forest, this requires 20 minutes.",
        },
        {
          title: "Compute Random Search total model fits (M = 30)",
          calculation: "\\text{Fits}_{\\text{random}} = 30 \\times 5 = 150 \\text{ trained forests}",
          explanation: "87.5% reduction in compute time while covering more continuous parameter values!",
        },
      ],
      result: "Random Search completes in 150 fits vs 1,200 for Grid Search (8x faster).",
    },
    rfConnection:
      "Tuning Random Forest via RandomizedSearchCV allows simultaneously optimizing n_estimators, max_features, max_depth, and min_samples_leaf in parallel.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV
from sklearn.datasets import load_breast_cancer
from scipy.stats import randint

X, y = load_breast_cancer(return_X_y=True)

param_dist = {
    'n_estimators': randint(100, 400),
    'max_features': ['sqrt', 'log2', 0.3, 0.5],
    'max_depth': [None, 10, 15, 20],
    'min_samples_split': randint(2, 10),
    'min_samples_leaf': randint(1, 6)
}

search = RandomizedSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=25,
    cv=3,
    scoring='roc_auc',
    n_jobs=-1,
    random_state=42
)
search.fit(X, y)
print("Optimal Hyperparameters:", search.best_params_)
print(f"Best CV ROC-AUC Score : {search.best_score_:.4f}")`,
    codeExplanation:
      "RandomizedSearchCV draws parameter configurations from continuous and discrete distributions, evaluating 25 candidate configurations using 3-fold cross validation.",
    application:
      "AutoML platforms utilize randomized and Bayesian hyperparameter optimization to automatically tune enterprise Random Forest pipelines across thousands of cloud instances.",
    mistakes: [
      "Running Grid Search across a dense grid of n_estimators (tuning n_estimators is rarely critical; set it to 200-300 and tune max_features and min_samples_leaf instead).",
      "Preprocessing the full dataset prior to cross-validation (this leaks validation target distributions into training folds).",
      "Using accuracy as the tuning score on imbalanced datasets.",
    ],
    prosCons: {
      pros: [
        "Unlocks the absolute peak predictive accuracy of the model.",
        "Random search explores continuous parameter distributions effectively.",
        "Fully parallelizable across all CPU cores.",
      ],
      cons: [
        "Computationally intensive for massive datasets.",
        "Risk of overfitting the cross-validation score if millions of configurations are evaluated.",
      ],
    },
    takeaways: [
      "RandomizedSearchCV is dramatically more efficient than exhaustive GridSearchCV across multi-dimensional spaces.",
      "Focus tuning efforts on max_features, min_samples_leaf, and max_depth.",
      "Always wrap preprocessing and modeling into an sklearn Pipeline to prevent data leakage during tuning.",
    ],
    quiz: {
      prompt: "According to Bergstra & Bengio (2012), why does Random Search consistently outperform Grid Search for hyperparameter tuning?",
      options: [
        "Because most machine learning problems have low effective dimensionality (only a few hyperparameters truly impact performance for a given dataset)",
        "Because Random Search always finds the exact global mathematical optimum",
        "Because Grid Search cannot evaluate integer hyperparameters",
        "Because Random Search disables cross-validation to save time",
      ],
      answerIndex: 0,
      explanation:
        "In most models, only 1 or 2 hyperparameters heavily dominate performance on a given dataset. Grid search wastes dozens of evaluations testing identical values of the important parameter, whereas random search tests a unique value of the important parameter on every single trial.",
    },
  },

  "classification-project": {
    slug: "classification-project",
    module: "P1",
    section: "Practical Learning",
    title: "Practical Classification Project",
    intro:
      "An end-to-end, production-grade classification project implementing a Random Forest pipeline to diagnose breast cancer from cell nucleus biopsy measurements using Scikit-Learn.",
    whyNecessary:
      "Understanding theoretical algorithms is incomplete without mastering end-to-end practical workflows: exploratory data analysis, train-test splitting, baseline benchmarking, cross-validation, hyperparameter tuning, and diagnostic metric evaluation.",
    intuition:
      "A clinical decision support tool must provide high sensitivity (Recall) to ensure no malignant tumors are missed, while maintaining strong Precision to minimize unnecessary invasive biopsies.",
    theory: [
      "The Breast Cancer Wisconsin dataset contains 569 instances with 30 real-valued continuous features computed from digitized images of fine needle aspirates (FNA) of breast masses.",
      "Classes: 357 Benign (62.7%), 212 Malignant (37.3%).",
      "Evaluation Metrics: In diagnostic medicine, False Negatives (predicting Benign when the patient has Cancer) can be fatal. Hence, Recall for the malignant class and ROC-AUC are the primary metrics.",
      "Benchmark Comparison: We compare a single unconstrained Decision Tree against a tuned Random Forest Classifier to demonstrate empirical variance reduction and accuracy gain.",
    ],
    readTime: "25 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Diagnostic Recall (Sensitivity)",
        expr: "\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}",
        note: "Fraction of actual malignant tumors correctly detected.",
      },
      {
        label: "Diagnostic Precision (Positive Predictive Value)",
        expr: "\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}",
        note: "Fraction of positive diagnoses that are truly malignant.",
      },
      {
        label: "ROC-AUC Metric",
        expr: "\\operatorname{ROC-AUC} = \\int_0^1 \\operatorname{TPR}(t) \\, d(\\operatorname{FPR}(t))",
        note: "Area under the True Positive Rate vs False Positive Rate curve across all thresholds.",
      },
    ],
    workedExample: {
      title: "Baseline Decision Tree vs Tuned Random Forest Comparison",
      problem:
        "On held-out Wisconsin test data (N = 143: 90 Benign, 53 Malignant), Model A (Single Tree) misses 6 cancers (FN = 6). Model B (Random Forest) misses 1 cancer (FN = 1). Calculate malignant recall for both models.",
      steps: [
        {
          title: "Compute Single Tree Recall (FN = 6, TP = 47)",
          calculation: "\\text{Recall}_{\\text{Tree}} = \\frac{47}{47 + 6} = \\frac{47}{53} = 0.8868 \\; (88.7\\%)",
          explanation: "Single tree misses over 11% of malignant cases.",
        },
        {
          title: "Compute Random Forest Recall (FN = 1, TP = 52)",
          calculation: "\\text{Recall}_{\\text{RF}} = \\frac{52}{52 + 1} = \\frac{52}{53} = 0.9811 \\; (98.1\\%)",
          explanation: "Random Forest catches 98.1% of all malignant cases.",
        },
        {
          title: "Compute Relative Risk Reduction in Missed Diagnoses",
          calculation: "\\frac{6 - 1}{6} \\times 100 = 83.3\\%",
          explanation: "Random Forest reduced missed cancer diagnoses by 83.3%!",
        },
      ],
      result: "Random Forest achieves 98.1% recall vs 88.7% for the baseline decision tree.",
    },
    rfConnection:
      "Demonstrates how ensemble averaging directly enhances diagnostic sensitivity in mission-critical medical classifications.",
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import numpy as np

# 1. Load Data
X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# 2. Baseline Model: Single Decision Tree
tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train, y_train)
tree_acc = tree.score(X_test, y_test)

# 3. Production Model: Random Forest
rf = RandomForestClassifier(n_estimators=200, max_features='sqrt', oob_score=True, random_state=42)
rf.fit(X_train, y_train)
rf_acc = rf.score(X_test, y_test)
rf_probs = rf.predict_proba(X_test)[:, 1]
rf_auc = roc_auc_score(y_test, rf_probs)

print(f"--- RESULTS ---")
print(f"Decision Tree Accuracy : {tree_acc * 100:.2f}%")
print(f"Random Forest Accuracy : {rf_acc * 100:.2f}%")
print(f"Random Forest OOB Score: {rf.oob_score_ * 100:.2f}%")
print(f"Random Forest ROC-AUC  : {rf_auc:.4f}")
print("\\nConfusion Matrix:\\n", confusion_matrix(y_test, rf.predict(X_test)))`,
    codeExplanation:
      "This complete workflow benchmarks a single decision tree against Random Forest, demonstrating the empirical accuracy improvement from ~91% to >97%.",
    application:
      "Deployed diagnostic models assist oncologists in secondary verification of breast biopsy pathology reports.",
    mistakes: [
      "Evaluating diagnostic models without class stratification during train-test splitting.",
      "Optimizing for raw accuracy rather than Recall and ROC-AUC.",
      "Failing to examine the confusion matrix for false negative counts.",
    ],
    prosCons: {
      pros: [
        "Outstanding clinical diagnostic accuracy.",
        "Provides well-behaved probability scores for doctor review.",
        "Built-in feature importance highlights critical nuclear perimeter metrics.",
      ],
      cons: [
        "Cannot replace human pathology verification.",
      ],
    },
    takeaways: [
      "Random Forest significantly outperforms single decision trees in medical classification.",
      "OOB score closely mirrors true held-out test accuracy.",
      "Precision and Recall provide the true picture of clinical diagnostic efficacy.",
    ],
    quiz: {
      prompt: "In a medical diagnosis classification project where missing a malignant tumor has catastrophic consequences, which metric should be prioritized?",
      options: [
        "Recall (Sensitivity) for the malignant class",
        "Raw classification accuracy",
        "Mean Absolute Error",
        "Training speed",
      ],
      answerIndex: 0,
      explanation:
        "Recall measures the proportion of actual positive cancer cases that were correctly identified. A high recall guarantees that virtually no malignant tumors are missed (low False Negatives).",
    },
  },

  "regression-project": {
    slug: "regression-project",
    module: "P2",
    section: "Practical Learning",
    title: "Practical Regression Project",
    intro:
      "An end-to-end regression project applying Random Forest to predict median California house values from census block demographic and geographic features using Scikit-Learn.",
    whyNecessary:
      "Continuous valuation requires handling multi-scale features, spatial coordinates (latitude and longitude), non-linear income relationships, and robust residual error analysis.",
    intuition:
      "Housing values depend heavily on geographic micro-markets and non-linear thresholds (e.g. proximity to the ocean). While linear regression fails to capture localized geographic boundaries, decision trees naturally partition coordinates into neighborhood pockets.",
    theory: [
      "Dataset: California Housing dataset (20,640 census block groups, 8 numeric features).",
      "Features: Median Income, Housing Median Age, Average Rooms, Average Bedrooms, Population, Average Occupancy, Latitude, Longitude.",
      "Target: Median House Value (continuous, in units of $100,000).",
      "Evaluation Metrics: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Coefficient of Determination (R²).",
      "Residual Diagnostics: Inspecting residuals (y - ŷ) confirms whether model errors are homoscedastic or exhibit systematic bias at extreme price ranges.",
    ],
    readTime: "25 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Mean Absolute Error (MAE)",
        expr: "\\operatorname{MAE} = \\frac{1}{N} \\sum_{i=1}^{N} |y_i - \\hat{y}_i|",
        note: "Average absolute prediction error in original target units ($100k).",
      },
      {
        label: "Coefficient of Determination (R²)",
        expr: "R^2 = 1 - \\frac{\\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^{N} (y_i - \\bar{y})^2}",
        note: "Proportion of target variance explained by the model (1.0 = perfect fit).",
      },
    ],
    workedExample: {
      title: "Linear Regression vs Random Forest Housing Valuation",
      problem:
        "On California Housing validation data, Linear Regression yields R² = 0.605 and RMSE = 0.72. Random Forest Regressor yields R² = 0.815 and RMSE = 0.49. Calculate the percentage reduction in prediction error.",
      steps: [
        {
          title: "Compare RMSE errors",
          calculation: "\\Delta \\text{RMSE} = 0.72 - 0.49 = 0.23 \\; (\\$23,000 \\text{ lower error per house})",
          explanation: "Random Forest reduces root mean squared error by $23,000.",
        },
        {
          title: "Calculate relative RMSE reduction",
          calculation: "\\frac{0.72 - 0.49}{0.72} \\times 100 = 31.94\\%",
          explanation: "A 32% reduction in prediction error.",
        },
        {
          title: "Compare Unexplained Variance (1 - R²)",
          calculation: "1 - R^2_{\\text{LR}} = 0.395, \\quad 1 - R^2_{\\text{RF}} = 0.185 \\implies \\frac{0.395 - 0.185}{0.395} \\times 100 = 53.16\\%",
          explanation: "Random Forest eliminated more than half of the unexplained variance remaining from linear regression!",
        },
      ],
      result: "Random Forest cuts unexplained variance by 53.2% and lowers RMSE by 32%.",
    },
    rfConnection:
      "Demonstrates Random Forest's natural capability to handle complex non-linear spatial interactions (latitude x longitude) without manual feature engineering.",
    code: `from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import numpy as np

# 1. Fetch data
X, y = fetch_california_housing(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X[:5000], y[:5000], test_size=0.2, random_state=42)

# 2. Linear Regression Baseline
lr = LinearRegression()
lr.fit(X_train, y_train)
lr_pred = lr.predict(X_test)

# 3. Random Forest Regressor
rf = RandomForestRegressor(n_estimators=150, max_features=0.5, random_state=42)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)

print(f"Linear Regression R2 : {r2_score(y_test, lr_pred):.4f} | MAE: {mean_absolute_error(y_test, lr_pred):.4f}")
print(f"Random Forest     R2 : {r2_score(y_test, rf_pred):.4f} | MAE: {mean_absolute_error(y_test, rf_pred):.4f}")`,
    codeExplanation:
      "Comparing LinearRegression against RandomForestRegressor demonstrates how tree ensembles capture non-linear relationships that linear models completely miss.",
    application:
      "Commercial real estate valuation platforms and property tax assessment algorithms use Random Forest regressors to predict fair market value across millions of residential parcels.",
    mistakes: [
      "Assuming R² cannot be negative (a model predicting worse than the mean target will produce R² < 0).",
      "Ignoring the target cap (California housing dataset caps prices at $500,000, creating an artificial horizontal boundary in residual plots).",
      "Failing to compare MAE with RMSE to detect the presence of extreme outlier errors.",
    ],
    prosCons: {
      pros: [
        "Seamlessly models localized geographic boundaries (lat/long).",
        "Requires no feature scaling or polynomial transformations.",
        "Significantly outperforms linear baselines on tabular data.",
      ],
      cons: [
        "Cannot predict prices above the historical maximum training value.",
        "Prediction latency is higher than evaluating a simple linear equation.",
      ],
    },
    takeaways: [
      "Random Forest handles non-linear spatial relationships naturally.",
      "R² measures proportion of variance explained; MAE measures average magnitude of dollar error.",
      "Always inspect residual plots for systematic bias at the extremes of the target distribution.",
    ],
    quiz: {
      prompt: "What does an R² (Coefficient of Determination) value of 0.82 signify in a housing regression project?",
      options: [
        "The model accounts for 82% of the variance in housing prices around the mean",
        "82% of the house price predictions were 100% exact to the penny",
        "The model makes an average error of $82",
        "The model was trained on 82 decision trees",
      ],
      answerIndex: 0,
      explanation:
        "R² measures the proportion of total variation in the target variable y that is successfully explained by the model features. An R² of 0.82 indicates that 82% of the variance is captured by the forest.",
    },
  },

  "algorithm-comparison": {
    slug: "algorithm-comparison",
    module: "14",
    section: "Practical Learning",
    title: "Algorithm Comparison",
    intro:
      "A comprehensive comparative analysis benchmarking Random Forest against single Decision Trees, Extra Trees, AdaBoost, Gradient Boosted Decision Trees (GBDT), XGBoost, LightGBM, and CatBoost.",
    whyNecessary:
      "No single machine learning model dominates all problems. Selecting the optimal algorithm requires balancing training time, memory consumption, inference latency, parameter sensitivity, and predictive performance.",
    intuition:
      "If Decision Tree is a lone scout, Random Forest is a synchronized army marching in parallel, and Gradient Boosting is a team of specialists where each successive member meticulously corrects the exact mistakes made by the previous member.",
    theory: [
      "Random Forest vs Decision Trees: Trees have high variance; Random Forest reduces variance via bootstrap aggregation and random subspace selection.",
      "Random Forest vs Extra Trees (Extremely Randomized Trees): Extra Trees draws random split thresholds without searching for the optimal cut point, reducing variance and accelerating training at the cost of a slight increase in bias.",
      "Random Forest vs Boosting (AdaBoost, XGBoost, LightGBM, CatBoost): Random Forest builds independent trees in parallel to reduce variance. Boosting builds shallow trees sequentially on gradient residuals to reduce bias.",
      "Hyperparameter Sensitivity: Random Forest is notoriously robust to default hyperparameters. Boosting algorithms (especially XGBoost and LightGBM) are highly sensitive to learning rate η, tree depth, and subsample ratios, requiring careful tuning.",
    ],
    readTime: "16 min",
    difficulty: "Intermediate",
    formulas: [
      {
        label: "Random Forest Aggregation (Parallel)",
        expr: "f_{\\text{rf}}(x) = \\frac{1}{B} \\sum_{b=1}^{B} T_b(x)",
        note: "Trees trained independently in parallel. Targets variance reduction.",
      },
      {
        label: "Gradient Boosting Aggregation (Sequential)",
        expr: "F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x)",
        note: "Trees trained sequentially on residuals. Targets bias and variance reduction.",
      },
    ],
    workedExample: {
      title: "Decision Tree vs Random Forest vs Gradient Boosting Performance",
      problem:
        "Compare Decision Tree, Random Forest, and Gradient Boosting on a benchmark dataset across accuracy, training speed, and hyperparameter sensitivity.",
      steps: [
        {
          title: "Decision Tree",
          calculation: "\\text{Accuracy} = 84.5\\%, \\quad \\text{Train Time} = 0.05s, \\quad \\text{Variance} = \\text{High}",
          explanation: "Fastest training, but lowest generalization accuracy.",
        },
        {
          title: "Random Forest",
          calculation: "\\text{Accuracy} = 93.2\\%, \\quad \\text{Train Time} = 0.85s, \\quad \\text{Variance} = \\text{Low}",
          explanation: "Huge accuracy boost, excellent out-of-the-box defaults, zero tuning required.",
        },
        {
          title: "Gradient Boosting (Tuned)",
          calculation: "\\text{Accuracy} = 94.1\\%, \\quad \\text{Train Time} = 1.45s, \\quad \\text{Tuning Required} = \\text{High}",
          explanation: "Highest accuracy, but requires systematic hyperparameter optimization.",
        },
      ],
      result: "Random Forest provides 90%+ of the benefits of boosting with virtually zero hyperparameter sensitivity.",
    },
    rfConnection:
      "Establishes when to choose Random Forest (rapid baselines, noisy tabular data, parallel training) versus modern gradient boosting frameworks like XGBoost or LightGBM.",
    code: `from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, GradientBoostingClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score
import time

X, y = make_classification(n_samples=2000, n_features=25, random_state=42)

models = {
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Extra Trees": ExtraTreesClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
}

for name, model in models.items():
    t0 = time.time()
    scores = cross_val_score(model, X, y, cv=3)
    elapsed = time.time() - t0
    print(f"{name:18} | Accuracy: {scores.mean():.4f} | Time: {elapsed:.2f}s")`,
    codeExplanation:
      "Benchmarking four distinct tree algorithms across accuracy and training time illustrates their operational tradeoffs.",
    application:
      "Enterprise machine learning teams use Random Forest as their primary rapid benchmark before deciding whether to spend engineering weeks tuning complex boosted ensembles.",
    mistakes: [
      "Assuming Gradient Boosting always beats Random Forest (on noisy datasets, boosting can overfit noise rapidly).",
      "Believing Random Forest cannot be parallelized (unlike boosting, Random Forest is embarrassingly parallel).",
      "Treating Extra Trees as identical to Random Forest (Extra Trees draws cut points completely at random without optimizing threshold splits).",
    ],
    prosCons: {
      pros: [
        "Incredibly robust to default hyperparameter settings.",
        "Embarrassingly parallel training across infinite CPU cores.",
        "Significantly less prone to overfitting on noisy data than boosting.",
      ],
      cons: [
        "Tuned Gradient Boosting often achieves 1-2% higher peak accuracy on clean tabular datasets.",
        "Higher memory consumption than shallow gradient boosting trees.",
      ],
    },
    takeaways: [
      "Random Forest trains independent trees in parallel to reduce variance.",
      "Gradient Boosting trains sequential trees on negative gradients to reduce bias.",
      "Use Random Forest for robust, low-maintenance tabular modeling with excellent defaults.",
    ],
    quiz: {
      prompt: "Unlike Gradient Boosting (GBDT), how are the individual trees in a Random Forest trained?",
      options: [
        "Independently and concurrently in parallel",
        "Sequentially, where each tree fits the residual error of the prior tree",
        "Using backpropagation and stochastic gradient descent",
        "Without any training data",
      ],
      answerIndex: 0,
      explanation:
        "Random Forest is a bagging ensemble where all trees are constructed completely independently of one another in parallel. Boosting algorithms construct trees sequentially, fitting each new estimator to the residual errors of prior estimators.",
    },
  },

  "applications": {
    slug: "applications",
    module: "15",
    section: "Practical Learning",
    title: "Real-World Applications",
    intro:
      "Random Forest is deployed across major mission-critical industries, from banking credit risk and healthcare diagnostics to satellite remote sensing and predictive manufacturing maintenance.",
    whyNecessary:
      "Understanding abstract machine learning algorithms requires seeing how they integrate into real enterprise business architectures with operational constraints, latency SLAs, and regulatory compliance.",
    intuition:
      "Whether determining if a bank loan should be granted, assessing crop health from orbit, or predicting when a jet engine needs service, Random Forest transforms noisy tabular measurements into decisive automated actions.",
    theory: [
      "Financial Services & Credit Scoring: Tabular applicant data (income, debt-to-income, credit inquiries) are evaluated to assign creditworthiness scores with regulatory feature explanations.",
      "Healthcare & Oncology: Clinical labs classify patient tumor pathology using cytological imaging measurements, requiring high recall and probabilistic uncertainty estimates.",
      "Predictive Maintenance & IoT: Telemetry sensor logs from industrial turbines and heavy machinery are monitored in real time to predict component failure days before catastrophic breakdown.",
      "E-Commerce & Churn Prediction: Customer interaction logs (login frequency, cart abandonment, support tickets) are scored to trigger automated retention incentives.",
      "Cybersecurity & Threat Detection: High-throughput packet inspect algorithms flag zero-day malware traffic in corporate VPN networks.",
    ],
    readTime: "12 min",
    difficulty: "Beginner",
    formulas: [
      {
        label: "Expected Financial Cost Function",
        expr: "\\mathbb{E}[\\text{Cost}] = C_{\\text{FP}} \\cdot \\text{FP} + C_{\\text{FN}} \\cdot \\text{FN}",
        note: "Optimizing decision thresholds according to asymmetric business costs (e.g. C_FN >> C_FP in fraud).",
      },
    ],
    workedExample: {
      title: "Cost-Sensitive Decision Threshold for Banking Credit Default",
      problem:
        "A bank loses $10,000 on a defaulted loan (False Negative) but only loses $200 in potential interest on an approved applicant who is rejected (False Positive). Should the threshold be set to 0.50 or 0.15?",
      steps: [
        {
          title: "Assess threshold = 0.50",
          calculation: "\\text{FP} = 20, \\; \\text{FN} = 8 \\implies \\text{Cost} = (20 \\times \\$200) + (8 \\times \\$10,000) = \\$4,000 + \\$80,000 = \\$84,000",
          explanation: "High default loss due to missed risky borrowers.",
        },
        {
          title: "Assess threshold = 0.15",
          calculation: "\\text{FP} = 60, \\; \\text{FN} = 1 \\implies \\text{Cost} = (60 \\times \\$200) + (1 \\times \\$10,000) = \\$12,000 + \\$10,000 = \\$22,000",
          explanation: "Accepting more false alarms dramatically slashes default catastrophe.",
        },
      ],
      result: "Threshold 0.15 saves the bank $62,000 (a 73.8% financial cost reduction).",
    },
    rfConnection:
      "Random Forest outputs well-behaved probabilities that allow businesses to easily adjust classification thresholds to align with custom asymmetric dollar costs.",
    code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Simulated credit risk model scoring
np.random.seed(42)
X_applicant = np.array([[720, 65000, 0.28, 2]]) # FICO, Income, DTI, Inquiries

# Simulated trained forest model
rf = RandomForestClassifier(n_estimators=100, random_state=42)
# In production, predict_proba returns default likelihood:
# default_prob = rf.predict_proba(X_applicant)[0, 1]
default_prob = 0.08  # 8% risk

# Apply business risk threshold of 10%
decision = "Approved" if default_prob < 0.10 else "Rejected"
print(f"Default Probability : {default_prob * 100:.1f}%")
print(f"Underwriting Decision: {decision}")`,
    codeExplanation:
      "Deploying model probabilities into business rules engines allows precise thresholding aligned with financial risk appetite.",
    application:
      "Global payment networks screen over 1 billion credit card transactions every 24 hours using distributed Random Forest microservices.",
    mistakes: [
      "Deploying models with a default 0.5 threshold without consulting domain business costs.",
      "Failing to monitor feature drift over time (e.g. inflation changing income scales).",
      "Treating Random Forest as suitable for unformatted raw audio or computer vision pixels (deep learning is better suited for unstructured media).",
    ],
    prosCons: {
      pros: [
        "Unmatched reliability on structured, tabular enterprise data.",
        "Minimal data preprocessing required (handles missing values, scale differences).",
        "Generates feature importances for regulatory compliance.",
      ],
      cons: [
        "Not suited for raw perceptual inputs like high-resolution video or natural language.",
      ],
    },
    takeaways: [
      "Random Forest is the premier gold standard for enterprise tabular data across industries.",
      "Align probability thresholds with asymmetric financial and operational costs.",
      "Model governance requires regular monitoring of feature importance and drift in production.",
    ],
    quiz: {
      prompt: "For which of the following real-world data types is Random Forest most strongly recommended over deep convolutional networks?",
      options: [
        "Structured tabular databases (e.g., customer churn logs, credit applicant profiles, medical lab metrics)",
        "Raw RGB video streaming feeds",
        "High-fidelity raw audio waveforms",
        "Unstructured raw text corpora",
      ],
      answerIndex: 0,
      explanation:
        "Random Forest reigns supreme on structured tabular datasets containing heterogeneous feature types, varying numerical scales, and complex non-linear interactions. Deep learning architectures are superior for high-dimensional unstructured perceptual data like audio, image, and raw text.",
    },
  },
};

export const roadmap = [
  { n: "01", title: "Ensemble Foundations", desc: "Ensembles, wisdom of crowds and Condorcet jury theorem.", time: "45 min", status: "Available" },
  { n: "02", title: "Decision Trees", desc: "Recursive binary partitioning, Gini impurity and Information Gain.", time: "1 h 10 min", status: "Available" },
  { n: "03", title: "Random Forest Architecture", desc: "Bootstrap row sampling, random feature subspaces and aggregation.", time: "1 h", status: "Available" },
  { n: "04", title: "Mathematical Foundations", desc: "Probability, asymptotic limits, variance and error decomposition.", time: "1 h 30 min", status: "Available" },
  { n: "05", title: "Classification & Regression", desc: "Majority voting, probability averaging and continuous tree means.", time: "1 h", status: "Available" },
  { n: "06", title: "Advanced Techniques", desc: "Out-of-Bag validation, feature importance, imbalance and tuning.", time: "1 h 20 min", status: "Available" },
  { n: "07", title: "Python Implementation", desc: "Production Scikit-Learn workflows, tuning and serialization.", time: "2 h", status: "Available" },
  { n: "08", title: "Real-World Projects", desc: "End-to-end classification and regression case studies.", time: "1 h 15 min", status: "Available" },
] as const;

export const featuredModules = [
  { n: "01", title: "Understanding Ensemble Learning", desc: "How committees of models outperform individual learners.", topics: 4, time: "45 min", to: "/ensemble-learning" },
  { n: "02", title: "Decision Trees from Scratch", desc: "Recursive partitioning, Gini, entropy and information gain.", topics: 6, time: "1 h 10 min", to: "/decision-trees" },
  { n: "03", title: "How Random Forest Works", desc: "Bootstrap samples, random subspaces and aggregation.", topics: 5, time: "1 h", to: "/random-forest" },
  { n: "04", title: "Mathematical Foundations", desc: "Probability, expectation, variance and ensemble theory.", topics: 10, time: "1 h 30 min", to: "/mathematical-deep-dive" },
  { n: "05", title: "Classification & Regression", desc: "Majority voting, averaging and evaluation.", topics: 6, time: "1 h", to: "/classification" },
  { n: "06", title: "Advanced Random Forest Techniques", desc: "OOB error, feature importance, imbalance and tuning.", topics: 4, time: "1 h 20 min", to: "/advanced-techniques" },
] as const;
