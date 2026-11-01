import {
  Home, Map, Layers, GitBranch, Trees, Shuffle, Boxes, Tags, TrendingUp, Scale,
  SlidersHorizontal, FlaskRound, BarChart3, ScaleIcon, Settings2, Sigma, Code2,
  ClipboardList, LineChart, GitCompare, Globe, FlaskConical, GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  { label: "Overview", items: [
    { title: "Introduction", to: "/", icon: Home },
    { title: "Learning Roadmap", to: "/roadmap", icon: Map },
  ]},
  { label: "Fundamentals", items: [
    { title: "Ensemble Learning", to: "/ensemble-learning", icon: Layers },
    { title: "Decision Trees", to: "/decision-trees", icon: GitBranch },
    { title: "Random Forest Architecture", to: "/random-forest", icon: Trees },
    { title: "Bootstrap Sampling", to: "/bootstrap-sampling", icon: Shuffle },
    { title: "Bagging", to: "/bagging", icon: Boxes },
  ]},
  { label: "Core Concepts", items: [
    { title: "Classification", to: "/classification", icon: Tags },
    { title: "Regression", to: "/regression", icon: TrendingUp },
    { title: "Bias-Variance Tradeoff", to: "/bias-variance", icon: Scale },
  ]},
  { label: "Advanced Concepts", items: [
    { title: "Hyperparameters", to: "/hyperparameters", icon: SlidersHorizontal },
    { title: "Out-of-Bag Estimation", to: "/oob-estimation", icon: FlaskRound },
    { title: "Feature Importance", to: "/feature-importance", icon: BarChart3 },
    { title: "Imbalanced Data", to: "/imbalanced-data", icon: ScaleIcon },
    { title: "Hyperparameter Optimization", to: "/hyperparameter-optimization", icon: Settings2 },
    { title: "Advanced Techniques", to: "/advanced-techniques", icon: Layers },
    { title: "Mathematical Deep Dive", to: "/mathematical-deep-dive", icon: Sigma },
  ]},
  { label: "Practical Learning", items: [
    { title: "Python Implementation", to: "/python-implementation", icon: Code2 },
    { title: "Classification Project", to: "/classification-project", icon: ClipboardList },
    { title: "Regression Project", to: "/regression-project", icon: LineChart },
    { title: "Algorithm Comparison", to: "/algorithm-comparison", icon: GitCompare },
    { title: "Real-World Applications", to: "/applications", icon: Globe },
  ]},
  { label: "Practice", items: [
    { title: "Interactive Playground", to: "/playground", icon: FlaskConical },
    { title: "Knowledge Assessment", to: "/assessment", icon: GraduationCap },
  ]},
];

export const allNavItems = navGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));
