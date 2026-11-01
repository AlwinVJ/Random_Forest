import { createFileRoute } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/lab/LessonTemplate";
import { ImbalancedLabModule } from "@/components/lab/ImbalancedLabModule";
import { lessons } from "@/content/lessons";

const lesson = lessons["class-weighting"]!;

export const Route = createFileRoute("/class-weighting")({
  head: () => ({
    meta: [
      { title: `${lesson.title} — Random Forest Lab` },
      { name: "description", content: lesson.intro },
      { property: "og:title", content: `${lesson.title} — Random Forest Lab` },
      { property: "og:description", content: lesson.intro },
    ],
  }),
  component: ClassWeightingPage,
});

function ClassWeightingPage() {
  return (
    <div>
      <LessonTemplate lesson={lesson} />
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <ImbalancedLabModule />
      </div>
    </div>
  );
}
