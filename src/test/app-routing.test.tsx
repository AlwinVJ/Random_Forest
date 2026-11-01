import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
  });

  const criticalRoutes = [
    "/",
    "/roadmap",
    "/ensemble-learning",
    "/decision-trees",
    "/random-forest",
    "/bootstrap-sampling",
    "/bagging",
    "/classification",
    "/regression",
    "/bias-variance",
    "/hyperparameters",
    "/oob-estimation",
    "/feature-importance",
    "/imbalanced-data",
    "/class-weighting",
    "/smote",
    "/hyperparameter-optimization",
    "/advanced-techniques",
    "/mathematical-deep-dive",
    "/python-implementation",
    "/classification-project",
    "/regression-project",
    "/algorithm-comparison",
    "/applications",
    "/assessment",
    "/playground",
  ];

  criticalRoutes.forEach((path) => {
    it(`successfully matches a route definition for ${path}`, () => {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });
  });
});
