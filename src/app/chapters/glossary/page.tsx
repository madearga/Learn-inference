import { getGlossaryContent } from "@/lib/content";
import { notFound } from "next/navigation";

export default function GlossaryPage() {
  const data = getGlossaryContent();
  if (!data) notFound();

  // Group by letter
  const byLetter: Record<string, { term: string; definition: string }[]> = {};
  for (const t of data.terms) {
    if (!byLetter[t.letter]) byLetter[t.letter] = [];
    byLetter[t.letter].push({ term: t.term, definition: t.definition });
  }

  const letters = Object.keys(byLetter).sort();

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

        {/* Glossary entries */}
        <div className="mt-12 flex flex-col gap-10">
          {letters.map((letter) => (
            <div key={letter}>
              <h2 className="font-serif mb-4 text-2xl font-medium">{letter}</h2>
              <dl className="flex flex-col gap-4">
                {byLetter[letter].map((entry, i) => (
                  <div key={i} className="border-hairline border-b pb-4">
                    <dt className="font-medium">{entry.term}</dt>
                    <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {entry.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
