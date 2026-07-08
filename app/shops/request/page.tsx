import type { Metadata } from "next";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import RequestForm from "./RequestForm";

export const metadata: Metadata = {
  title: `${copy.request.title} | ${copy.serviceName}`,
};

export default function RequestShopPage() {
  return (
    <div className="mx-auto max-w-xl py-2">
      <p className={t.eyebrow}>{copy.request.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.request.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy.request.subtitle}</p>
      <div className="mt-8">
        <RequestForm />
      </div>
    </div>
  );
}
