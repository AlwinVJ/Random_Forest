import json
import os
import sys
import numpy as np

# Ensure root directory is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.benchmark_imbalanced import (
    get_class_distribution,
    get_min_maj_labels_and_counts,
    compute_resampled_counts,
)


def test_synthetic_distributions():
    print("Testing synthetic dataset distribution generalization...")

    # Test Case 1: Standard binary imbalance (0=Maj, 1=Min)
    # Total: 500 samples (450 class 0, 50 class 1)
    y_synth1 = np.array([0] * 450 + [1] * 50)
    X_synth1 = np.random.randn(500, 4)

    counts1 = compute_resampled_counts(X_synth1, y_synth1, random_state=42)
    brf1 = counts1["balanced_rf"]

    assert brf1["total"] == 500, f"Expected total 500, got {brf1['total']}"
    assert brf1["bag_size"] == 100, f"Expected bag_size 100, got {brf1['bag_size']}"
    assert brf1["majority_per_tree"] == 50
    assert brf1["minority_per_tree"] == 50
    expected_desc1 = "500 (Bootstraps: 100 per tree [50 Maj + 50 Min])"
    assert brf1["description"] == expected_desc1, f"Mismatch: {brf1['description']} != {expected_desc1}"
    assert "170" not in brf1["description"], "Hardcoded 170 found in description!"
    print("  [PASS] Test Case 1: Standard binary (450 Maj, 50 Min)")

    # Test Case 2: Inverted binary imbalance (0=Min, 1=Maj)
    # Total: 600 samples (75 class 0, 525 class 1)
    y_synth2 = np.array([0] * 75 + [1] * 525)
    X_synth2 = np.random.randn(600, 4)

    counts2 = compute_resampled_counts(X_synth2, y_synth2, random_state=42)
    brf2 = counts2["balanced_rf"]

    assert brf2["total"] == 600
    assert brf2["bag_size"] == 150
    assert brf2["majority_per_tree"] == 75
    assert brf2["minority_per_tree"] == 75
    expected_desc2 = "600 (Bootstraps: 150 per tree [75 Maj + 75 Min])"
    assert brf2["description"] == expected_desc2, f"Mismatch: {brf2['description']} != {expected_desc2}"
    print("  [PASS] Test Case 2: Inverted binary (75 Min, 525 Maj)")

    # Test Case 3: Arbitrary integer labels (10=Min, 20=Maj)
    # Total: 300 samples (30 class 10, 270 class 20)
    y_synth3 = np.array([10] * 30 + [20] * 270)
    X_synth3 = np.random.randn(300, 4)

    counts3 = compute_resampled_counts(X_synth3, y_synth3, random_state=42)
    brf3 = counts3["balanced_rf"]

    assert brf3["total"] == 300
    assert brf3["bag_size"] == 60
    assert brf3["majority_per_tree"] == 30
    assert brf3["minority_per_tree"] == 30
    expected_desc3 = "300 (Bootstraps: 60 per tree [30 Maj + 30 Min])"
    assert brf3["description"] == expected_desc3, f"Mismatch: {brf3['description']} != {expected_desc3}"
    print("  [PASS] Test Case 3: Arbitrary non-standard labels (30 Min [10], 270 Maj [20])")


def test_persisted_benchmark_files():
    print("Testing persisted benchmark JSON files...")

    for path in ["benchmark_results.json", "src/content/benchmark-results.json"]:
        assert os.path.exists(path), f"File {path} does not exist"
        with open(path, "r") as f:
            data = json.load(f)

        meta = data["metadata"]
        train_dist = meta["dataset_distributions"]["train"]
        train_total = train_dist["total"]
        train_min = train_dist["minority"]
        train_maj = train_dist["majority"]

        brf = meta["resampled_training_counts"]["balanced_rf"]

        # Check fields exist and are numerical
        assert brf["total"] == train_total, f"Expected {train_total}, got {brf['total']}"
        assert brf["bag_size"] == train_min * 2, f"Expected {train_min * 2}, got {brf['bag_size']}"
        assert brf["majority_per_tree"] == train_min
        assert brf["minority_per_tree"] == train_min

        # Verify dynamic description format
        expected_desc = f"{train_total:,} (Bootstraps: {train_min * 2:,} per tree [{train_min:,} Maj + {train_min:,} Min])"
        assert brf["description"] == expected_desc, f"Description mismatch in {path}: {brf['description']} != {expected_desc}"

        print(f"  [PASS] {path} verified: {brf['description']}")


if __name__ == "__main__":
    test_synthetic_distributions()
    test_persisted_benchmark_files()
    print("\nAll benchmark metadata tests PASSED successfully!")
