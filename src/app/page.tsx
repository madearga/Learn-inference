import Link from "next/link";
import { chapters, furtherReadingSections } from "@/data/chapters";
import { PlayIcon, ArrowRightIcon, ListIcon, FileIcon, BookIcon, ExternalLinkIcon } from "@/components/Header";

function HeroGraphic() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-signal p-6">
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-5xl font-serif font-bold leading-[0.95] tracking-[-0.03em] text-black">
          LEARN
        </span>
        <span className="text-5xl font-serif font-bold leading-[0.95] tracking-[-0.03em] text-black">
          INFERENCE
        </span>
        <span className="mt-2 text-sm font-medium leading-snug text-black/70">
          SERVING GENERATIVE
          <br />
          MODELS IN PRODUCTION
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pt-12 pb-10 sm:pt-16">
      <h1 className="sr-only">
        Learn Inference — an interactive guide to serving generative models in production
      </h1>
      <div className="grid gap-10 md:grid-cols-[15rem_1fr] md:gap-12">
        {/* Left sidebar - hero + buttons */}
        <div className="md:sticky md:top-[5.5rem] md:self-start">
          <HeroGraphic />
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/chapters/inference/two-phases"
              className="flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors border-transparent bg-foreground text-background hover:bg-foreground/85"
            >
              <PlayIcon className="size-4" />
              Start reading
            </Link>
            <Link
              href="/chapters/glossary"
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline text-sm font-medium transition-colors hover:bg-surface"
            >
              <ListIcon className="size-4" />
              Glossary
            </Link>
            <Link
              href="/chapters/reading"
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline text-sm font-medium transition-colors hover:bg-surface"
            >
              <FileIcon className="size-4" />
              Further reading
            </Link>
            <a
              href="https://www.baseten.co/inference-engineering/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline text-sm font-medium transition-colors hover:bg-surface"
            >
              <BookIcon className="size-4" />
              The source book
              <ExternalLinkIcon className="text-muted-foreground size-3.5" />
            </a>
          </div>
        </div>

        {/* Right content */}
        <div className="min-w-0">
          {/* Description */}
          <section>
            <h2 className="font-serif text-xl font-medium">Description</h2>
            <div className="text-muted-foreground mt-3 flex flex-col gap-3 text-base leading-relaxed">
              <p>
                Training teaches a model what it knows. Inference is everything that happens afterward, every time somebody uses it, and it is where the bill actually lands. Serving a generative model well means working across a strange range of the stack: attention kernels at one end, GPU procurement across three clouds at the other.
              </p>
              <p>
                This is an interactive companion to <em className="font-serif">Inference Engineering</em> by Philip Kiely. It follows the book's structure, but replaces long prose with diagrams and simulations.
              </p>
            </div>
          </section>

          {/* Chapter list */}
          <section className="mt-10 flex flex-col gap-7">
            {chapters.map((ch) => (
              <div key={ch.slug} id={ch.slug}>
                <h2 className="mb-2.5 flex items-center gap-2 font-serif text-lg font-medium">
                  <Link
                    href={`/chapters/${ch.slug}`}
                    className="hover:text-signal decoration-signal/40 underline-offset-4 transition-colors hover:underline"
                  >
                    {ch.number}. {ch.title}
                  </Link>
                  <Link
                    href={`/chapters/${ch.slug}`}
                    aria-label={`Open ${ch.title}`}
                    className="border-hairline text-muted-foreground hover:border-signal/50 hover:text-signal inline-flex size-[1.125rem] items-center justify-center rounded-full border transition-colors"
                  >
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </h2>
                <ul className="border-hairline divide-y divide-hairline overflow-hidden rounded-lg border">
                  {ch.subchapters.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/chapters/${ch.slug}/${sub.slug}`}
                        className="hover:bg-surface flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
                      >
                        <span className="border-hairline text-muted-foreground flex size-[1.375rem] shrink-0 items-center justify-center rounded-md border">
                          <ArrowRightIcon className="size-3" />
                        </span>
                        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                          {sub.number}
                        </span>
                        <span className="min-w-0">{sub.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Glossary */}
            <div>
              <h2 className="mb-2.5 flex items-center gap-2 font-serif text-lg font-medium">
                <Link
                  href="/chapters/glossary"
                  className="hover:text-signal decoration-signal/40 underline-offset-4 transition-colors hover:underline"
                >
                  Glossary
                </Link>
                <Link
                  href="/chapters/glossary"
                  aria-label="Open Glossary"
                  className="border-hairline text-muted-foreground hover:border-signal/50 hover:text-signal inline-flex size-[1.125rem] items-center justify-center rounded-full border transition-colors"
                >
                  <ArrowRightIcon className="size-3" />
                </Link>
              </h2>
              <p className="text-muted-foreground text-sm">Every term, defined once</p>
            </div>

            {/* Further reading */}
            <div>
              <h2 className="mb-2.5 flex items-center gap-2 font-serif text-lg font-medium">
                <Link
                  href="/chapters/reading"
                  className="hover:text-signal decoration-signal/40 underline-offset-4 transition-colors hover:underline"
                >
                  Further reading
                </Link>
                <Link
                  href="/chapters/reading"
                  aria-label="Open Further reading"
                  className="border-hairline text-muted-foreground hover:border-signal/50 hover:text-signal inline-flex size-[1.125rem] items-center justify-center rounded-full border transition-colors"
                >
                  <ArrowRightIcon className="size-3" />
                </Link>
              </h2>
              <ul className="border-hairline divide-y divide-hairline overflow-hidden rounded-lg border">
                {furtherReadingSections.map((sec) => (
                  <li key={sec.slug}>
                    <Link
                      href={`/chapters/reading#${sec.slug}`}
                      className="hover:bg-surface flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
                    >
                      <span className="border-hairline text-muted-foreground flex size-[1.375rem] shrink-0 items-center justify-center rounded-md border">
                        <ArrowRightIcon className="size-3" />
                      </span>
                      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                        {sec.number}
                      </span>
                      <span className="min-w-0">{sec.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
