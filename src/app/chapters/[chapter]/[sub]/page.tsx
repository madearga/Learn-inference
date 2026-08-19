import Link from "next/link";
import type { Metadata } from "next";
import { chapters, getAdjacentSubChapters, findSubChapter } from "@/data/chapters";
import { ArrowRightIcon } from "@/components/Header";
import { MobileTOC } from "@/components/MobileTOC";
import { QuantizationSimulator } from "@/components/QuantizationSimulator";
import { KeyboardNav } from "@/components/KeyboardNav";
import { getContent } from "@/lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const params: { chapter: string; sub: string }[] = [];
  for (const ch of chapters) {
    for (const sub of ch.subchapters) {
      params.push({ chapter: ch.slug, sub: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; sub: string }>;
}): Promise<Metadata> {
  const { chapter: chapterSlug, sub: subSlug } = await params;
  const found = findSubChapter(chapterSlug, subSlug);
  if (!found) return {};

  const content = getContent(chapterSlug, subSlug);
  const title = content?.sectionTitle || found.sub.title;

  return {
    title: `${title} · ${found.chapter.title} · Learn Inference`,
    description: content?.paragraphs[0]?.slice(0, 160) || undefined,
  };
}

function TableOfContents({ chapterSlug, currentSubSlug }: { chapterSlug: string; currentSubSlug: string }) {
  const ch = chapters.find((c) => c.slug === chapterSlug);
  if (!ch) return null;

  return (
    <nav className="text-muted-foreground">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide">
        Chapter {ch.number} · {ch.title}
      </div>
      <ul className="flex flex-col gap-1.5">
        {ch.subchapters.map((sub) => {
          const isActive = sub.slug === currentSubSlug;
          return (
            <li key={sub.slug}>
              <Link
                href={`/chapters/${ch.slug}/${sub.slug}`}
                className={`block text-sm transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "hover:text-foreground"
                }`}
              >
                <span className="tabular-nums">{sub.number}</span>{" "}
                {sub.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-signal/30 bg-signal/5 my-6 rounded-lg border-l-2 p-4">
      <div className="text-signal mb-1 text-sm font-medium">{title}</div>
      <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
    </div>
  );
}

export default async function SubChapterPage({
  params,
}: {
  params: Promise<{ chapter: string; sub: string }>;
}) {
  const { chapter: chapterSlug, sub: subSlug } = await params;
  const found = findSubChapter(chapterSlug, subSlug);
  if (!found) notFound();

  const content = getContent(chapterSlug, subSlug);
  if (!content) notFound();

  const { chapter, sub } = found;
  const { prev, next } = getAdjacentSubChapters(chapterSlug, subSlug);

  const prevHref = prev ? `/chapters/${prev.chapterSlug}/${prev.sub.slug}` : undefined;
  const nextHref = next ? `/chapters/${next.chapterSlug}/${next.sub.slug}` : undefined;

  return (
    <div className="mx-auto max-w-[110rem] px-5 sm:px-6">
      <KeyboardNav prevHref={prevHref} nextHref={nextHref} />
      <div className="flex gap-12 py-8">
        {/* Left sidebar - Table of Contents */}
        <aside className="hidden md:sticky md:top-[5.5rem] md:block md:w-56 md:self-start md:shrink-0">
          <TableOfContents chapterSlug={chapterSlug} currentSubSlug={subSlug} />
        </aside>

        {/* Mobile Table of Contents */}
        <div className="mb-6">
          <MobileTOC chapterSlug={chapterSlug} currentSubSlug={subSlug} />
        </div>

        {/* Main content */}
        <div className="min-w-0 max-w-3xl">
          {/* Breadcrumb */}
          <div className="text-muted-foreground mb-1 text-sm">
            <Link href={`/chapters/${chapterSlug}`} className="hover:text-foreground transition-colors">
              Chapter {chapter.number} · {chapter.title}
            </Link>
          </div>

          {/* Page indicator */}
          <div className="text-muted-foreground mb-6 text-xs">
            {content.pageNumber && content.totalPages
              ? `${content.pageNumber} of ${content.totalPages}`
              : ""}
          </div>

          {/* Section number + title */}
          {content.sectionNumber && (
            <div className="text-muted-foreground text-sm tabular-nums">
              {content.sectionNumber}
            </div>
          )}
          <h1 className="font-serif mt-1 text-3xl font-medium tracking-[-0.02em]">
            {content.sectionTitle || sub.title}
          </h1>

          {/* Body content */}
          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed">
            {content.paragraphs.map((p, i) => (
              <p key={i} className={p.startsWith("Figure ") ? "text-muted-foreground mt-2 text-sm italic" : ""}>
                {p}
              </p>
            ))}
          </div>

          {/* Interactive simulator for quantization page */}
          {chapterSlug === "techniques" && subSlug === "quantization" && (
            <QuantizationSimulator />
          )}

          {/* Sub-sections */}
          {content.subSections.map((ss, idx) => (
            <div key={idx} className="mt-10">
              <h2 className="font-serif flex items-center gap-2 text-xl font-medium">
                <span className="text-muted-foreground text-base tabular-nums">{ss.number}</span>
                {ss.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed">
                {ss.paragraphs.map((p, i) => (
                  <p key={i} className={p.startsWith("Figure ") ? "text-muted-foreground mt-2 text-sm italic" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Previous / Next navigation */}
          <nav className="border-hairline mt-16 flex border-t pt-6">
            {prev ? (
              <Link
                href={prevHref!}
                className="hover:bg-surface flex flex-1 flex-col gap-1 rounded-lg p-3 transition-colors"
              >
                <span className="text-muted-foreground text-xs">Previous</span>
                <span className="font-medium">{prev.sub.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={nextHref!}
                className="hover:bg-surface flex flex-1 flex-col items-end gap-1 rounded-lg p-3 text-right transition-colors"
              >
                <span className="text-muted-foreground text-xs">Next</span>
                <span className="font-medium">{next.sub.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
