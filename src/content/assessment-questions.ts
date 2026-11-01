export interface AssessmentQuestion {
  id: string;
  category: "Conceptual" | "Mathematical" | "Algorithmic" | "Practical";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // =========================================================================
  // --- CONCEPTUAL (10 Questions: 7 Beginner, 3 Intermediate) ---
  // =========================================================================
  {
    id: "c-1",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "Why does an ensemble of decorrelated decision trees achieve lower prediction variance than an individual tree?",
    options: [
      "Averaging independent or decorrelated estimators cancels out random idiosyncrasies and noise fluctuations",
      "Ensembles automatically delete all outliers from the training set",
      "Individual trees in an ensemble are forced to use linear regression",
      "Because voting changes the model's fundamental loss function from squared error to cross-entropy",
    ],
    answerIndex: 0,
    explanation:
      "When estimators are decorrelated, their errors are scattered in different directions. Taking their mean or majority vote causes random mistakes to average toward zero, leaving the persistent predictive signal intact.",
  },
  {
    id: "c-2",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "What is the key difference between standard Bagging and Leo Breiman's Random Forest?",
    options: [
      "Random Forest additionally samples a random subset of candidate features at each split to decorrelate trees",
      "Bagging uses decision trees while Random Forest uses deep neural networks",
      "Bagging samples without replacement while Random Forest samples with replacement",
      "Random Forest trains trees sequentially while Bagging trains trees in parallel",
    ],
    answerIndex: 0,
    explanation:
      "Pure Bagging considers all p features at every node split, which often causes all trees to choose the same dominant feature. Random Forest restricts each split to a random candidate subset of m features (e.g. √p), decorrelating tree structures.",
  },
  {
    id: "c-3",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "What does the Condorcet Jury Theorem prove regarding majority voting ensembles?",
    options: [
      "If individual estimators are independent with accuracy p > 0.5, majority voting accuracy approaches 1.0 as the number of estimators approaches infinity",
      "Ensembles can only function if all base estimators have 100% individual accuracy",
      "Adding more models always causes severe overfitting",
      "The majority vote is always equal to the median of the feature matrix",
    ],
    answerIndex: 0,
    explanation:
      "The Condorcet Jury Theorem mathematically establishes that if independent voters have p > 0.5 probability of making the correct decision, the cumulative probability of majority consensus being correct strictly increases with committee size, converging to 1.0.",
  },
  {
    id: "c-4",
    category: "Conceptual",
    difficulty: "Intermediate",
    question: "Which of the following statements about Random Forest and the Bias-Variance tradeoff is TRUE?",
    options: [
      "Random Forest uses low-bias, high-variance base trees and reduces variance via ensemble averaging",
      "Random Forest uses high-bias, low-variance base trees and reduces bias via boosting",
      "Random Forest increases both bias and variance simultaneously",
      "Random Forest completely eliminates irreducible noise σ²_ε",
    ],
    answerIndex: 0,
    explanation:
      "Random Forest grows individual decision trees deep without pruning, maintaining low bias. Averaging B decorrelated trees drives down variance toward the correlation floor ρσ².",
  },
  {
    id: "c-5",
    category: "Conceptual",
    difficulty: "Intermediate",
    question: "Can increasing the number of trees (n_estimators) in a Random Forest cause the model to overfit?",
    options: [
      "No; by the Law of Large Numbers, predictions converge to a finite expectation and variance cannot increase",
      "Yes; having more than 50 trees always causes memorization of training data",
      "Yes, but only if the trees are trained on GPU",
      "Yes, because tree depth automatically doubles for every 100 trees added",
    ],
    answerIndex: 0,
    explanation:
      "Leo Breiman proved using the Strong Law of Large Numbers that as n_estimators → ∞, the generalization error converges to a fixed limiting bound. Adding trees stabilizes predictions and never causes overfitting.",
  },
  {
    id: "c-6",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "Why is Random Forest considered a non-parametric model?",
    options: [
      "It makes no rigid assumptions about the mathematical functional form (e.g. linearity or normality) of the underlying data distribution",
      "It has zero hyperparameters to tune",
      "It does not require any training data",
      "It only outputs integer parameters",
    ],
    answerIndex: 0,
    explanation:
      "Non-parametric models do not assume a predefined mathematical form for the mapping function f(X). Instead, they adapt their structure dynamically to the complexity of the empirical data.",
  },
  {
    id: "c-7",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "Why do decision tree algorithms NOT require numerical feature scaling (such as StandardScaler or MinMaxScaler)?",
    options: [
      "Tree split criteria depend strictly on the rank ordering of values within each feature, which is invariant to monotonic transformations",
      "Because trees convert all continuous features into text strings before training",
      "Because Scikit-Learn automatically normalizes data internally without telling the user",
      "Because trees compute Euclidean distances between samples",
    ],
    answerIndex: 0,
    explanation:
      "A split condition like X_j ≤ 4.5 depends solely on whether values are greater than or less than the threshold. Multiplying or shifting feature values preserves the exact same partition boundaries.",
  },
  {
    id: "c-8",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "What is an Out-of-Bag (OOB) observation in the context of Random Forest?",
    options: [
      "A training data sample that was randomly omitted from a particular tree's bootstrap training sample",
      "An outlier that has been deleted by an anomaly detection algorithm",
      "A sample that has missing values across all features",
      "A sample in the held-out test set that has an incorrect ground-truth label",
    ],
    answerIndex: 0,
    explanation:
      "Because bootstrap sampling samples with replacement, ~36.8% of training observations are omitted from each tree's training sample. These omitted observations form that tree's Out-of-Bag set.",
  },
  {
    id: "c-9",
    category: "Conceptual",
    difficulty: "Beginner",
    question: "How does Random Forest perform regression for a new continuous query point?",
    options: [
      "By computing the arithmetic mean of the continuous predictions across all B trees",
      "By selecting the single tree with the lowest training error and outputting its prediction",
      "By fitting a linear regression line across the leaf node outputs",
      "By outputting the class mode of the leaf labels",
    ],
    answerIndex: 0,
    explanation:
      "RandomForestRegressor routes the query vector x down each tree to its terminating leaf, obtains that leaf's mean training value T_b(x), and computes the unweighted average (1/B) ∑ T_b(x).",
  },
  {
    id: "c-10",
    category: "Conceptual",
    difficulty: "Intermediate",
    question: "Why can Random Forest models NOT extrapolate continuous values beyond the range of training targets?",
    options: [
      "Because every tree leaf prediction is a bounded weighted average of training target values",
      "Because decision trees can only compute derivatives between -1 and 1",
      "Because regression trees convert continuous values into categorical probabilities",
      "Because Scikit-Learn clips negative numbers to zero",
    ],
    answerIndex: 0,
    explanation:
      "Every leaf in a regression tree outputs the mean of the training samples falling into that leaf. No matter how extreme the test input features are, the prediction will be capped at the highest or lowest training target leaf in the forest.",
  },

  // =========================================================================
  // --- MATHEMATICAL (12 Questions: 3 Beginner, 4 Intermediate, 5 Advanced) ---
  // =========================================================================
  {
    id: "m-1",
    category: "Mathematical",
    difficulty: "Beginner",
    question: "In the limit as dataset size N approaches infinity, what is the exact probability that an observation is Out-of-Bag for a bootstrap sample?",
    options: [
      "e⁻¹ = 1/e ≈ 36.8%",
      "0.50 (50.0%)",
      "1 - 1/e ≈ 63.2%",
      "ln(2) ≈ 69.3%",
    ],
    answerIndex: 0,
    explanation:
      "P(OOB) = (1 - 1/N)^N. As N → ∞, this classic calculus limit converges to e⁻¹ = 1/2.71828... ≈ 0.367879 (36.8%).",
  },
  {
    id: "m-2",
    category: "Mathematical",
    difficulty: "Intermediate",
    question: "A classification node S contains 30 samples of Class 0 and 70 samples of Class 1. What is the Gini Impurity of node S?",
    options: [
      "0.420",
      "0.500",
      "0.210",
      "0.840",
    ],
    answerIndex: 0,
    explanation:
      "Gini(S) = 1 - (p_0² + p_1²) = 1 - [(0.30)² + (0.70)²] = 1 - [0.09 + 0.49] = 1 - 0.58 = 0.420.",
  },
  {
    id: "m-3",
    category: "Mathematical",
    difficulty: "Advanced",
    question: "Under the Breiman-Hastie formula Var(Ensemble) = ρσ² + ((1 - ρ)/B)σ², if individual tree variance is σ² = 100 and tree correlation is ρ = 0.20, what is the asymptotic variance as B → ∞?",
    options: [
      "20.0",
      "0.0",
      "80.0",
      "100.0",
    ],
    answerIndex: 0,
    explanation:
      "As B → ∞, the second term ((1 - ρ)/B)σ² vanishes, leaving strictly the correlation floor ρσ² = (0.20)(100) = 20.0.",
  },
  {
    id: "m-4",
    category: "Mathematical",
    difficulty: "Beginner",
    question: "If a node has 50 samples of Class 0 and 50 samples of Class 1, what is its Shannon Entropy H(S) in base-2 bits?",
    options: [
      "1.00 bit",
      "0.00 bits",
      "0.50 bits",
      "2.00 bits",
    ],
    answerIndex: 0,
    explanation:
      "H(S) = - [0.5 log₂(0.5) + 0.5 log₂(0.5)] = - [0.5(-1) + 0.5(-1)] = -(-1) = 1.00 bit (maximum possible entropy for a binary node).",
  },
  {
    id: "m-5",
    category: "Mathematical",
    difficulty: "Intermediate",
    question: "In an ensemble of B = 5 independent classifiers each with accuracy p = 0.80, what is the probability that all 5 classifiers are simultaneously correct?",
    options: [
      "(0.80)⁵ = 0.32768 (32.8%)",
      "5 × 0.80 = 4.00",
      "1 - (0.80)⁵ = 0.67232",
      "0.80 / 5 = 0.16",
    ],
    answerIndex: 0,
    explanation:
      "For independent events, the joint probability is the product of marginal probabilities: P(All 5 correct) = p⁵ = (0.80)⁵ = 0.32768.",
  },
  {
    id: "m-6",
    category: "Mathematical",
    difficulty: "Intermediate",
    question: "What is the expected number of unique training observations present in a bootstrap sample drawn from N = 1,000 observations?",
    options: [
      "Approximately 632 observations",
      "Exactly 500 observations",
      "Approximately 368 observations",
      "Exactly 1,000 observations",
    ],
    answerIndex: 0,
    explanation:
      "E[Unique] = N[1 - (1 - 1/N)^N] ≈ N(1 - e⁻¹) = 1000 × (1 - 0.367879) = 1000 × 0.632121 ≈ 632 observations.",
  },
  {
    id: "m-7",
    category: "Mathematical",
    difficulty: "Beginner",
    question: "What is the theoretical minimum value that Gini Impurity can attain for a given node?",
    options: [
      "0.0 (achieved when all samples belong to a single class)",
      "0.5",
      "-1.0",
      "1.0",
    ],
    answerIndex: 0,
    explanation:
      "When a node is completely pure (p_k = 1.0 for one class and 0 for all others), Gini = 1 - (1.0)² = 0.0. Impurity cannot be negative.",
  },
  {
    id: "m-8",
    category: "Mathematical",
    difficulty: "Advanced",
    question: "In the bias-variance decomposition E[(Y - f̂)²] = Bias² + Variance + σ²_ε, what does σ²_ε represent?",
    options: [
      "The irreducible error caused by intrinsic random noise in the data-generating process",
      "The variance introduced by having too few decision trees",
      "The rounding error of floating-point arithmetic",
      "The error caused by using an incorrect learning rate",
    ],
    answerIndex: 0,
    explanation:
      "σ²_ε is the irreducible error (noise variance). It represents the lower bound of expected error that no model, no matter how complex or well-trained, can ever surpass.",
  },
  {
    id: "m-9",
    category: "Mathematical",
    difficulty: "Advanced",
    question: "What is the asymptotic computational time complexity to train a Random Forest of B trees on N samples with m candidate features evaluated per split?",
    options: [
      "O(B · m · N log N)",
      "O(N² · B)",
      "O(B · m² · N)",
      "O(log N)",
    ],
    answerIndex: 0,
    explanation:
      "Sorting and evaluating N samples across m features takes O(m · N log N) per tree. Multiplying across all B trees yields O(B · m · N log N).",
  },
  {
    id: "m-10",
    category: "Mathematical",
    difficulty: "Intermediate",
    question: "If parent node impurity is 0.48, and a split creates Left child (weight 0.40, impurity 0.30) and Right child (weight 0.60, impurity 0.20), what is the Information Gain?",
    options: [
      "0.240",
      "0.480",
      "0.250",
      "0.120",
    ],
    answerIndex: 0,
    explanation:
      "Weighted child impurity = 0.40(0.30) + 0.60(0.20) = 0.12 + 0.12 = 0.24. Information Gain = 0.48 - 0.24 = 0.240.",
  },
  {
    id: "m-11",
    category: "Mathematical",
    difficulty: "Advanced",
    question: "In SMOTE oversampling, synthetic minority samples are created along the vector segment via x_new = x_i + λ(x_nn - x_i). If minority sample x_i = [2.0, 4.0, 10.0], nearest neighbor x_nn = [6.0, 8.0, 2.0], and interpolation coefficient λ = 0.25, what are the coordinates of the synthetic sample x_new?",
    options: [
      "[3.0, 5.0, 8.0]",
      "[4.0, 6.0, 6.0]",
      "[2.5, 4.5, 9.0]",
      "[8.0, 12.0, 12.0]",
    ],
    answerIndex: 0,
    explanation:
      "Compute coordinate-wise: Feature 1 = 2.0 + 0.25(6.0 - 2.0) = 2.0 + 1.0 = 3.0; Feature 2 = 4.0 + 0.25(8.0 - 4.0) = 4.0 + 1.0 = 5.0; Feature 3 = 10.0 + 0.25(2.0 - 10.0) = 10.0 - 2.0 = 8.0. Hence, x_new = [3.0, 5.0, 8.0].",
  },
  {
    id: "m-12",
    category: "Mathematical",
    difficulty: "Advanced",
    question: "A binary classification model evaluated on a heavily skewed test set yields confusion matrix: TP = 80, TN = 900, FP = 20, FN = 0. What is the Matthews Correlation Coefficient (MCC), and why is it superior to F1-score for severe class imbalance?",
    options: [
      "MCC ≈ +0.885; it evaluates all four confusion matrix quadrants symmetrically without ignoring True Negatives (TN)",
      "MCC = +1.000; because FN is zero, MCC automatically attains its theoretical ceiling",
      "MCC = 0.000; MCC cannot evaluate models where false negatives are zero",
      "MCC ≈ -0.500; the negative sign indicates performance worse than random guessing",
    ],
    answerIndex: 0,
    explanation:
      "Numerator = (80 * 900) - (20 * 0) = 72,000. Denominator = sqrt((80+20)(80+0)(900+20)(900+0)) = sqrt(100 * 80 * 920 * 900) = sqrt(6,624,000,000) ≈ 81,388. MCC = 72,000 / 81,388 ≈ +0.8846. MCC is superior to F1 because F1 completely ignores TN, allowing models with massive false positive rates on negative classes to score artificially high.",
  },

  // =========================================================================
  // --- ALGORITHMIC & HYPERPARAMETERS (14 Questions: 3 Beginner, 8 Intermediate, 3 Advanced) ---
  // =========================================================================
  {
    id: "a-1",
    category: "Algorithmic",
    difficulty: "Beginner",
    question: "What is the default value of max_features in Scikit-Learn's RandomForestClassifier?",
    options: [
      "'sqrt' (evaluating ⌊√p⌋ randomly sampled features at each split)",
      "1.0 (evaluating all features at each split)",
      "'log2' (evaluating ⌊log₂(p)⌋ features)",
      "None (unconstrained)",
    ],
    answerIndex: 0,
    explanation:
      "RandomForestClassifier defaults to max_features='sqrt', which evaluates ⌊√p⌋ randomly chosen candidate features at each internal node split.",
  },
  {
    id: "a-2",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "What is the primary role of the min_samples_leaf hyperparameter?",
    options: [
      "It requires each leaf node to contain at least this many training samples, acting as pre-pruning to prevent overfitting on outliers",
      "It specifies the minimum number of trees required in the forest",
      "It sets the maximum number of leaves allowed in each tree",
      "It specifies the percentage of features to drop",
    ],
    answerIndex: 0,
    explanation:
      "min_samples_leaf guarantees that no leaf node can be created with fewer than the specified number of training samples, smoothing predictions and suppressing outlier memorization.",
  },
  {
    id: "a-3",
    category: "Algorithmic",
    difficulty: "Beginner",
    question: "What occurs if you set bootstrap=False in a Scikit-Learn Random Forest?",
    options: [
      "Every tree is trained on the exact same 100% full dataset without replacement, and OOB scoring is disabled",
      "The forest converts into a single decision tree",
      "The algorithm raises an immediate syntax error",
      "Trees are trained without any feature subsampling",
    ],
    answerIndex: 0,
    explanation:
      "If bootstrap=False, the full dataset is supplied to every tree. While trees still benefit from random feature subsampling, row diversity is lost and no Out-of-Bag samples exist.",
  },
  {
    id: "a-4",
    category: "Algorithmic",
    difficulty: "Beginner",
    question: "How does setting n_jobs=-1 impact model training?",
    options: [
      "It instructs the computer to use all available logical CPU cores to build trees in parallel",
      "It disables multi-threading to conserve system memory",
      "It trains the forest on a remote cloud cluster",
      "It runs the training backwards to check for errors",
    ],
    answerIndex: 0,
    explanation:
      "In Scikit-Learn, n_jobs=-1 utilizes joblib's parallel pool across all detectable CPU cores, training independent trees concurrently.",
  },
  {
    id: "a-5",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "What is the primary mechanism of ExtraTrees (Extremely Randomized Trees) compared to Random Forest?",
    options: [
      "ExtraTrees picks split thresholds completely at random for each candidate feature rather than finding the optimal cut point",
      "ExtraTrees trains only a single tree",
      "ExtraTrees disables random feature selection",
      "ExtraTrees uses gradient descent to optimize leaf weights",
    ],
    answerIndex: 0,
    explanation:
      "ExtraTrees (Geurts et al., 2006) draws random thresholds for each candidate feature without scanning for the optimal threshold, reducing variance and speeding up training at the expense of slightly higher bias.",
  },
  {
    id: "a-6",
    category: "Algorithmic",
    difficulty: "Advanced",
    question: "Why does Mean Decrease in Impurity (MDI) exhibit cardinality bias?",
    options: [
      "Features with many unique values provide many candidate split thresholds, allowing trees to overfit and artificially show high impurity reductions",
      "MDI ignores categorical features completely",
      "MDI divides by the cardinality of the target variable",
      "MDI is only defined for binary features",
    ],
    answerIndex: 0,
    explanation:
      "A feature with high cardinality (like arbitrary unique numerical IDs) gives the greedy split algorithm many threshold opportunities to coincidentally split training data into pure subsets, artificially inflating its MDI score.",
  },
  {
    id: "a-7",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "How does Permutation Feature Importance overcome MDI's cardinality bias?",
    options: [
      "It measures the actual performance degradation on held-out validation data when a feature's values are randomly shuffled",
      "It deletes the feature and retrains the entire forest from scratch",
      "It computes correlation coefficients with the target variable",
      "It normalizes features using z-scores",
    ],
    answerIndex: 0,
    explanation:
      "Permutation importance evaluates the trained model on out-of-sample data, randomly shuffling one feature column. If the feature was merely noise, shuffling it will cause zero drop in validation score, exposing its true lack of utility.",
  },
  {
    id: "a-8",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "What does setting class_weight='balanced' do inside RandomForestClassifier?",
    options: [
      "It rescales the sample weights inversely proportional to class frequencies when computing node split impurities",
      "It deletes majority class instances until classes are equal",
      "It generates synthetic minority samples using SMOTE",
      "It sets equal prior probabilities for all classes",
    ],
    answerIndex: 0,
    explanation:
      "class_weight='balanced' weights samples by w_c = N / (K · N_c). This penalizes mistakes on minority classes during Gini split evaluation proportionally to their rarity.",
  },
  {
    id: "a-9",
    category: "Algorithmic",
    difficulty: "Advanced",
    question: "What does the ccp_alpha hyperparameter control in modern Scikit-Learn tree models?",
    options: [
      "Cost-Complexity Pruning parameter for post-pruning subtrees with high complexity cost",
      "Learning rate for gradient boosting updates",
      "L2 regularization penalty for logistic regression",
      "Dropout rate for tree branches",
    ],
    answerIndex: 0,
    explanation:
      "ccp_alpha (Minimal Cost-Complexity Pruning) prunes the subtree that minimizes R_alpha(T) = R(T) + alpha * |T|. Larger alpha values prune more aggressively.",
  },
  {
    id: "a-10",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "What is the effect of setting warm_start=True on a Random Forest model?",
    options: [
      "Calling fit() reuses the existing forest and adds more trees rather than retraining from scratch",
      "It pre-heats CPU caches before training",
      "It initializes tree weights with a pre-trained neural network",
      "It skips the training step completely",
    ],
    answerIndex: 0,
    explanation:
      "When warm_start=True, calling fit() on a forest that already has 100 trees with n_estimators=150 will retain the 100 existing trees and only train the 50 new trees.",
  },
  {
    id: "a-11",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "In a Random Forest with p = 100 features, you decrease max_features from 'sqrt' (10) down to 'log2' (6). What happens to individual tree strength and correlation, and how should n_estimators be adjusted?",
    options: [
      "Individual trees become weaker (higher bias) but less correlated (lower ρ̄); n_estimators should be increased (e.g. from 100 to 300–500) to compensate",
      "Individual trees become stronger and more correlated; n_estimators should be decreased",
      "The forest converts into a single linear regression model",
      "Training speed decreases by 10x because fewer features take longer to sort",
    ],
    answerIndex: 0,
    explanation:
      "Reducing max_features forces splits on secondary features, lowering inter-tree correlation ρ̄ (which reduces ensemble variance according to Breiman's bound). However, individual tree strength s also drops, requiring more trees (n_estimators=300–500) to stabilize the ensemble.",
  },
  {
    id: "a-12",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "A Random Forest is overfitting noisy tabular data. Setting max_depth=6 limits depth too rigidly (underfitting), while max_depth=None overfits. How do max_depth and min_samples_leaf interact, and what is the best strategy?",
    options: [
      "Leave max_depth=None and increase min_samples_leaf to 5–15; this regularizes adaptively based on local sample density rather than imposing a rigid vertical ceiling",
      "Set max_depth=2 and min_samples_leaf=1 to force singleton leaves",
      "Set min_samples_leaf=0 and max_depth=100",
      "Both parameters perform the exact same mathematical operation, so tuning both is redundant",
    ],
    answerIndex: 0,
    explanation:
      "max_depth imposes a crude global vertical truncation that stops deep informative branches, while min_samples_leaf enforces statistical sample support at terminal leaves. Leaving max_depth unconstrained and setting min_samples_leaf=5–15 naturally prunes sparse noise branches while preserving deep dense signal.",
  },
  {
    id: "a-13",
    category: "Algorithmic",
    difficulty: "Intermediate",
    question: "In Scikit-Learn 1.4+, you configure RandomForestClassifier(monotonic_cst=[1, -1, 0]) on features [Income, Debt-to-Income, Age]. What does this parameter guarantee, and what is its primary limitation?",
    options: [
      "Predictions are guaranteed non-decreasing with Income, non-increasing with Debt-to-Income, and unconstrained with Age; it is supported for binary classification and regression but not multiclass",
      "It proves that Income causally causes credit repayment in econometric audits",
      "It forces all feature relationships to be strictly linear without interaction terms",
      "It enables monotonic constraints for all multiclass problems up to 100 classes",
    ],
    answerIndex: 0,
    explanation:
      "monotonic_cst enforces monotonic directional constraints during candidate split search (+1 non-decreasing, -1 non-increasing, 0 unconstrained), guaranteeing regulatory compliance. Currently, Scikit-Learn supports monotonic constraints only for binary classification and regression, not multiclass.",
  },
  {
    id: "a-14",
    category: "Algorithmic",
    difficulty: "Advanced",
    question: "Why is TreeSHAP (Lundberg et al., 2020) computationally feasible for large Random Forest ensembles compared to model-agnostic KernelSHAP, and what is its theoretical computational complexity per sample?",
    options: [
      "TreeSHAP evaluates tree paths recursively in polynomial time O(T · L · D²) where T is trees, L is leaves, and D is maximum depth, whereas KernelSHAP requires exponential O(2^p) model evaluations",
      "TreeSHAP simply outputs standard MDI Gini importance without calculating Shapley values",
      "TreeSHAP deletes all non-linear branches and fits a linear regression line",
      "TreeSHAP has O(1) constant time complexity for any dataset size",
    ],
    answerIndex: 0,
    explanation:
      "TreeSHAP exploits tree structure to compute exact Shapley values by tracking sample proportions down decision paths simultaneously. It runs in polynomial time O(T · L · D²) (where T is trees, L is max leaves, and D is maximum depth), avoiding the exponential O(2^p) combinatorial subset evaluations required by model-agnostic KernelSHAP.",
  },

  // =========================================================================
  // --- PRACTICAL & SCENARIO-BASED (14 Questions: 2 Beginner, 5 Intermediate, 7 Advanced) ---
  // =========================================================================
  {
    id: "p-1",
    category: "Practical",
    difficulty: "Beginner",
    question: "You are training a Random Forest on a credit card fraud dataset with 99.8% legitimate transactions and 0.2% fraud. Your model achieves 99.8% accuracy. What is happening?",
    options: [
      "The Accuracy Paradox: The model is simply predicting 'Legitimate' for every transaction, catching zero frauds",
      "The model is a perfect production-ready fraud detector",
      "The dataset has zero noise",
      "The model has achieved optimal global convergence",
    ],
    answerIndex: 0,
    explanation:
      "A trivial model predicting the majority class for 100% of samples achieves 99.8% accuracy while failing to detect a single fraudulent transaction. Precision, Recall, and PR-AUC must be evaluated instead.",
  },
  {
    id: "p-2",
    category: "Practical",
    difficulty: "Intermediate",
    question: "A company needs a low-latency API to score incoming user requests in under 2 milliseconds. Their current Random Forest of 1,000 deep trees takes 35 milliseconds. Which optimization should be applied first?",
    options: [
      "Reduce n_estimators to 100 and enforce max_depth=10 to cap tree traversal latency",
      "Add 2,000 more trees to make the forest faster",
      "Switch from float32 to float64 feature data types",
      "Train the model with bootstrap=False",
    ],
    answerIndex: 0,
    explanation:
      "Inference latency is O(B · D). Reducing n_estimators from 1000 to 100 provides a 10x speedup, and bounding max_depth to 10 prevents deep branch traversals, keeping latency well under 2ms.",
  },
  {
    id: "p-3",
    category: "Practical",
    difficulty: "Advanced",
    question: "You have two collinear features with correlation r = 0.99. When you inspect MDI feature importances, both features receive low scores. Why?",
    options: [
      "The two features split the importance between them, diluting both of their apparent contributions",
      "Random Forest automatically deletes one of the collinear features",
      "Collinear features cause mathematical division by zero in Gini impurity",
      "Trees can only split on uncorrelated features",
    ],
    answerIndex: 0,
    explanation:
      "When two features carry near-identical information, some trees split on Feature A while others split on Feature B. As a result, the total impurity reduction is divided between them, making each appear half as important.",
  },
  {
    id: "p-4",
    category: "Practical",
    difficulty: "Intermediate",
    question: "When evaluating hyperparameter tuning with cross-validation, where should feature imputation and scaling be executed?",
    options: [
      "Inside each cross-validation fold using a Scikit-Learn Pipeline",
      "On the entire dataset prior to splitting into train and test",
      "Only on the test dataset after model training is finished",
      "Directly in the production database",
    ],
    answerIndex: 0,
    explanation:
      "Preprocessing must occur strictly inside training folds (best accomplished with an sklearn Pipeline) to prevent validation data statistics from leaking into model training.",
  },
  {
    id: "p-5",
    category: "Practical",
    difficulty: "Beginner",
    question: "Which of the following Scikit-Learn code snippets correctly trains a Random Forest and exports its Out-of-Bag score?",
    options: [
      "rf = RandomForestClassifier(n_estimators=100, oob_score=True); rf.fit(X, y); print(rf.oob_score_)",
      "rf = RandomForestClassifier(bootstrap=False, oob_score=True); rf.fit(X, y)",
      "rf = RandomForestClassifier(); rf.fit(X, y); print(rf.score_oob)",
      "rf = RandomForestClassifier(oob=True); rf.predict(X)",
    ],
    answerIndex: 0,
    explanation:
      "Setting oob_score=True requires bootstrap=True (the default). After calling fit(), the computed score is accessible via the attribute rf.oob_score_.",
  },
  {
    id: "p-6",
    category: "Practical",
    difficulty: "Advanced",
    question: "You want to deploy a trained Random Forest model into a containerized Python microservice. Which tool should be used to serialize the model object to disk?",
    options: [
      "joblib.dump(model, 'model.joblib', compress=3)",
      "json.dumps(model)",
      "csv.writer(model)",
      "sql.insert(model)",
    ],
    answerIndex: 0,
    explanation:
      "joblib is optimized for fast and efficient on-disk serialization of large NumPy arrays and Scikit-Learn ensemble tree structures.",
  },
  {
    id: "p-7",
    category: "Practical",
    difficulty: "Advanced",
    question: "A client asks whether your Random Forest model can forecast next month's energy consumption, which is expected to reach record-high levels unprecedented in historical data. What is your response?",
    options: [
      "Random Forest cannot extrapolate beyond historical target ranges; a linear or trend-aware model is needed",
      "Random Forest will accurately predict the new record high without issue",
      "Random Forest will output infinite energy",
      "Random Forest will reverse the trend into negative numbers",
    ],
    answerIndex: 0,
    explanation:
      "Because decision tree leaf outputs are averages of historical training observations, a Random Forest regressor cannot predict a value higher than max(y_train). It will plateau at the historical maximum.",
  },
  {
    id: "p-8",
    category: "Practical",
    difficulty: "Advanced",
    question: "In a medical diagnostic system, false negatives (missed diagnoses) are 50x more costly than false positive alarms. How should the prediction threshold be adjusted?",
    options: [
      "Lower the decision threshold (e.g., from 0.50 down to 0.10 or 0.15) to boost Recall",
      "Raise the decision threshold from 0.50 up to 0.95",
      "Keep the threshold at exactly 0.50",
      "Delete all negative patient records",
    ],
    answerIndex: 0,
    explanation:
      "Lowering the decision threshold flags any patient with even a mild (e.g. 15%) probability of disease for specialist review, substantially boosting Recall and minimizing fatal False Negatives.",
  },
  {
    id: "p-9",
    category: "Practical",
    difficulty: "Intermediate",
    question: "You are given a tabular dataset containing continuous features, ordinal integers, and high-cardinality zip codes. How should categorical features be preprocessed for Scikit-Learn's Random Forest?",
    options: [
      "Encode categories using TargetEncoder, OrdinalEncoder, or OneHotEncoder prior to fitting",
      "Pass raw unencoded text strings directly to rf.fit()",
      "Replace all categories with random Gaussian noise",
      "Delete all non-continuous features",
    ],
    answerIndex: 0,
    explanation:
      "While theoretical decision trees natively handle categorical sets, Scikit-Learn's implementation currently requires all input matrices to be numeric. Features must be encoded numerically before training.",
  },
  {
    id: "p-10",
    category: "Practical",
    difficulty: "Advanced",
    question: "You run cross_val_score on a Random Forest and notice the test scores are identical across all 5 folds. What is the most likely culprit?",
    options: [
      "Data leakage: the test set was inadvertently included in the training data or preprocessed together",
      "The model has achieved true artificial general intelligence",
      "The dataset contains too many trees",
      "Scikit-Learn has cached the first fold result",
    ],
    answerIndex: 0,
    explanation:
      "Identical cross-validation scores across folds is a classic red flag for severe data leakage (such as duplicate rows, or fitting transformers on the entire dataset prior to splitting).",
  },
  {
    id: "p-11",
    category: "Practical",
    difficulty: "Advanced",
    question: "A data scientist applies SMOTE over an entire dataset of 10,000 rows (95% negative, 5% positive) to balance it to 50:50, and then runs cross_validate(RandomForestClassifier(), X_resampled, y_resampled, cv=5). The resulting CV ROC-AUC is 0.98, but in production the model scores only 0.72. Why?",
    options: [
      "Severe data leakage: synthetic samples created from validation fold observations leaked into training folds, artificially inflating validation metrics",
      "Random Forest automatically deletes synthetic samples during training",
      "Cross-validation is mathematically incompatible with tree-based models",
      "SMOTE only works when n_estimators is set to 1",
    ],
    answerIndex: 0,
    explanation:
      "Applying SMOTE before cross-validation causes catastrophic data leakage. Synthetic samples are generated by linear interpolation between nearest neighbors. If the entire dataset is resampled upfront, synthetic points in training folds are created from validation fold points, teaching the forest the exact test distribution. Always use imblearn.pipeline.Pipeline so resampling occurs strictly within training folds.",
  },
  {
    id: "p-12",
    category: "Practical",
    difficulty: "Intermediate",
    question: "An uncalibrated Random Forest achieves a high ROC-AUC of 0.92 on a credit default dataset, but its Brier score is poor (0.16) and predicted probabilities cluster around 0.15–0.85 rather than reaching 0.0 or 1.0. How should the engineering team obtain well-calibrated risk probabilities?",
    options: [
      "Wrap the model in CalibratedClassifierCV(estimator=rf, method='sigmoid', cv=5); this fits a Platt sigmoid mapping over out-of-fold predictions without leaking the final test set",
      "Multiply all predict_proba outputs by 2.0",
      "Convert the Random Forest into a single unpruned decision tree",
      "Change the classification threshold from 0.50 to 0.00",
    ],
    answerIndex: 0,
    explanation:
      "Random Forest voting averages pull probabilities away from 0 and 1. Wrapping the model in CalibratedClassifierCV with method='sigmoid' (Platt scaling) or 'isotonic' maps voting fractions to true empirical probabilities using internal cross-validation, preserving an untouched test set and significantly lowering Brier score loss.",
  },
  {
    id: "p-13",
    category: "Practical",
    difficulty: "Advanced",
    question: "On a 16-core cloud server, an engineer executes search = GridSearchCV(RandomForestClassifier(n_estimators=300, n_jobs=-1), param_grid=grid, cv=5, n_jobs=-1). The training job causes system freezes, memory thrashing, and takes 4x longer than expected. What is the root cause and the correct architectural solution?",
    options: [
      "Nested Parallelism Anti-Pattern: 16 outer search processes each spawn 16 inner forest workers (16 × 16 = 256 processes fighting for 16 cores); solve by setting GridSearchCV(n_jobs=-1) and RandomForestClassifier(n_jobs=1)",
      "Scikit-Learn requires setting n_jobs=0 on cloud servers",
      "GridSearchCV cannot be used with ensemble models",
      "The CPU Hyper-Threading was turned off by the operating system",
    ],
    answerIndex: 0,
    explanation:
      "This is the classic Nested Parallelism Anti-Pattern. When both outer search and inner estimator use n_jobs=-1, N × N = 256 processes are spawned, inducing severe context-switching overhead, memory bus saturation, and L3 cache thrashing. The solution is Option A: parallelize the outer search (GridSearchCV(n_jobs=-1)) while keeping the inner estimator single-threaded (RandomForestClassifier(n_jobs=1)).",
  },
  {
    id: "p-14",
    category: "Practical",
    difficulty: "Intermediate",
    question: "A commercial retail bank requires two machine learning scoring workflows: (1) Scoring 3 million active accounts every Sunday night to update marketing churn incentives, and (2) Evaluating single point-of-sale credit card transactions in under 20 milliseconds to block fraudulent swipes. Which production architectures should be selected?",
    options: [
      "Workflow 1: Scheduled Batch Scoring Pipeline (Airflow + distributed Spark/Ray chunks); Workflow 2: Real-Time Microservice (FastAPI with pre-loaded in-memory model artifact behind an API Gateway)",
      "Workflow 1: Real-Time Microservice; Workflow 2: Weekly manual CSV export",
      "Both workflows should use an Airflow cron job running once per week",
      "Both workflows should use single-threaded SQLite queries in Jupyter notebooks",
    ],
    answerIndex: 0,
    explanation:
      "Workflow 1 is high-throughput, non-latency-sensitive bulk scoring optimal for scheduled batch pipelines (Airflow/Spark). Workflow 2 has a strict 20ms synchronous SLA, requiring a real-time microservice (FastAPI/Uvicorn) with the model artifact pre-loaded in RAM behind an API gateway.",
  },
];
