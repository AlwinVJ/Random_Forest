import { createFileRoute } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/lab/LessonTemplate";
import { HyperparameterLabModule } from "@/components/lab/HyperparameterLabModule";
import { lessons } from "@/content/lessons";

const lesson = lessons["hyperparameters"]!;

export const Route = createFileRoute("/hyperparameters")({
  head: () => ({
    meta: [
      { title: `${lesson.title} — Random Forest Lab` },
      { name: "description", content: lesson.intro },
      { property: "og:title", content: `${lesson.title} — Random Forest Lab` },
      { property: "og:description", content: lesson.intro },
    ],
  }),
  component: HyperparametersPage,
});

function HyperparametersPage() {
  return (
    <div>
      <LessonTemplate lesson={lesson} />
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <HyperparameterLabModule />
      </div>
    </div>
  );
}

