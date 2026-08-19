import { getReadingContent } from "@/lib/content";
import { furtherReadingSections } from "@/data/chapters";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Further reading · Learn Inference",
  description:
    "Papers and resources worth your time for understanding inference engineering.",
};

export default function ReadingPage() {
  const data = getReadingContent();
  if (!data) notFound();

  function slugForSection(title: string, idx: number): string {
    const numMatch = title.match(/^(B\.\d+)/);
    if (numMatch) {
      const found = furtherReadingSections.find((s) => s.number === numMatch[1]);
      if (found) return found.slug;
    }
    return `section-${idx}`;
  }

  return (
    <div className="mx-auto max-w-[110rem] px-5 sm:px-6">
      <div className="mx-auto max-w-4xl py-8">
        {/* Breadcrumb */}
        <div className="text-muted-foreground mb-1 text-sm">
          Appendix · pp. 231–240
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-medium tracking-[-0.02em]">
          Further reading
        </h1>

        {/* Intro */}
        {data.intro && (
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
            {data.intro}
          </p>
        )}

        {/* Sections */}
        <div className="mt-12 flex flex-col gap-10">
          {data.sections.map((section, idx) => {
            const slug = slugForSection(section.title, idx);
            return (
            <div key={idx} id={slug} className="scroll-mt-20">
              <h2 className="font-serif mb-4 text-xl font-medium">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
