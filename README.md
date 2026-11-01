# Random Forest Lab

An interactive, production-ready educational platform for mastering **Random Forest** in machine learning — from ensemble-learning foundations, decision tree mathematics, and statistical asymptotic proofs to advanced tuning strategies, Python Scikit-Learn workflows, and real-time laboratory simulations.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Curriculum Syllabus](#curriculum-syllabus)
- [Interactive Laboratory](#interactive-laboratory)
- [Mathematical Deep Dive](#mathematical-deep-dive)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Project Structure](#project-structure)
- [Academic References](#academic-references)

---

## Overview

**Random Forest Lab** is designed as a university-grade learning environment for students, researchers, and machine learning practitioners who want to understand not only *how* to invoke `RandomForestClassifier` and `RandomForestRegressor`, but fundamentally *why* the algorithm works mathematically, how randomness dampens variance, and how to operate tree ensembles effectively in production.

The platform operates **entirely client-side** as a modern Single Page Application (SPA), requiring no backend servers, databases, or third-party paid APIs. All mathematical formulas are typeset dynamically via **KaTeX**, and all simulations perform genuine live calculations in TypeScript.

---

## Key Features

1. **Complete 16-Module Curriculum**:
   - Every topic includes theoretical explanations, mathematical formulations, step-by-step derivations, numerical worked examples, Random Forest connections, production Python code with copy support, common misconceptions, advantages/limitations, key takeaways, and an interactive concept quiz.

2. **6 Real-Time Laboratory Simulators**:
   - **Bootstrap Sampling**: Sample with replacement from custom dataset sizes $N$, calculate Out-of-Bag (OOB) rows, and empirically verify the $1 - 1/e \approx 63.2\%$ inclusion limit.
   - **Random Feature Subspace Explorer**: Simulate candidate feature selection $m = \lfloor \sqrt{p} \rfloor$ and $m = \lfloor p/3 \rfloor$ across tree split depths to observe tree decorrelation.
   - **Classification Voting & Aggregation**: Configure individual tree probabilities and compare Hard Voting (discrete mode) versus Soft Voting (probability averaging).
   - **Regression Aggregation & Smoothing**: Adjust tree predictions, simulate noisy estimators, and observe standard error decay $\sigma / \sqrt{B}$.
   - **Bias-Variance Tradeoff Explorer**: Interactively explore the Breiman-Hastie variance formula $\text{Var} = \rho \sigma^2 + \frac{1-\rho}{B}\sigma^2$, observing the correlation floor $\rho\sigma^2$.
   - **Decision Tree Splitting & Impurity**: Interactively evaluate 2D classification points, test feature thresholds, and calculate parent Gini, child Gini, and Information Gain live.

3. **Dedicated Mathematical Deep Dive**:
   - 14 rigorous mathematical topics covering axiomatic probability, Bayes' rule, Multinomial sampling, Binomial voting distribution, Linearity of expectation, Covariance & correlation, Asymptotic limits, Strong Law of Large Numbers, Central Limit Theorem, Bias-Variance decomposition, Breiman-Hastie variance formula, Correlated error mechanics, and Big-O computational complexity.

4. **Production Python Workflows**:
   - Progressive Scikit-Learn tutorials with runnable code covering imports, exploratory data analysis, stratified train-test splitting, baseline benchmarking, parallel ensemble fitting, hyperparameter optimization, and joblib serialization.

5. **Certification Knowledge Assessment**:
   - A 40-question interactive examination engine across 4 specialized categories (Conceptual, Mathematical, Algorithmic, Practical Scenarios) featuring instant answer checking, detailed explanations, live score tallying, and pass/fail evaluation (70% benchmark).

6. **GitHub Pages Ready**:
   - Standalone client-side Vite SPA configured with relative base paths, hash-based routing (`createHashHistory()`), 404 fallback handling, and automated GitHub Actions CI/CD deployment.

---

## Curriculum Syllabus

### Fundamentals
- **Module 01: Ensemble Learning** — Wisdom of crowds, homogeneous vs heterogeneous ensembles, Condorcet Jury Theorem.
- **Module 02: Decision Trees** — Recursive binary splitting, CART algorithm, Gini impurity, Shannon entropy, Information Gain.
- **Module 03: Random Forest Architecture** — Dual-source randomness (bootstrap rows + random feature subspaces), ensemble aggregation.
- **Module 04: Bootstrap Sampling** — Sampling with replacement, duplicate frequencies, derivation of asymptotic $1 - 1/e \approx 36.8\%$ OOB probability.
- **Module 05: Bagging (Bootstrap Aggregation)** — Parallel training, variance reduction of unstable base models, Breiman (1996) foundations.

### Core Concepts
- **Module 06: Classification** — Majority voting, class probability estimation, decision boundaries, ROC-AUC calibration.
- **Module 07: Regression** — Continuous target prediction, variance reduction splits, extrapolation limitations of tree ensembles.
- **Module 08: Bias-Variance Tradeoff** — Expected error decomposition, high-variance decision trees, Breiman-Hastie ensemble variance formula.

### Advanced Concepts
- **Module 09: Hyperparameters** — Deep dive into `n_estimators`, `max_features`, `max_depth`, `min_samples_leaf`, `min_samples_split`, `bootstrap`, `oob_score`, `class_weight`, `n_jobs`, and `ccp_alpha`.
- **Module 10: Out-of-Bag (OOB) Estimation** — Zero-leakage internal validation without cross-validation overhead.
- **Module 11: Feature Importance** — Mean Decrease in Impurity (MDI), cardinality bias, and Permutation Feature Importance (MDA).
- **Module 12: Imbalanced Data Strategies** — The Accuracy Paradox, cost-sensitive learning (`class_weight='balanced'`), Balanced Random Forest, Precision-Recall AUC.
- **Module 13: Hyperparameter Optimization** — GridSearchCV vs RandomizedSearchCV, cross-validation data leakage protection via Pipelines.
- **Module 14: Mathematical Deep Dive** — Complete library of proofs, theorems, and derivations.

### Practical Learning
- **Module 15: Python Implementation** — Complete 9-step production Scikit-Learn guide with serialization.
- **Case Study P1: Classification Project** — Breast Cancer Wisconsin biopsy diagnostic classification, baseline comparisons, confusion matrix, ROC-AUC.
- **Case Study P2: Regression Project** — California Housing median valuation, spatial coordinate partitioning, MAE, RMSE, and $R^2$.
- **Module 16: Algorithm Comparison** — Benchmarking Decision Tree, Random Forest, Extra Trees, AdaBoost, Gradient Boosting, XGBoost, and LightGBM.
- **Module 17: Real-World Applications** — Case studies across banking credit risk, fraud detection, healthcare oncology, predictive maintenance, and cybersecurity.

---

## Interactive Laboratory

The platform includes six dedicated, browser-based simulation benches accessible from the **Interactive Playground**:

| Lab Bench | Capability | Formula Verified |
| :--- | :--- | :--- |
| **01. Bootstrap Sampling** | Resample $N$ rows with replacement, identify duplicate and OOB sets | $P(\text{OOB}) = (1 - 1/N)^N \to 1/e \approx 36.8\%$ |
| **02. Feature Subspaces** | Evaluate candidate feature subsets ($m = \sqrt{p}, \log_2(p)$) across split nodes | $m = \lfloor \sqrt{p} \rfloor \quad (\text{clf}), \quad m = \lfloor p/3 \rfloor \quad (\text{reg})$ |
| **03. Classification Voting** | Compare Hard Voting (mode) vs Soft Voting (probability averaging) | $\hat{y}_{\text{hard}} = \text{mode}\{T_b(x)\}, \quad P(c\|x) = \frac{1}{B}\sum P_b(c\|x)$ |
| **04. Regression Aggregation** | Adjust continuous tree estimates and observe noise cancellation | $\hat{y} = \frac{1}{B}\sum T_b(x), \quad \text{SE}(\hat{y}) = \sigma / \sqrt{B}$ |
| **05. Bias-Variance Explorer** | Adjust tree depth, forest size $B$, and correlation $\rho$ to observe the error floor | $\text{Var}(\bar{f}) = \rho \sigma^2 + \frac{1 - \rho}{B}\sigma^2 \to \rho\sigma^2$ |
| **06. Tree Splitting Lab** | Adjust feature thresholds on 2D data to calculate Gini and Information Gain | $\text{IG}(S, A) = \text{Gini}(S) - \sum \frac{\|S_v\|}{\|S\|} \text{Gini}(S_v)$ |

---

## Technology Stack

- **Core**: React 19, TypeScript 5.7+
- **Bundler & Tooling**: Vite 6, `@tailwindcss/vite`
- **Routing**: TanStack Router (file-based routing with `createHashHistory()`)
- **State & Caching**: TanStack React Query 5
- **Styling**: Tailwind CSS v4 (`@theme inline`), custom OKLCH color palettes, minimal dark-theme scrollbars
- **Mathematical Typography**: KaTeX 0.16+
- **Component Primitives**: Radix UI, Lucide React icons
- **Data Visualizations**: Recharts, Custom responsive SVGs
- **Testing**: Vitest, React Testing Library, jsdom
- **Linting & Code Quality**: ESLint 9 (flat config), Prettier

---

## Architecture

The project is structured as a client-side Vite Single Page Application designed specifically for seamless static hosting on GitHub Pages:

```
┌────────────────────────────────────────────────────────┐
│                   Browser Client                       │
├────────────────────────────────────────────────────────┤
│  TanStack Router (Hash History: #/ensemble-learning)   │
├──────────────────────────┬─────────────────────────────┤
│      Course Pages        │     Interactive Simulators  │
│  (src/content/lessons)   │   (TypeScript Calculations) │
├──────────────────────────┼─────────────────────────────┤
│  KaTeX Math Typography   │     Recharts / Vector SVGs  │
├──────────────────────────┴─────────────────────────────┤
│  Tailwind CSS v4 (Dark Theme, Geist & JetBrains Mono)  │
└────────────────────────────────────────────────────────┘
```

- **Hash-based routing**: Ensures all direct links (`#/classification`, `#/playground/bootstrap`) work instantly without requiring server-side URL rewrite modules.
- **Relative asset URLs**: `base: "./"` in `vite.config.ts` ensures assets resolve cleanly regardless of the GitHub repository subpath.
- **Client-side computation**: All simulation loops, Gini impurity calculations, and variance reductions run directly in the browser's JavaScript engine.

---

## Getting Started

### Prerequisites

- Node.js (version 20 or 22 LTS recommended)
- npm (version 10 or higher)

Verify your environment:
```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/random-forest-lab.git
cd random-forest-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173` to explore the course.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with hot module replacement |
| `npm run build` | Compiles optimized static production assets into `dist/` |
| `npm run preview` | Serves the production build locally for verification |
| `npm run lint` | Runs ESLint validation across all TypeScript files |
| `npm run test` | Executes the Vitest unit test suite (32 tests) |
| `npm run test:watch` | Runs Vitest in interactive watch mode |

---

## GitHub Pages Deployment

The repository includes a ready-to-run GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Deployment Steps:

1. Push your code to the `main` branch of your GitHub repository.
2. In your GitHub repository settings, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will automatically run:
   - Check out code
   - Set up Node.js 22 with npm cache
   - Install dependencies (`npm ci`)
   - Run linter (`npm run lint`)
   - Execute test suite (`npm run test`)
   - Compile production build (`npm run build`)
   - Deploy the static `dist/` directory to GitHub Pages via official GitHub Pages actions
5. Your platform will be live at `https://<your-username>.github.io/<your-repo>/` with full routing and interactive simulations active.

---

## Project Structure

```text
random-forest-lab/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── 404.html                    # GitHub Pages SPA redirection fallback
│   ├── favicon.ico                 # Platform favicon
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── lab/                    # Core course & lesson components
│   │   │   ├── experiments/        # 6 Interactive laboratory simulators
│   │   │   │   ├── BiasVarianceLab.tsx
│   │   │   │   ├── BootstrapLab.tsx
│   │   │   │   ├── FeatureSelectionLab.tsx
│   │   │   │   ├── RegressionLab.tsx
│   │   │   │   ├── TreeSplittingLab.tsx
│   │   │   │   └── VotingLab.tsx
│   │   │   ├── AppShell.tsx        # Responsive sidebar, navigation & header
│   │   │   ├── ForestDiagram.tsx   # Vector ensemble architecture graphic
│   │   │   ├── LessonQuiz.tsx      # Interactive question verification component
│   │   │   ├── LessonTemplate.tsx  # 15-section standard lesson layout
│   │   │   ├── LessonVisual.tsx    # Dedicated concept vector diagrams
│   │   │   ├── MathView.tsx        # KaTeX LaTeX formula renderer
│   │   │   └── primitives.tsx      # Badges, callouts, cards, code blocks
│   │   └── ui/                     # Accessible UI components (Radix primitives)
│   ├── content/
│   │   ├── labs.ts                 # 6 Laboratory definitions & formulas
│   │   ├── lessons.ts              # Comprehensive 16-module curriculum content
│   │   └── nav.ts                  # Sidebar navigation structure (23 items)
│   ├── routes/                     # TanStack Router file-based route tree
│   │   ├── __root.tsx              # Root route shell with Toaster & Error boundary
│   │   ├── index.tsx               # Homepage with stats, roadmap, and lab highlights
│   │   ├── roadmap.tsx             # 8-stage learning journey
│   │   ├── playground.tsx          # Playground parent route
│   │   ├── playground.index.tsx    # Laboratory simulator index
│   │   ├── playground.$lab.tsx     # Dynamic laboratory experiment runner
│   │   ├── assessment.tsx          # 40-question certification exam engine
│   │   ├── mathematical-deep-dive.tsx # 14-topic mathematical proof library
│   │   ├── python-implementation.tsx # 9-step Scikit-Learn production guide
│   │   └── ...                     # Individual module routes
│   ├── test/
│   │   ├── app-routing.test.tsx    # Route matching & navigation tests
│   │   ├── curriculum-and-math.test.ts # Mathematical algorithms & syllabus integrity tests
│   │   └── setup.ts                # Vitest jsdom mocks
│   ├── main.tsx                    # React 19 application entrypoint
│   ├── router.tsx                  # TanStack Router instance (hash history)
│   └── styles.css                  # Tailwind CSS v4 design system
├── index.html                      # Root HTML entrypoint
├── package.json                    # Dependencies & project metadata
├── vite.config.ts                  # Vite build & chunking configuration
├── vitest.config.ts                # Vitest unit test configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## Academic References

The educational content in this platform is developed from authoritative machine learning literature:

1. **Breiman, Leo** (2001). *"Random Forests"*. Machine Learning, 45(1), 5–32.
2. **Breiman, Leo** (1996). *"Bagging Predictors"*. Machine Learning, 24(2), 123–140.
3. **Hastie, Trevor, Tibshirani, Robert, & Friedman, Jerome** (2009). *"The Elements of Statistical Learning: Data Mining, Inference, and Prediction"*. Springer Series in Statistics.
4. **Efron, Bradley** (1979). *"Bootstrap Methods: Another Look at the Jackknife"*. The Annals of Statistics, 7(1), 1–26.
5. **Geurts, Pierre, Ernst, Damien, & Wehenkel, Louis** (2006). *"Extremely Randomized Trees"*. Machine Learning, 63(1), 3–42.
6. **Bergstra, James, & Bengio, Yoshua** (2012). *"Random Search for Hyper-Parameter Optimization"*. Journal of Machine Learning Research, 13, 281–305.
7. **Pedregosa, Fabian, et al.** (2011). *"Scikit-learn: Machine Learning in Python"*. Journal of Machine Learning Research, 12, 2825–2830.

---

## License

This educational project is provided for university students, educators, and machine learning researchers.
