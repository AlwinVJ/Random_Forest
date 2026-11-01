import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Callout, PageHeader, PlaceholderViz } from "@/components/lab/primitives";
import { labs } from "@/content/labs";

export const Route = createFileRoute("/playground/$lab")({
  loader: ({ params }) => {
    const lab = labs.find((l) => l.id === params.lab);
    if (!lab) throw notFound();
    return { id: lab.id };
  },
  head: ({ loaderData }) => {
    const lab = labs.find((l) => l.id === loaderData?.id);
    const title = lab ? `${lab.title} — Random Forest Lab` : "Lab — Random Forest Lab";
    return { meta: [{ title }, { name: "description", content: lab?.desc ?? "" }, { property: "og:title", content: title }, { property: "og:description", content: lab?.desc ?? "" }] };
  },
  component: LabPage,
});

function LabPage() {
  const { id } = Route.useLoaderData();
  const lab = labs.find((l) => l.id === id)!;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader crumbs={[{ label: "Playground", to: "/playground" }, { label: lab.title }]} eyebrow="Lab bench" title={lab.title} intro={lab.desc} />
      <div className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="surface space-y-5 p-5">
          <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Parameters</div>
          {["Number of trees", "Sample size", "Max depth"].map((p) => (
            <div key={p}>
              <div className="mb-2 flex justify-between text-sm"><span>{p}</span><span className="font-mono text-muted-foreground">—</span></div>
              <div className="h-1.5 rounded-full bg-secondary"><div className="h-full w-1/2 rounded-full bg-primary/50" /></div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" disabled><Play />Run</Button>
            <Button size="sm" variant="outline" disabled><RotateCcw />Reset</Button>
          </div>
        </div>
        <div className="space-y-4">
          <PlaceholderViz label="Simulation canvas" height={360} />
          <Callout type="warning" title="Coming in the next development phase">This simulator's controls and visualisation will become interactive in Phase 2.</Callout>
        </div>
      </div>
      <Button asChild variant="ghost" className="mt-8"><Link to="/playground"><ArrowLeft />Back to Playground</Link></Button>
    </div>
  );
}
