"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface GlossaryTerm {
  letter: string;
  term: string;
  definition: string;
}

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setQuery("");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return terms;
    const q = query.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [query, terms]);

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      if (!map[t.letter]) map[t.letter] = [];
      map[t.letter].push(t);
    }
    return map;
  }, [filtered]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search the glossary"
          className="border-hairline bg-surface focus:border-signal/50 w-full rounded-lg border py-2.5 pl-10 pr-16 text-sm outline-none transition-colors"
        />
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
        >
          <path d="M18.031 16.617l4.283 4.282-1.414 1.415-4.283-4.283A8 8 0 1 1 20 12a7.96 7.96 0 0 1-1.969 5.617zM11 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
        </svg>
        <kbd
          className={`text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 rounded border border-current px-1.5 py-0.5 text-xs transition-opacity ${
            focused ? "opacity-0" : "opacity-100"
          }`}
        >
          ⌘K
        </kbd>
      </div>

      {/* Result count */}
      {query && (
        <p className="text-muted-foreground mt-3 text-sm">
          {filtered.length} {filtered.length === 1 ? "term" : "terms"} matching "{query}"
        </p>
      )}

      {/* Results */}
      <div className="mt-8 flex flex-col gap-10">
        {Object.keys(grouped)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <h2 className="font-serif mb-4 text-2xl font-medium">{letter}</h2>
              <dl className="flex flex-col gap-4">
                {grouped[letter].map((entry, i) => (
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
        {filtered.length === 0 && (
          <div className="text-muted-foreground py-12 text-center">
            No terms found for "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
