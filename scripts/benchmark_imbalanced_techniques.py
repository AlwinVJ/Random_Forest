"""
Random Forest Imbalanced Classification Benchmark
===================================================
A unified experimental comparison comparing 6 approaches to handle class imbalance:
1. Baseline Random Forest (no imbalance handling, class_weight=None)
2. Random Forest with class_weight="balanced"
3. Random Forest with class_weight="balanced_subsample"
4. Random Oversampling + Random Forest (RandomOverSampler)
5. Random Undersampling + Random Forest (RandomUnderSampler)
6. SMOTE + Random Forest (SMOTE)

All models are trained and evaluated on the exact same dataset, using the same
stratified train-test split, identical Random Forest core hyperparameters,
and evaluated across Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
"""

import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)
from imblearn.over_sampling import RandomOverSampler, SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline


def run_benchmark():
    print("=" * 70)
    print("RANDOM FOREST IMBALANCED DATA BENCHMARK")
    print("=" * 70)

    # 1. Synthesize realistic imbalanced classification dataset
    # Total samples: 10,000 | 98% Negative (Class 0), 2% Positive (Class 1)
    print("\n[Step 1] Generating synthetic imbalanced dataset...")
    X, y = make_classification(
        n_samples=10000,
        n_features=20,
        n_informative=12,
        n_redundant=4,
        weights=[0.98, 0.02],
        flip_y=0.01,
        random_state=42
    )

    class_counts = pd.Series(y).value_counts()
    print(f"Total instances  : {len(y)}")
    print(f"Class 0 (Majority): {class_counts[0]} ({class_counts[0]/len(y)*100:.1f}%)")
    print(f"Class 1 (Minority): {class_counts[1]} ({class_counts[1]/len(y)*100:.1f}%)")

    # 2. Stratified Train-Test Split (75% Train, 25% Test)
    # Critical: Resampling must ONLY occur on training data to prevent data leakage!
    print("\n[Step 2] Performing Stratified Train-Test Split (75/25)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.25,
        stratify=y,
        random_state=42
    )
    print(f"Train samples: {len(y_train)} (Minority: {np.sum(y_train == 1)})")
    print(f"Test samples : {len(y_test)}  (Minority: {np.sum(y_test == 1)})")

    # Shared base Random Forest parameters
    rf_params = {
        'n_estimators': 200,
        'max_depth': 12,
        'min_samples_split': 5,
        'min_samples_leaf': 2,
        'random_state': 42,
        'n_jobs': -1
    }

    # 3. Define the 6 experimental models
    models = {
        "1. Baseline RF": RandomForestClassifier(
            **rf_params,
            class_weight=None
        ),
        "2. RF (class_weight='balanced')": RandomForestClassifier(
            **rf_params,
            class_weight="balanced"
        ),
        "3. RF (class_weight='balanced_subsample')": RandomForestClassifier(
            **rf_params,
            class_weight="balanced_subsample"
        ),
        "4. Random Oversampling + RF": ImbPipeline([
            ('oversampler', RandomOverSampler(random_state=42)),
            ('rf', RandomForestClassifier(**rf_params, class_weight=None))
        ]),
        "5. Random Undersampling + RF": ImbPipeline([
            ('undersampler', RandomUnderSampler(random_state=42)),
            ('rf', RandomForestClassifier(**rf_params, class_weight=None))
        ]),
        "6. SMOTE + RF": ImbPipeline([
            ('smote', SMOTE(k_neighbors=5, random_state=42)),
            ('rf', RandomForestClassifier(**rf_params, class_weight=None))
        ]),
    }

    results = []
    confusion_matrices = {}

    print("\n[Step 3] Training and evaluating all 6 models...")
    for name, model in models.items():
        print(f" -> Fitting {name}...")
        model.fit(X_train, y_train)

        # Predictions on UNTOUCHED original test set
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred)

        confusion_matrices[name] = cm

        results.append({
            "Technique": name,
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1-score": f1,
            "ROC-AUC": roc_auc
        })

    # 4. Create and display Pandas comparison DataFrame
    df_results = pd.DataFrame(results)
    print("\n" + "=" * 70)
    print("UNIFIED MODEL EVALUATION RESULTS")
    print("=" * 70)
    print(df_results.to_string(index=False, formatters={
        'Accuracy': '{:.4f}'.format,
        'Precision': '{:.4f}'.format,
        'Recall': '{:.4f}'.format,
        'F1-score': '{:.4f}'.format,
        'ROC-AUC': '{:.4f}'.format
    }))

    print("\n" + "=" * 70)
    print("CONFUSION MATRICES (Test Set N = 2,500; Positives = 50, Negatives = 2,450)")
    print("=" * 70)
    for name, cm in confusion_matrices.items():
        print(f"\n--- {name} ---")
        print(f" TN: {cm[0, 0]:<5} | FP: {cm[0, 1]:<5}")
        print(f" FN: {cm[1, 0]:<5} | TP: {cm[1, 1]:<5}")
        print(f" Minority Caught (Recall): {cm[1, 1]}/{cm[1, 0] + cm[1, 1]} ({cm[1, 1]/(cm[1, 0] + cm[1, 1])*100:.1f}%)")

    return df_results


if __name__ == "__main__":
    run_benchmark()
