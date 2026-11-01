# Random Forest Lab Guidelines

## Project Architecture & Rules
- **Static Frontend SPA**: This project is a standalone, client-only educational web platform built with React 19, TypeScript, Vite, TanStack Router, Tailwind CSS, and KaTeX.
- **Hosting Target**: Designed for GitHub Pages (no server runtime, no SSR, relative base path, hash-based routing).
- **Course Content**: Educational curriculum lives in `src/content/*` (lessons, labs, navigation). Route files in `src/routes/*` render this content using reusable components in `src/components/lab/*`.
- **UI & Design System**: Preserves the established dark-mode visual identity, typography (Geist + JetBrains Mono), oklch color palette, responsive sidebar navigation, and card/panel aesthetics.
- **Mathematical Rigor**: All mathematical formulas use KaTeX rendering for standard notation, derivations, and equations.
- **Interactive Simulations**: All laboratory simulations perform genuine calculations in TypeScript (no hardcoded animations or fake data).
