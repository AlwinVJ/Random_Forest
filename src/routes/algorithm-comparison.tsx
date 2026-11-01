import { createFileRoute } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/lab/LessonTemplate";
import { AlgorithmComparisonModule } from "@/components/lab/AlgorithmComparisonModule";
import { lessons } from "@/content/lessons";

const lesson = lessons["algorithm-comparison"]!;

export const Route = createFileRoute("/algorithm-comparison")({
  head: () => ({
    meta: [
      { title: `${lesson.title} — Random Forest Lab` },
      { name: "description", content: lesson.intro },
      { property: "og:title", content: `${lesson.title} — Random Forest Lab` },
      { property: "og:description", content: lesson.intro },
    ],
  }),
  component: AlgorithmComparisonPage,
});

function AlgorithmComparisonPage() {
  return (
    <div>
      <LessonTemplate lesson={lesson} />
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <AlgorithmComparisonModule />
      </div>
    </div>
  );
}

