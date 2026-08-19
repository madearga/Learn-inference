import Link from "next/link";
import type { Metadata } from "next";
import { chapters, getAdjacentSubChapters, findSubChapter } from "@/data/chapters";
import { ArrowRightIcon } from "@/components/Header";
import { MobileTOC } from "@/components/MobileTOC";
import { QuantizationSimulator } from "@/components/QuantizationSimulator";
import { KeyboardNav } from "@/components/KeyboardNav";
import { getContent, type Block } from "@/lib/content";
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
  const firstPara = content?.blocks.find((b) => b.type === "paragraph")?.text;

  return {
    title: `${title} · ${found.chapter.title} · Learn Inference`,
    description: firstPara?.slice(0, 160) || undefined,
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
    <div className="my-6 rounded-lg bg-amber-500/15 border border-amber-500/30 p-4">
      <div className="text-amber-400 mb-1 text-sm font-semibold uppercase tracking-wide">{title}</div>
      <p className="text-foreground/90 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "callout":
      return <Callout title={block.calloutTitle!} body={block.calloutBody!} />;
    case "figure":
      return (
        <p className="text-muted-foreground mt-2 text-sm italic">
          {block.figureText}
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2 pl-1">
          {block.items!.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground mt-2 inline-block size-1.5 shrink-0 rounded-full bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
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

          {/* Body content - blocks preserve order of paragraphs, callouts, lists, figures */}
          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed">
            {content.blocks.map((block, i) => {
              if (block.type === "subSection") {
                return (
                  <div key={i} className="mt-6">
                    <h2 className="font-serif flex items-center gap-2 text-xl font-medium">
                      <span className="text-muted-foreground text-base tabular-nums">
                        {block.subNumber}
                      </span>
                      {block.subTitle}
                    </h2>
                    <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed">
                      {block.subBlocks!.map((subBlock, si) => (
                        <BlockRenderer key={si} block={subBlock} />
                      ))}
                    </div>

                    {/* Insert simulator after first sub-section of quantization page */}
                    {chapterSlug === "techniques" && subSlug === "quantization" &&
                     block.subNumber === "5.1.1" && (
                      <div className="mt-6">
                        <QuantizationSimulator />
                      </div>
                    )}
                  </div>
                );
              }
              return <BlockRenderer key={i} block={block} />;
            })}
          </div>

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
