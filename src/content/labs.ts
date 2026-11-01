import { Shuffle, Vote, LineChart, Scale, type LucideIcon } from "lucide-react";

export interface LabDef { id: string; title: string; desc: string; icon: LucideIcon; tags: string[] }

export const labs: LabDef[] = [
  { id: "bootstrap", title: "Bootstrap Sampling Simulator", desc: "Draw samples with replacement and inspect which rows end up out-of-bag.", icon: Shuffle, tags: ["Sampling", "OOB"] },
  { id: "voting", title: "Classification Voting Simulator", desc: "Watch individual trees vote and see how the majority decides the final class.", icon: Vote, tags: ["Classification"] },
  { id: "regression", title: "Regression Aggregation Simulator", desc: "Average tree predictions and observe how the ensemble smooths noise.", icon: LineChart, tags: ["Regression"] },
  { id: "bias-variance", title: "Bias-Variance Explorer", desc: "Adjust depth and forest size to see bias and variance trade off.", icon: Scale, tags: ["Theory"] },
];
