import type { SceneTag } from "@/lib/types";
import { SCENE_LABEL } from "@/lib/quiz";

export default function ScenePills({ tags, max = 3 }: { tags: SceneTag[]; max?: number }) {
  const shown = tags.slice(0, max);
  return (
    <ul className="flex flex-wrap gap-1.5 text-xs">
      {shown.map((tag) => (
        <li key={tag} className="rounded bg-background px-1.5 py-0.5 text-muted">
          {SCENE_LABEL[tag]}
        </li>
      ))}
    </ul>
  );
}
