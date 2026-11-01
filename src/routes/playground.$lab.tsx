import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/lab/primitives";
import { labs } from "@/content/labs";
import { BootstrapLab } from "@/components/lab/experiments/BootstrapLab";
import { FeatureSelectionLab } from "@/components/lab/experiments/FeatureSelectionLab";
import { VotingLab } from "@/components/lab/experiments/VotingLab";
import { RegressionLab } from "@/components/lab/experiments/RegressionLab";
import { BiasVarianceLab } from "@/components/lab/experiments/BiasVarianceLab";
import { TreeSplittingLab } from "@/components/lab/experiments/TreeSplittingLab";

export const Route = createFileRoute("/playground/$lab")({
  loader: ({ params }) => {
    const lab = labs.find((l) => l.id === params.lab);
    if (!lab) throw notFound();
    return { id: lab.id };
  },
  head: ({ loaderData }) => {
    const lab = labs.find((l) => l.id === loaderData?.id);
    const title = lab ? `${lab.title} — Random Forest Lab` : "Lab — Random Forest Lab";
    return {
      meta: [
        { title },
        { name: "description", content: lab?.desc ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: lab?.desc ?? "" },
      ],
    };
  },
  component: LabRunnerPage,
});

function LabRunnerPage() {
  const { id } = Route.useLoaderData();
  const lab = labs.find((l) => l.id === id)!;

  const currentIdx = labs.findIndex((l) => l.id === id);
  const nextLab = currentIdx < labs.length - 1 ? labs[currentIdx + 1] : null;

  const renderExperiment = () => {
    switch (id) {
      case "bootstrap":
        return <BootstrapLab />;
      case "feature-selection":
        return <FeatureSelectionLab />;
      case "voting":
        return <VotingLab />;
      case "regression":
        return <RegressionLab />;
      case "bias-variance":
        return <BiasVarianceLab />;
      case "tree-splitting":
        return <TreeSplittingLab />;
      default:
        return <BootstrapLab />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        crumbs={[
          { label: "Course", to: "/" },
          { label: "Interactive Playground", to: "/playground" },
          { label: lab.shortTitle },
        ]}
        eyebrow="Interactive Experiment"
        title={lab.title}
        intro={lab.desc}
      />

      <div className="mt-8">
        {renderExperiment()}
      </div>

      {/* Navigation Footer */}
      <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
        <Button asChild variant="outline" size="sm">
          <Link to="/playground">
            <ArrowLeft className="size-3.5 mr-1" /> Back to Laboratory Index
          </Link>
        </Button>

        {nextLab && (
          <Button asChild size="sm">
            <Link to="/playground/$lab" params={{ lab: nextLab.id }}>
              Next Experiment: {nextLab.shortTitle} <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
