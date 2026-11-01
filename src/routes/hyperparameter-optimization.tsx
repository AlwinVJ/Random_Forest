import { createFileRoute } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/lab/LessonTemplate";
import { lessons } from "@/content/lessons";

const lesson = lessons["hyperparameter-optimization"]!;

export const Route = createFileRoute("/hyperparameter-optimization")({
  head: () => ({
    meta: [
      { title: `${lesson.title} — Random Forest Lab` },
      { name: "description", content: lesson.intro },
      { property: "og:title", content: `${lesson.title} — Random Forest Lab` },
      { property: "og:description", content: lesson.intro },
    ],
  }),
  component: () => <LessonTemplate lesson={lesson} />,
});
