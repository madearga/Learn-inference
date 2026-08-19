import { getGlossaryContent } from "@/lib/content";
import { GlossarySearch } from "@/components/GlossarySearch";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary · Learn Inference",
  description: "Every term of art in inference engineering, defined once.",
};

export default function GlossaryPage() {
  const data = getGlossaryContent();
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-[110rem] px-5 sm:px-6">
      <div className="mx-auto max-w-4xl py-8">
        {/* Breadcrumb */}
        <div className="text-muted-foreground mb-1 text-sm">
          Appendix · pp. 209–230
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-medium tracking-[-0.02em]">
          Glossary
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Every term, defined once
        </p>

        {/* Intro */}
        <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed">
          {data.intro || "Every term of art in this book, defined once. Search covers both the terms and their definitions, so the concept works even when the name does not come to mind."}
        </p>

        {/* Term count */}
        <p className="text-muted-foreground mt-4 text-sm">
          {data.terms.length} terms
        </p>

        {/* Search + Results */}
        <div className="mt-6">
          <GlossarySearch terms={data.terms} />
        </div>
      </div>
    </div>
  );
}
