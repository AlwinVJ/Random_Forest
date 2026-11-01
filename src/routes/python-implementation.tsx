import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code2,
  Database,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Layers,
  Sparkles,
  Sliders,
  FileCode,
  HardDrive,
} from "lucide-react";
import {
  CodeBlock,
  ComparisonTable,
  DifficultyBadge,
  Meta,
  PageHeader,
  SectionHeading,
  Callout,
} from "@/components/lab/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/python-implementation")({
  head: () => ({
    meta: [
      { title: "Python Implementation — Random Forest Lab" },
      {
        name: "description",
        content:
          "End-to-end Python implementation tutorial for Random Forest with Scikit-Learn: data preparation, baseline, ensemble training, tuning, and persistence.",
      },
      { property: "og:title", content: "Python Implementation — Random Forest Lab" },
      {
        property: "og:description",
        content: "Master the complete Scikit-Learn Random Forest production workflow.",
      },
    ],
  }),
  component: PythonTutorialPage,
});

interface TutorialStep {
  id: string;
  number: string;
  title: string;
  description: string;
  code: string;
  explanation: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "step-1",
    number: "01",
    title: "Environment Setup & Imports",
    description: "Import essential scientific computing and Scikit-Learn modules with version checks.",
    code: `import numpy as np
import pandas as pd
import sklearn

# Model estimators
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# Preprocessing & Model Selection
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Evaluation Metrics
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, mean_squared_error, r2_score

# Model Persistence
import joblib

print(f"NumPy version       : {np.__version__}")
print(f"Pandas version      : {pd.__version__}")
print(f"Scikit-Learn version: {sklearn.__version__}")`,
    explanation: [
      "RandomForestClassifier and RandomForestRegressor are imported directly from sklearn.ensemble.",
      "Pipeline guarantees that preprocessing and imputation are executed strictly inside training folds without data leakage.",
      "joblib provides efficient on-disk serialization for large ensemble tree objects.",
    ],
  },
  {
    id: "step-2",
    number: "02",
    title: "Data Loading & Exploratory Data Analysis (EDA)",
    description: "Load dataset, inspect shape, feature types, target balance, and check for missing values.",
    code: `from sklearn.datasets import load_breast_cancer

# Load dataset as a pandas DataFrame
raw = load_breast_cancer(as_frame=True)
df = raw.frame

print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
print("\\nClass Distribution:")
print(df['target'].value_counts(normalize=True))

# Missing Value Audit
missing_counts = df.isnull().sum().sum()
print(f"Total Missing Values across dataset: {missing_counts}")

# Inspect descriptive statistics of first 4 features
print("\\nFeature Summary Statistics:")
print(df.iloc[:, :4].describe().T[['mean', 'std', 'min', 'max']])`,
    explanation: [
      "as_frame=True loads Scikit-Learn benchmark datasets directly into native pandas DataFrames with feature names.",
      "Verifying class balance (value_counts(normalize=True)) determines whether stratified splitting and class_weight are required.",
      "Checking missing values confirms whether an imputer pipeline step is needed.",
    ],
  },
  {
    id: "step-3",
    number: "03",
    title: "Train-Test Split & Pipeline Setup",
    description: "Separate features and target, perform stratified train-test splitting to protect test integrity.",
    code: `X = df.drop(columns=['target'])
y = df['target']

# 75% Training, 25% Held-Out Testing with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    stratify=y,       # Preserves class proportions in train and test splits
    random_state=42   # Guarantees exact reproducibility
)

print(f"Training samples: {X_train.shape[0]}")
print(f"Testing samples : {X_test.shape[0]}")`,
    explanation: [
      "stratify=y ensures that both training and testing partitions have the exact same proportion of minority class instances.",
      "random_state=42 guarantees reproducibility across team members and experiment runs.",
      "Never transform or scale test data before splitting (data leakage violation).",
    ],
  },
  {
    id: "step-4",
    number: "04",
    title: "Baseline Model: Single Decision Tree",
    description: "Train a single decision tree to establish a comparative baseline for variance and accuracy.",
    code: `baseline_tree = DecisionTreeClassifier(random_state=42)
baseline_tree.fit(X_train, y_train)

train_acc = baseline_tree.score(X_train, y_train)
test_acc = baseline_tree.score(X_test, y_test)

print(f"Decision Tree Train Accuracy: {train_acc * 100:.2f}% (High Overfitting Risk!)")
print(f"Decision Tree Test Accuracy : {test_acc * 100:.2f}%")
print(f"Generalization Gap          : {(train_acc - test_acc) * 100:.2f}%")`,
    explanation: [
      "Notice that the unconstrained decision tree achieves 100% training accuracy but drops significantly on the test set.",
      "This ~7-10% generalization gap is the hallmark of high variance.",
    ],
  },
  {
    id: "step-5",
    number: "05",
    title: "Random Forest Model Training",
    description: "Construct and train the Random Forest ensemble with parallelization and OOB scoring.",
    code: `rf_model = RandomForestClassifier(
    n_estimators=200,      # Number of trees (B = 200)
    max_features='sqrt',   # Sample sqrt(p) candidate features at each split
    max_depth=None,        # Grow trees deep (low bias)
    bootstrap=True,        # Sample with replacement
    oob_score=True,        # Free Out-of-Bag validation
    n_jobs=-1,             # Use all available CPU cores
    random_state=42
)

# Fit ensemble in parallel
rf_model.fit(X_train, y_train)

print(f"Random Forest Test Accuracy: {rf_model.score(X_test, y_test) * 100:.2f}%")
print(f"Random Forest OOB Accuracy : {rf_model.oob_score_ * 100:.2f}%")
print(f"Variance Gap vs Baseline   : Test Accuracy improved by {(rf_model.score(X_test, y_test) - test_acc) * 100:.2f}%!")`,
    explanation: [
      "RandomForestClassifier executes bootstrap sampling and random feature subsampling across all 200 trees.",
      "n_jobs=-1 distributes tree building concurrently across all available CPU cores.",
      "oob_score_ provides an unbiased estimate of generalization error without touching test data.",
    ],
  },
  {
    id: "step-6",
    number: "06",
    title: "Comprehensive Evaluation & ROC Analysis",
    description: "Evaluate confusion matrix, classification report (precision/recall/F1), and ROC-AUC curve.",
    code: `y_pred = rf_model.predict(X_test)
y_probs = rf_model.predict_proba(X_test)[:, 1]

print("--- CLASSIFICATION REPORT ---")
print(classification_report(y_test, y_pred, target_names=['Malignant', 'Benign']))

print("--- CONFUSION MATRIX ---")
cm = confusion_matrix(y_test, y_pred)
print(f"TN: {cm[0,0]} | FP: {cm[0,1]}")
print(f"FN: {cm[1,0]} | TP: {cm[1,1]}")

auc = roc_auc_score(y_test, y_probs)
print(f"\\nROC-AUC Score: {auc:.4f}")`,
    explanation: [
      "predict_proba() yields soft probability estimates for ROC-AUC scoring.",
      "The confusion matrix verifies false negative counts (crucial for healthcare and risk applications).",
    ],
  },
  {
    id: "step-7",
    number: "07",
    title: "Hyperparameter Optimization via Random Search",
    description: "Tune max_features, min_samples_leaf, and max_depth with 5-fold cross-validation.",
    code: `from scipy.stats import randint

param_distributions = {
    'n_estimators': randint(100, 350),
    'max_features': ['sqrt', 'log2', 0.2, 0.4],
    'max_depth': [None, 8, 12, 16],
    'min_samples_split': randint(2, 8),
    'min_samples_leaf': randint(1, 4)
}

search = RandomizedSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_distributions=param_distributions,
    n_iter=20,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    random_state=42
)

search.fit(X_train, y_train)
best_rf = search.best_estimator_

print("Optimal Hyperparameters:")
for param, val in search.best_params_.items():
    print(f"  {param:18}: {val}")

print(f"\\nTuned Model Test ROC-AUC: {roc_auc_score(y_test, best_rf.predict_proba(X_test)[:, 1]):.4f}")`,
    explanation: [
      "RandomizedSearchCV draws parameter combinations randomly, outperforming exhaustive grid search.",
      "search.best_estimator_ is automatically refit on the entire training set with the winning configuration.",
    ],
  },
  {
    id: "step-8",
    number: "08",
    title: "Feature Importance Analysis (MDI vs Permutation)",
    description: "Extract Mean Decrease in Impurity and validate with test Permutation Importance.",
    code: `from sklearn.inspection import permutation_importance

# 1. Gini Importance (MDI)
mdi_importances = pd.Series(best_rf.feature_importances_, index=X.columns).sort_values(ascending=False)
print("Top 5 Features by MDI:")
print(mdi_importances.head(5))

# 2. Permutation Importance on Held-Out Test Set
perm = permutation_importance(best_rf, X_test, y_test, n_repeats=10, random_state=42)
perm_importances = pd.Series(perm.importances_mean, index=X.columns).sort_values(ascending=False)
print("\\nTop 5 Features by Permutation Importance:")
print(perm_importances.head(5))`,
    explanation: [
      "Comparing MDI against Permutation Importance prevents misinterpreting high-cardinality noise features.",
      "Features appearing at the top of both lists represent robust predictive signals.",
    ],
  },
  {
    id: "step-9",
    number: "09",
    title: "Model Persistence & Production Scoring",
    description: "Serialize the trained model checkpoint to disk with joblib and serve predictions.",
    code: `import joblib

# Save model checkpoint to disk
model_filename = "production_random_forest.joblib"
joblib.dump(best_rf, model_filename, compress=3)
print(f"Model successfully saved to {model_filename}")

# Load model in a production inference API
loaded_model = joblib.load(model_filename)

# Score a new incoming patient sample
new_sample = X_test.iloc[[0]]
prob_benign = loaded_model.predict_proba(new_sample)[0, 1]
label = "Benign" if prob_benign >= 0.50 else "Malignant"

print(f"Inference Result: {label} (Confidence: {max(prob_benign, 1 - prob_benign) * 100:.1f}%)")`,
    explanation: [
      "joblib.dump with compress=3 compresses multi-tree decision structures efficiently for cloud storage.",
      "The loaded model is ready for real-time microservice deployment with sub-millisecond inference.",
    ],
  },
];

function PythonTutorialPage() {
  const [activeStepId, setActiveStepId] = useState<string>("step-1");
  const currentStep = tutorialSteps.find((s) => s.id === activeStepId) ?? tutorialSteps[0]!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        crumbs={[
          { label: "Course", to: "/" },
          { label: "Practical Learning" },
          { label: "Python Implementation" },
        ]}
        eyebrow="Scikit-Learn Guide"
        title="Python Implementation Guide"
        intro="A progressive, production-grade tutorial implementing Random Forest from data loading and EDA to baseline comparisons, parallel training, tuning, and deployment."
      >
        <Meta>2 hours hands-on</Meta>
        <DifficultyBadge level="Intermediate" />
      </PageHeader>

      {/* Overview Card */}
      <div className="mt-8">
        <Callout type="info" title="Complete Scikit-Learn Workflow">
          This tutorial follows the standard industry ML workflow: data loading, EDA, stratified
          splitting, baseline benchmarking, parallel ensemble fitting, hyperparameter optimization,
          feature importance verification, and model persistence.
        </Callout>
      </div>

      {/* Step Selector Horizontal Pills */}
      <div className="mt-10 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {tutorialSteps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStepId(s.id)}
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                activeStepId === s.id
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{s.number}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="mt-6 surface p-6 space-y-6 animate-fade-up">
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <span>STEP {currentStep.number}</span>
            <span>·</span>
            <span>WORKFLOW STAGE</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-foreground">{currentStep.title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{currentStep.description}</p>
        </div>

        {/* Python Code Block */}
        <div>
          <CodeBlock
            code={currentStep.code}
            filename={`random_forest_step_${currentStep.number.toLowerCase()}.py`}
          />
        </div>

        {/* Bullet Explanations */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <h4 className="text-xs font-mono uppercase font-semibold text-foreground tracking-wider mb-2">
            Engineering Breakdown
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {currentStep.explanation.map((exp, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">
            Step {currentStep.number} of {tutorialSteps.length}
          </span>
          {tutorialSteps.findIndex((s) => s.id === currentStep.id) < tutorialSteps.length - 1 ? (
            <Button
              size="sm"
              onClick={() => {
                const nextIdx = tutorialSteps.findIndex((s) => s.id === currentStep.id) + 1;
                setActiveStepId(tutorialSteps[nextIdx]!.id);
              }}
            >
              Next Step: {tutorialSteps[tutorialSteps.findIndex((s) => s.id === currentStep.id) + 1]?.title} <ArrowRight className="size-3.5 ml-1" />
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/classification-project">
                Proceed to Practical Projects <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Dataset Benchmark Table */}
      <section className="mt-16">
        <SectionHeading
          index="BENCHMARKS"
          title="Recommended Tutorial Datasets"
          desc="Standard datasets provided natively inside Scikit-Learn for practicing Random Forest."
        />
        <ComparisonTable
          head={["Dataset Name", "Task", "Observations", "Features", "Target Variable", "Primary Metric"]}
          rows={[
            [
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Database className="size-3.5 text-accent" /> Breast Cancer Wisconsin
              </span>,
              "Binary Classification",
              "569",
              "30 continuous",
              "Malignant vs Benign",
              "Recall / ROC-AUC",
            ],
            [
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Database className="size-3.5 text-accent" /> California Housing
              </span>,
              "Continuous Regression",
              "20,640",
              "8 continuous",
              "Median House Value ($100k)",
              "RMSE / R²",
            ],
            [
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Database className="size-3.5 text-accent" /> Wine Recognition
              </span>,
              "Multi-Class Classification",
              "178",
              "13 continuous",
              "3 Cultivars (Classes 0, 1, 2)",
              "Multi-class F1-Macro",
            ],
          ]}
        />
      </section>

      {/* Links to Projects */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        <Link
          to="/classification-project"
          className="surface group flex items-center justify-between p-5 hover:border-primary/40 transition-colors"
        >
          <div>
            <div className="text-xs text-muted-foreground font-mono">CASE STUDY 01</div>
            <div className="font-semibold text-foreground text-sm mt-0.5">
              Breast Cancer Classification Project
            </div>
          </div>
          <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to="/regression-project"
          className="surface group flex items-center justify-between p-5 hover:border-primary/40 transition-colors"
        >
          <div>
            <div className="text-xs text-muted-foreground font-mono">CASE STUDY 02</div>
            <div className="font-semibold text-foreground text-sm mt-0.5">
              California Housing Regression Project
            </div>
          </div>
          <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
