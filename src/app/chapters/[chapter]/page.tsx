import { redirect } from "next/navigation";
import { chapters } from "@/data/chapters";

export function generateStaticParams() {
  return chapters.map((ch) => ({ chapter: ch.slug }));
}

export default async function ChapterIndexPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const ch = chapters.find((c) => c.slug === chapterSlug);
  if (!ch) return null;

  // Redirect to first subchapter
  if (ch.subchapters.length > 0) {
    redirect(`/chapters/${chapterSlug}/${ch.subchapters[0].slug}`);
  }

  return null;
}
