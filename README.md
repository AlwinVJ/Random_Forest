# Random Forest Lab

An interactive educational platform for learning **Random Forest** in
machine learning --- from ensemble-learning fundamentals and decision
trees to mathematical foundations, advanced techniques, and practical
Python workflows.

> **Project status:** UI-first development. The current version
> establishes the website structure, navigation, lesson layouts, and
> learning-lab interface. Detailed lesson content and working
> simulations will be developed incrementally.

## Overview

Random Forest Lab is designed as a structured learning environment for
students and developers who want to understand not only how to use
Random Forest, but also why the algorithm works.

The platform is organized into learning modules, practical project
guides, an interactive-lab area, and knowledge assessment pages.

## Learning areas

The current website navigation is organized into the following areas:

### Overview

-   Introduction
-   Learning Roadmap

### Fundamentals

-   Ensemble Learning
-   Decision Trees
-   Random Forest Architecture
-   Bootstrap Sampling
-   Bagging

### Core concepts

-   Classification
-   Regression
-   Bias--Variance Tradeoff

### Advanced concepts

-   Hyperparameters
-   Out-of-Bag (OOB) Estimation
-   Feature Importance
-   Imbalanced Data
-   Hyperparameter Optimization
-   Advanced Techniques
-   Mathematical Deep Dive

### Practical learning

-   Python Implementation
-   Classification Project
-   Regression Project
-   Algorithm Comparison
-   Real-World Applications

### Practice

-   Interactive Playground
-   Knowledge Assessment

The curriculum will be expanded to include conceptual explanations,
mathematical derivations, numerical examples, Python code,
visualizations, and practical exercises.

## Technology stack

The current project uses:

-   **React** --- component-based user interface
-   **TypeScript** --- static typing
-   **Vite** --- development server and build tooling
-   **TanStack Start / TanStack Router** --- application routing and
    application framework
-   **Tailwind CSS** --- styling
-   **Lucide React** --- icons
-   **Recharts** --- chart components
-   **Vitest** --- testing
-   **ESLint and Prettier** --- code quality and formatting

## Getting started

### Prerequisites

Install a current Node.js LTS release compatible with the project's Vite
version, along with npm.

Check your installed versions:

``` bash
node --version
npm --version
```

### 1. Clone the repository

Replace `<your-username>` with your GitHub username:

``` bash
git clone https://github.com/<your-username>/<your-repository>.git
```

### 2. Move into the project directory

``` bash
cd <your-repository>
```

If the application files are inside a subdirectory, move into the
directory containing `package.json` before running the next commands.

### 3. Install dependencies

``` bash
npm install
```

The repository currently includes a Bun lockfile. If you prefer to use
Bun and want to install from that lockfile, use:

``` bash
bun install
```

Use one package manager consistently and avoid mixing lockfiles.

### 4. Start the development server

``` bash
npm run dev
```

Open the local URL printed in the terminal to view the website.

## Available scripts

  Command                Description
  ---------------------- ---------------------------------------
  `npm run dev`          Starts the local development server
  `npm run build`        Creates a production build
  `npm run build:dev`    Creates a development-mode build
  `npm run preview`      Previews the production build locally
  `npm run lint`         Runs ESLint
  `npm run format`       Formats project files with Prettier
  `npm run test`         Runs the Vitest test suite
  `npm run test:watch`   Runs Vitest in watch mode

## Project structure

The main application code is organized under `src/`.

``` text
src/
├── components/
│   ├── lab/              # Shared learning-lab and lesson components
│   └── ui/               # Reusable UI components
├── content/
│   ├── labs.ts           # Learning-lab metadata
│   ├── lessons.ts        # Lesson content and metadata
│   └── nav.ts            # Sidebar navigation structure
├── hooks/                # Reusable React hooks
├── lib/                  # Shared utilities and application helpers
├── routes/               # Route-level pages
├── styles/               # Application styles (if present)
└── ...
```

Other important files:

``` text
.
├── public/               # Static assets
├── package.json          # Dependencies and npm scripts
├── vite.config.ts        # Vite / TanStack configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
└── README.md
```

## Development roadmap

Development is planned in stages so the interface and educational
material can be validated before adding more complex behavior.

  -----------------------------------------------------------------------
  Phase                   Focus                   Planned outcome
  ----------------------- ----------------------- -----------------------
  1                       UI and application      Responsive layout,
                          structure               navigation, lesson
                                                  templates, and visual
                                                  design

  2                       Learning content        Complete, accurate
                                                  explanations and
                                                  mathematical
                                                  derivations

  3                       Visual learning         Decision-tree and
                                                  Random Forest diagrams

  4                       Interactive laboratory  Bootstrap sampling,
                                                  voting, regression
                                                  aggregation, and
                                                  bias--variance
                                                  experiments

  5                       Python implementation   Classification and
                                                  regression workflows
                                                  using Scikit-learn

  6                       Assessment              Conceptual,
                                                  mathematical, and
                                                  practical exercises

  7                       Quality and deployment  Testing, accessibility,
                                                  performance, and
                                                  hosting
  -----------------------------------------------------------------------

## Educational scope

The planned material will cover topics including:

-   Ensemble learning: bagging, boosting, and stacking
-   Decision-tree splitting: Gini impurity, entropy, and information
    gain
-   Bootstrap sampling and sampling with replacement
-   Random feature selection and tree decorrelation
-   Classification voting and regression aggregation
-   Bias--variance tradeoff and ensemble variance
-   Random Forest hyperparameters
-   Out-of-Bag error estimation
-   Mean Decrease in Impurity and permutation feature importance
-   Imbalanced classification and evaluation metrics
-   Cross-validation and hyperparameter search
-   Practical model development with Scikit-learn

## Deployment

The project is intended to be hosted publicly, with GitHub Pages as the
target hosting platform.

**Deployment note:** The current repository uses TanStack Start in
addition to Vite. A standard Vite static-site deployment workflow should
not be assumed to work without checking the framework's output and
routing requirements. GitHub Pages deployment configuration will be
added and verified as a separate task before publishing.

Until that configuration is in place, use the local development and
production-build commands above to validate changes.

## Contributing and development

This is an educational project that will evolve as the curriculum and
interactive components are implemented.

When adding a lesson or feature:

1.  Keep the navigation and page structure consistent.
2.  Separate lesson data from reusable presentation components.
3.  Explain mathematical notation and define every variable.
4.  Use numerical examples to support theoretical explanations.
5.  Keep visualizations educationally accurate.
6.  Test the production build after making changes.

## Project status

The current milestone is the **frontend foundation**. The website's UI
and module structure are being established first. Detailed educational
content, mathematical functionality, simulations, and assessment logic
are planned for subsequent phases.

------------------------------------------------------------------------

**Random Forest Lab** --- Learn the algorithm. Understand the
mathematics. Experiment with the model.
