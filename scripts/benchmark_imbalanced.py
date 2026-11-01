import json
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    matthews_corrcoef,
    balanced_accuracy_score,
)
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import RandomOverSampler, SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.ensemble import BalancedRandomForestClassifier

# 1. Generate synthetic reproducible imbalanced dataset
print("Generating dataset...")
X, y = make_classification(
    n_samples=10000,
    n_features=20,
    n_informative=10,
    n_redundant=4,
    n_clusters_per_class=2,
    weights=[0.98, 0.02],
    flip_y=0.005,
    random_state=42,
)

# 2. Stratified train-test split (75% train, 25% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42
)

print(f"Train samples: {len(y_train)} (Class 0: {sum(y_train==0)}, Class 1: {sum(y_train==1)})")
print(f"Test samples: {len(y_test)} (Class 0: {sum(y_test==0)}, Class 1: {sum(y_test==1)})")

# 3. Models to benchmark
models = [
    {
        "id": "baseline",
        "name": "Baseline Random Forest (class_weight=None)",
        "shortName": "Baseline RF",
        "category": "Baseline",
        "estimator": RandomForestClassifier(
            n_estimators=200, max_depth=12, class_weight=None, random_state=42, n_jobs=-1
        ),
        "trainSamples": "7,500 (7,350 Maj + 150 Min)",
        "description": "Standard unweighted Random Forest. Achieves high nominal accuracy but low recall on rare positive events as minority splits minimize overall Gini impurity.",
    },
    {
        "id": "class_weight_balanced",
        "name": "Random Forest (class_weight='balanced')",
        "shortName": "RF Balanced Weight",
        "category": "Cost-Sensitive",
        "estimator": RandomForestClassifier(
            n_estimators=200, max_depth=12, class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "trainSamples": "7,500 (No extra rows)",
        "description": "Scales Gini impurity split criteria inversely proportional to global class frequencies w_c = N / (K * N_c), boosting minority sample influence during node splits.",
    },
    {
        "id": "class_weight_subsample",
        "name": "Random Forest (class_weight='balanced_subsample')",
        "shortName": "RF Balanced Subsample",
        "category": "Cost-Sensitive",
        "estimator": RandomForestClassifier(
            n_estimators=200, max_depth=12, class_weight="balanced_subsample", random_state=42, n_jobs=-1
        ),
        "trainSamples": "7,500 (No extra rows)",
        "description": "Computes class weights dynamically inside each bootstrap sample, automatically compensating for localized minority sampling variations across trees.",
    },
    {
        "id": "random_oversampling",
        "name": "Random Oversampling (ROS) + Random Forest",
        "shortName": "Random Oversampling",
        "category": "Oversampling",
        "estimator": ImbPipeline([
            ("ros", RandomOverSampler(random_state=42)),
            ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)),
        ]),
        "trainSamples": "14,700 (7,350 Maj + 7,350 Min dup)",
        "description": "Duplicates minority training samples with replacement to reach parity. Increases minority sensitivity, but identical replicates risk narrow leaf overfitting.",
    },
    {
        "id": "random_undersampling",
        "name": "Random Undersampling (RUS) + Random Forest",
        "shortName": "Random Undersampling",
        "category": "Undersampling",
        "estimator": ImbPipeline([
            ("rus", RandomUnderSampler(random_state=42)),
            ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)),
        ]),
        "trainSamples": "300 (150 Maj + 150 Min)",
        "description": "Randomly discards majority class instances to match minority count. Trains extremely fast but incurs massive information loss by discarding majority observations.",
    },
    {
        "id": "smote",
        "name": "SMOTE + Random Forest",
        "shortName": "SMOTE + RF",
        "category": "Synthetic",
        "estimator": ImbPipeline([
            ("smote", SMOTE(k_neighbors=5, random_state=42)),
            ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)),
        ]),
        "trainSamples": "14,700 (7,350 Maj + 7,350 Synthetic)",
        "description": "Generates synthetic minority examples via linear interpolation between k-nearest neighbors in feature space, constructing continuous minority decision regions.",
    },
    {
        "id": "balanced_rf",
        "name": "Balanced Random Forest (imblearn)",
        "shortName": "Balanced RF",
        "category": "Ensemble Downsampling",
        "estimator": BalancedRandomForestClassifier(
            n_estimators=200, max_depth=12, random_state=42, n_jobs=-1, sampling_strategy="auto"
        ),
        "trainSamples": "7,500 (Bootstraps downsampled per-tree)",
        "description": "Draws a bootstrap sample of the minority class and an equal-sized random subsample of the majority class independently for every individual tree in the forest.",
    },
]

results = []

for m in models:
    print(f"Training {m['shortName']}...")
    model = m["estimator"]
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1])

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    spec = float(tn / (tn + fp))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    mcc = float(matthews_corrcoef(y_test, y_pred))
    bal_acc = float(balanced_accuracy_score(y_test, y_pred))
    roc_auc = float(roc_auc_score(y_test, y_prob))
    pr_auc = float(average_precision_score(y_test, y_prob))

    # Verify mathematical identity of precision, recall, f1 from confusion matrix
    calc_prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    calc_rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    calc_f1 = 2 * calc_prec * calc_rec / (calc_prec + calc_rec) if (calc_prec + calc_rec) > 0 else 0.0
    calc_acc = (tp + tn) / (tp + tn + fp + fn)

    assert abs(prec - calc_prec) < 1e-6, f"Precision mismatch for {m['id']}"
    assert abs(rec - calc_rec) < 1e-6, f"Recall mismatch for {m['id']}"
    assert abs(f1 - calc_f1) < 1e-6, f"F1 mismatch for {m['id']}"
    assert abs(acc - calc_acc) < 1e-6, f"Accuracy mismatch for {m['id']}"

    results.append({
        "id": m["id"],
        "name": m["name"],
        "shortName": m["shortName"],
        "category": m["category"],
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "specificity": round(spec, 4),
        "f1": round(f1, 4),
        "mcc": round(mcc, 4),
        "balancedAccuracy": round(bal_acc, 4),
        "rocAuc": round(roc_auc, 4),
        "prAuc": round(pr_auc, 4),
        "cm": {"tn": tn, "fp": fp, "fn": fn, "tp": tp},
        "trainSamples": m["trainSamples"],
        "description": m["description"],
    })

output_data = {
    "dataset": {
        "generator": "sklearn.datasets.make_classification",
        "n_samples": 10000,
        "n_features": 20,
        "n_informative": 10,
        "n_redundant": 4,
        "class_distribution": "98% Class 0 (9,800), 2% Class 1 (200)",
        "split": "75% Stratified Train (7,500: 7,350 Maj, 150 Min), 25% Test (2,500: 2,450 Maj, 50 Min)",
        "random_state": 42,
    },
    "models": results,
}

with open("benchmark_results.json", "w") as f:
    json.dump(output_data, f, indent=2)

print("\nBenchmark successfully completed and verified! Output saved to benchmark_results.json")
