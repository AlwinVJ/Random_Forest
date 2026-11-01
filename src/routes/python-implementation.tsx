import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database } from "lucide-react";
import { CodeBlock, ComparisonTable, DifficultyBadge, Meta, PageHeader, SectionHeading } from "@/components/lab/primitives";

export const Route = createFileRoute("/python-implementation")({
  head: () => ({
    meta: [
      { title: "Python Implementation — Random Forest Lab" },
      { name: "description", content: "Build Random Forest classifiers and regressors in Python with scikit-learn." },
      { property: "og:title", content: "Python Implementation — Random Forest Lab" },
      { property: "og:description", content: "Hands-on scikit-learn tutorials for Random Forest." },
    ],
  }),
  component: PythonPage,
});

const steps = ["Load & inspect data", "Train / test split", "Fit the forest", "Evaluate metrics", "Tune hyperparameters", "Interpret features"];

const clf = `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, random_state=42)

clf = RandomForestClassifier(n_estimators=300, oob_score=True, random_state=42)
clf.fit(X_tr, y_tr)

print("OOB score:", clf.oob_score_)
print(classification_report(y_te, clf.predict(X_te)))`;

const reg = `from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

X, y = fetch_california_housing(return_X_y=True)
reg = RandomForestRegressor(n_estimators=200, max_features=0.5, n_jobs=-1)
reg.fit(X[:16000], y[:16000])

pred = reg.predict(X[16000:])
print("MAE:", mean_absolute_error(y[16000:], pred))
print("R2 :", r2_score(y[16000:], pred))`;

function PythonPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Course", to: "/" }, { label: "Practical Learning" }, { label: "Python Implementation" }]} eyebrow="Tutorial" title="Python Implementation" intro="From raw data to evaluated models using scikit-learn.">
        <Meta>2 h</Meta>
        <DifficultyBadge level="Intermediate" />
      </PageHeader>

      <section className="mt-10">
        <SectionHeading index="01" title="Implementation roadmap" />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="surface flex items-center gap-3 p-4 text-sm">
              <span className="font-mono text-primary">{String(i + 1).padStart(2, "0")}</span>{s}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <SectionHeading index="02" title="Datasets" />
        <ComparisonTable head={["Dataset", "Task", "Rows", "Features"]} rows={[
          [<span className="flex items-center gap-2"><Database className="size-3.5 text-accent" />Breast Cancer Wisconsin</span>, "Classification", "569", "30"],
          [<span className="flex items-center gap-2"><Database className="size-3.5 text-accent" />California Housing</span>, "Regression", "20,640", "8"],
        ]} />
      </section>

      <section className="mt-14">
        <SectionHeading index="03" title="Classification project" desc="Predict malignant vs. benign tumours." />
        <CodeBlock code={clf} filename="classification.py" />
      </section>

      <section className="mt-14">
        <SectionHeading index="04" title="Regression project" desc="Predict median house value." />
        <CodeBlock code={reg} filename="regression.py" />
      </section>

      <section className="mt-14">
        <SectionHeading index="05" title="Evaluation metrics" />
        <ComparisonTable head={["Metric", "Task", "Best when"]} rows={[
          ["Accuracy", "Classification", "Classes are balanced"],
          ["F1 Score", "Classification", "Precision and recall both matter"],
          ["ROC-AUC", "Classification", "Ranking quality is key"],
          ["MAE", "Regression", "Errors should be read in target units"],
          ["R²", "Regression", "Comparing explained variance"],
        ]} />
      </section>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {([["Classification Project", "/classification-project"], ["Regression Project", "/regression-project"]] as const).map(([t, to]) => (
          <Link key={to} to={to} className="surface group flex items-center justify-between p-5 hover:border-primary/40">
            <span className="font-medium">{t}</span><ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
