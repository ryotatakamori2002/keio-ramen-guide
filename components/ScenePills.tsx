import type { SceneTag } from "@/lib/types";
import { SCENE_LABEL } from "@/lib/quiz";

export default function ScenePills({ tags, max = 3 }: { tags: SceneTag[]; max?: number }) {
  const shown = tags.slice(0, max);
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
        >
          {SCENE_LABEL[tag]}
        </li>
      ))}
    </ul>
  );
}
