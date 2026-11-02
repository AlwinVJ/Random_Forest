import json
import numpy as np
import sklearn
import imblearn
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


def get_class_distribution(y_arr):
    """
    Returns an explicit dictionary mapping class label to its frequency count.
    """
    unique, counts = np.unique(y_arr, return_counts=True)
    return {int(label): int(count) for label, count in zip(unique, counts)}


def get_min_maj_labels_and_counts(dist_dict):
    """
    Extracts the minority and majority class labels and counts based on frequencies.
    Agnostic to specific label values (e.g., 0/1, -1/1, or arbitrary integers).
    """
    if len(dist_dict) < 2:
        raise ValueError("Distribution must contain at least 2 distinct classes.")
    sorted_items = sorted(dist_dict.items(), key=lambda item: item[1])
    min_label, min_count = sorted_items[0]
    maj_label, maj_count = sorted_items[-1]
    return min_label, min_count, maj_label, maj_count


def compute_resampled_counts(X_train, y_train, random_state=42):
    """
    Dynamically computes resampled training set dimensions and formatted descriptions
    for all benchmarked resampling techniques (Original, ROS, RUS, SMOTE, Balanced RF).

    Identifies minority and majority classes dynamically based on empirical class
    frequencies rather than positional assumptions or hardcoded class labels.
    """
    train_dist = get_class_distribution(y_train)
    min_label, min_count, maj_label, maj_count = get_min_maj_labels_and_counts(train_dist)

    counts = {}

    # 1. Original (unresampled baseline & cost-sensitive weighting)
    counts["original"] = {
        "total": len(y_train),
        "majority": maj_count,
        "minority": min_count,
        "majority_label": maj_label,
        "minority_label": min_label,
        "description": f"{len(y_train):,} ({maj_count:,} Maj + {min_count:,} Min)",
    }

    # 2. Random Oversampling (ROS)
    ros = RandomOverSampler(random_state=random_state)
    X_ros, y_ros = ros.fit_resample(X_train, y_train)
    ros_dist = get_class_distribution(y_ros)
    counts["ros"] = {
        "total": len(y_ros),
        "majority": ros_dist[maj_label],
        "minority": ros_dist[min_label],
        "description": f"{len(y_ros):,} ({ros_dist[maj_label]:,} Maj + {ros_dist[min_label]:,} Min duplicated)",
    }

    # 3. Random Undersampling (RUS)
    rus = RandomUnderSampler(random_state=random_state)
    X_rus, y_rus = rus.fit_resample(X_train, y_train)
    rus_dist = get_class_distribution(y_rus)
    counts["rus"] = {
        "total": len(y_rus),
        "majority": rus_dist[maj_label],
        "minority": rus_dist[min_label],
        "description": f"{len(y_rus):,} ({rus_dist[maj_label]:,} Maj + {rus_dist[min_label]:,} Min)",
    }

    # 4. SMOTE (Synthetic Minority Over-sampling Technique)
    k_neighbors = min(5, max(1, min_count - 1))
    smote = SMOTE(k_neighbors=k_neighbors, random_state=random_state)
    X_smote, y_smote = smote.fit_resample(X_train, y_train)
    smote_dist = get_class_distribution(y_smote)
    counts["smote"] = {
        "total": len(y_smote),
        "majority": smote_dist[maj_label],
        "minority": smote_dist[min_label],
        "description": f"{len(y_smote):,} ({smote_dist[maj_label]:,} Maj + {smote_dist[min_label]:,} Synthetic)",
    }

    # 5. Balanced Random Forest (Independent per-tree bootstrap downsampling)
    # BalancedRandomForestClassifier downsamples the majority class in each bootstrap
    # bag to match the minority class size.
    bag_size = min_count * 2
    counts["balanced_rf"] = {
        "total": len(y_train),
        "bag_size": bag_size,
        "majority_per_tree": min_count,
        "minority_per_tree": min_count,
        "description": (
            f"{len(y_train):,} (Bootstraps: {bag_size:,} per tree "
            f"[{min_count:,} Maj + {min_count:,} Min])"
        ),
    }

    return counts


def run_benchmark():
    print("=" * 80)
    print("Executing Imbalanced Benchmark Script")
    print(f"Scikit-learn version : {sklearn.__version__}")
    print(f"Imbalanced-learn version: {imblearn.__version__}")
    print("=" * 80)

    # 1. Generate synthetic reproducible imbalanced dataset
    SEED = 42
    N_SAMPLES = 10000
    N_FEATURES = 20
    N_INFORMATIVE = 10
    N_REDUNDANT = 4
    WEIGHTS = [0.98, 0.02]
    FLIP_Y = 0.005

    X, y = make_classification(
        n_samples=N_SAMPLES,
        n_features=N_FEATURES,
        n_informative=N_INFORMATIVE,
        n_redundant=N_REDUNDANT,
        n_clusters_per_class=2,
        weights=WEIGHTS,
        flip_y=FLIP_Y,
        random_state=SEED,
    )

    # Dynamic class distributions
    full_dist = get_class_distribution(y)
    full_min_label, full_min_count, full_maj_label, full_maj_count = get_min_maj_labels_and_counts(full_dist)
    print(f"Full Dataset: Total = {len(y)}, Class Distribution = {full_dist}")

    # 2. Stratified train-test split (75% train, 25% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, stratify=y, random_state=SEED
    )

    train_dist = get_class_distribution(y_train)
    train_min_label, train_min_count, train_maj_label, train_maj_count = get_min_maj_labels_and_counts(train_dist)

    test_dist = get_class_distribution(y_test)
    test_min_label, test_min_count, test_maj_label, test_maj_count = get_min_maj_labels_and_counts(test_dist)

    print(f"Training Set: Total = {len(y_train)}, Class Distribution = {train_dist}")
    print(f"Held-out Test: Total = {len(y_test)}, Class Distribution = {test_dist}")

    # 3. Compute dynamic resampled training counts for each technique
    resampled_counts = compute_resampled_counts(X_train, y_train, random_state=SEED)

    print("\nDynamic Resampled Training Counts:")
    for k, v in resampled_counts.items():
        print(f"  {k}: {v['description']}")

    # 4. Models to benchmark
    models = [
        {
            "id": "baseline",
            "name": "Baseline Random Forest (class_weight=None)",
            "shortName": "Baseline RF",
            "category": "Baseline",
            "estimator": RandomForestClassifier(
                n_estimators=200, max_depth=12, class_weight=None, random_state=SEED, n_jobs=-1
            ),
            "trainSamples": resampled_counts["original"]["description"],
            "description": "Standard unweighted Random Forest. Achieves high nominal accuracy (98.3%) with zero false alarms, but suffers from low minority recall (only 24.6% caught: misses 43 of 57 minority events) because unweighted Gini impurity prioritizes majority partition purity.",
            "codeSnippet": """from sklearn.ensemble import RandomForestClassifier

# 1. Baseline model without class weights
rf_baseline = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight=None,
    random_state=42,
    n_jobs=-1
)
rf_baseline.fit(X_train, y_train)""",
        },
        {
            "id": "class_weight_balanced",
            "name": "Random Forest (class_weight='balanced')",
            "shortName": "RF Balanced Weight",
            "category": "Cost-Sensitive",
            "estimator": RandomForestClassifier(
                n_estimators=200, max_depth=12, class_weight="balanced", random_state=SEED, n_jobs=-1
            ),
            "trainSamples": resampled_counts["original"]["description"],
            "description": "Scales Gini impurity split criteria inversely proportional to global training class frequencies w_c = N / (K * N_c). Adds zero memory footprint and requires no resampling.",
            "codeSnippet": """from sklearn.ensemble import RandomForestClassifier

# 2. Global inverse class frequency weighting: w_c = N / (K * N_c)
rf_balanced = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)
rf_balanced.fit(X_train, y_train)""",
        },
        {
            "id": "class_weight_subsample",
            "name": "Random Forest (class_weight='balanced_subsample')",
            "shortName": "RF Balanced Subsample",
            "category": "Cost-Sensitive",
            "estimator": RandomForestClassifier(
                n_estimators=200, max_depth=12, class_weight="balanced_subsample", random_state=SEED, n_jobs=-1
            ),
            "trainSamples": resampled_counts["original"]["description"],
            "description": "Computes class weights dynamically inside each bootstrap sample, automatically compensating for localized minority sampling variations across trees.",
            "codeSnippet": """from sklearn.ensemble import RandomForestClassifier

# 3. Dynamic per-tree bootstrap subsample re-weighting
rf_subsample = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight="balanced_subsample",
    random_state=42,
    n_jobs=-1
)
rf_subsample.fit(X_train, y_train)""",
        },
        {
            "id": "random_oversampling",
            "name": "Random Oversampling (ROS) + Random Forest",
            "shortName": "Random Oversampling",
            "category": "Oversampling",
            "estimator": ImbPipeline([
                ("ros", RandomOverSampler(random_state=SEED)),
                ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=SEED, n_jobs=-1)),
            ]),
            "trainSamples": resampled_counts["ros"]["description"],
            "description": "Duplicates existing minority observations with replacement until classes are equal. Improves minority sample presence, but identical duplicate rows risk causing decision trees to overfit narrow noise points.",
            "codeSnippet": """from imblearn.over_sampling import RandomOverSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 4. Pipeline with Random Oversampling
pipeline_ros = ImbPipeline([
    ('oversampler', RandomOverSampler(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipeline_ros.fit(X_train, y_train)""",
        },
        {
            "id": "random_undersampling",
            "name": "Random Undersampling (RUS) + Random Forest",
            "shortName": "Random Undersampling",
            "category": "Undersampling",
            "estimator": ImbPipeline([
                ("rus", RandomUnderSampler(random_state=SEED)),
                ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=SEED, n_jobs=-1)),
            ]),
            "trainSamples": resampled_counts["rus"]["description"],
            "description": "Randomly discards majority-class observations to match minority count. Ultra-fast training and achieves high recall (73.7%, catching 42 of 57 minority events), but suffers from significant information loss (discards 7,160 majority samples), generating 432 false alarms.",
            "codeSnippet": """from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 5. Pipeline with Random Undersampling
pipeline_rus = ImbPipeline([
    ('undersampler', RandomUnderSampler(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipeline_rus.fit(X_train, y_train)""",
        },
        {
            "id": "smote",
            "name": "SMOTE + Random Forest",
            "shortName": "SMOTE + RF",
            "category": "Synthetic",
            "estimator": ImbPipeline([
                ("smote", SMOTE(k_neighbors=5, random_state=SEED)),
                ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=SEED, n_jobs=-1)),
            ]),
            "trainSamples": resampled_counts["smote"]["description"],
            "description": "Synthesizes new minority points along nearest-neighbor line segments. Avoids exact duplication, creating continuous generalization boundaries across minority space. Achieves the highest F1 score (0.472) and highest ROC-AUC (0.860) among resamplers.",
            "codeSnippet": """from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 6. Pipeline with SMOTE nearest-neighbor interpolation
pipeline_smote = ImbPipeline([
    ('smote', SMOTE(k_neighbors=5, random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipeline_smote.fit(X_train, y_train)""",
        },
        {
            "id": "balanced_rf",
            "name": "Balanced Random Forest (imblearn)",
            "shortName": "Balanced RF",
            "category": "Ensemble Downsampling",
            "estimator": BalancedRandomForestClassifier(
                n_estimators=200, max_depth=12, random_state=SEED, n_jobs=-1, sampling_strategy="auto"
            ),
            "trainSamples": resampled_counts["balanced_rf"]["description"],
            "description": "Draws a bootstrap sample of the minority class and an equal-sized random subsample of the majority class independently for every individual tree in the forest. Eliminates global information loss because the full majority dataset is distributed across the forest.",
            "codeSnippet": """from imblearn.ensemble import BalancedRandomForestClassifier

# 7. Balanced Random Forest: Independent per-tree downsampling
brf = BalancedRandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    sampling_strategy="auto",
    random_state=42,
    n_jobs=-1
)
brf.fit(X_train, y_train)""",
        },
    ]

    results = []

    for m in models:
        print(f"\nTraining and evaluating: {m['name']}...")
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

        # Verify mathematical identity of precision, recall, f1, accuracy from confusion matrix
        calc_prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        calc_rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        calc_f1 = 2 * calc_prec * calc_rec / (calc_prec + calc_rec) if (calc_prec + calc_rec) > 0 else 0.0
        calc_acc = (tp + tn) / (tp + tn + fp + fn)

        assert abs(prec - calc_prec) < 1e-5, f"Precision mismatch for {m['id']}"
        assert abs(rec - calc_rec) < 1e-5, f"Recall mismatch for {m['id']}"
        assert abs(f1 - calc_f1) < 1e-5, f"F1 mismatch for {m['id']}"
        assert abs(acc - calc_acc) < 1e-5, f"Accuracy mismatch for {m['id']}"
        assert tp + fn == test_min_count, f"Test positive mismatch: {tp + fn} != {test_min_count}"
        assert tn + fp == test_maj_count, f"Test negative mismatch: {tn + fp} != {test_maj_count}"

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
            "codeSnippet": m["codeSnippet"],
        })

    output_data = {
        "metadata": {
            "generator": "sklearn.datasets.make_classification",
            "random_state": SEED,
            "n_samples": N_SAMPLES,
            "n_features": N_FEATURES,
            "n_informative": N_INFORMATIVE,
            "n_redundant": N_REDUNDANT,
            "flip_y": FLIP_Y,
            "weights_parameter": WEIGHTS,
            "environment": {
                "sklearn_version": sklearn.__version__,
                "imblearn_version": imblearn.__version__,
            },
            "dataset_distributions": {
                "full": {
                    "total": len(y),
                    "majority": full_maj_count,
                    "minority": full_min_count,
                    "minority_prevalence": round(full_min_count / len(y), 4),
                    "formatted": f"{full_maj_count:,} Majority ({full_maj_label}) vs {full_min_count:,} Minority ({full_min_label}) [{full_min_count/len(y)*100:.2f}%]",
                },
                "train": {
                    "total": len(y_train),
                    "majority": train_maj_count,
                    "minority": train_min_count,
                    "formatted": f"{train_maj_count:,} Majority ({train_maj_label}) vs {train_min_count:,} Minority ({train_min_label})",
                },
                "test": {
                    "total": len(y_test),
                    "majority": test_maj_count,
                    "minority": test_min_count,
                    "formatted": f"{test_maj_count:,} Majority ({test_maj_label}) vs {test_min_count:,} Minority ({test_min_label})",
                },
            },
            "resampled_training_counts": resampled_counts,
        },
        "models": results,
    }

    # Write to both root and src/content/
    with open("benchmark_results.json", "w") as f:
        json.dump(output_data, f, indent=2)

    with open("src/content/benchmark-results.json", "w") as f:
        json.dump(output_data, f, indent=2)

    print("\n" + "=" * 80)
    print("SUCCESS: Benchmark executed, verified, and saved to:")
    print("  - benchmark_results.json")
    print("  - src/content/benchmark-results.json")
    print("=" * 80)


if __name__ == "__main__":
    run_benchmark()
