"use client";

import { useState } from "react";
import Link from "next/link";
import { chapters } from "@/data/chapters";

export function MobileTOC({
  chapterSlug,
  currentSubSlug,
}: {
  chapterSlug: string;
  currentSubSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const ch = chapters.find((c) => c.slug === chapterSlug);
  if (!ch) return null;

  const current = ch.subchapters.find((s) => s.slug === currentSubSlug);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="border-hairline bg-surface flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
      >
        <span>
          <span className="text-muted-foreground tabular-nums">{current?.number}</span>{" "}
          {current?.title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`text-muted-foreground size-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M12 15.0006L7.75732 10.7579L9.17154 9.34363L12 12.1721L14.8284 9.34363L16.2426 10.7579L12 15.0006Z" />
        </svg>
      </button>
      {open && (
        <nav className="border-hairline bg-surface mt-2 rounded-lg border p-3">
          <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Chapter {ch.number} · {ch.title}
          </div>
          <ul className="flex flex-col gap-1">
            {ch.subchapters.map((sub) => {
              const isActive = sub.slug === currentSubSlug;
              return (
                <li key={sub.slug}>
                  <Link
                    href={`/chapters/${ch.slug}/${sub.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-background text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
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
      )}
    </div>
  );
}
