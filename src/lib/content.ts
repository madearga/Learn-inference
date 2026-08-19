import fs from "fs";
import path from "path";

export interface ChapterContent {
  title: string;
  chapterLabel: string;
  chapterTitle: string;
  pageNumber: string;
  totalPages: string;
  sectionNumber: string;
  sectionTitle: string;
  paragraphs: string[];
  callouts: { title: string; body: string }[];
  subSections: { number: string; title: string; paragraphs: string[] }[];
  figures: { number: string; caption: string }[];
  hasNext: boolean;
  hasPrev: boolean;
  nextTitle?: string;
  prevTitle?: string;
  nextHref?: string;
  prevHref?: string;
}

const contentDir = path.join(process.cwd(), "src", "content");

export function getContent(chapterSlug: string, subSlug: string): ChapterContent | null {
  const filename = `${chapterSlug}_${subSlug}.txt`;
  const filepath = path.join(contentDir, filename);

  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  return parseContent(raw);
}

export function getGlossaryContent(): { terms: { letter: string; term: string; definition: string }[]; intro: string } | null {
  const filepath = path.join(contentDir, "glossary.txt");
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const terms: { letter: string; term: string; definition: string }[] = [];
  let intro = "";
  let currentLetter = "";

  for (const line of lines) {
    // Skip header lines
    if (line.startsWith("Learn Inference") || line.startsWith("Appendix") || line.includes("pp. ")) continue;
    if (line.startsWith("Every term") || line.startsWith("Search") || line === "⌘K" || line.startsWith("Find a term")) continue;
    if (line === "206 terms" || line === "Glossary") continue;

    // Single letter header
    if (/^[A-Z]$/.test(line.trim())) {
      currentLetter = line.trim();
      continue;
    }

    // Term — definition
    const match = line.match(/^(.+?)\s+—\s+(.+)$/);
    if (match) {
      terms.push({ letter: currentLetter, term: match[1].trim(), definition: match[2].trim() });
    } else if (!intro && line.length > 20 && !line.includes("—")) {
      intro = line;
    }
  }

  return { terms, intro };
}

export function getReadingContent(): { sections: { title: string; items: string[] }[]; intro: string } | null {
  const filepath = path.join(contentDir, "reading.txt");
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const sections: { title: string; items: string[] }[] = [];
  let currentSection: { title: string; items: string[] } | null = null;
  let intro = "";

  for (const line of lines) {
    if (line.startsWith("Learn Inference") || line.startsWith("Appendix") || line.includes("pp. ")) continue;
    if (line === "Further reading" || line === "Search" || line === "⌘K") continue;
    if (line.startsWith("Find a") || line.includes("resources")) continue;

    // Section headers like "B.1 Architecture"
    const sectionMatch = line.match(/^B\.\d+\s+(.+)$/);
    if (sectionMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: line, items: [] };
      continue;
    }

    if (currentSection) {
      currentSection.items.push(line);
    } else if (line.length > 20) {
      intro = intro ? intro + " " + line : line;
    }
  }
  if (currentSection) sections.push(currentSection);

  return { sections, intro };
}

function parseContent(raw: string): ChapterContent {
  const lines = raw.split("\n").filter((l) => l.trim());
  const content: ChapterContent = {
    title: "",
    chapterLabel: "",
    chapterTitle: "",
    pageNumber: "",
    totalPages: "",
    sectionNumber: "",
    sectionTitle: "",
    paragraphs: [],
    callouts: [],
    subSections: [],
    figures: [],
    hasNext: false,
    hasPrev: false,
  };

  let i = 0;
  // Line 1: "Learn Inference"
  // Line 2: "Chapter X · Title"
  if (lines.length > 1 && lines[1].includes("·")) {
    const parts = lines[1].split("·");
    content.chapterLabel = parts[0].trim();
    content.chapterTitle = parts[1]?.trim() || "";
  }
  // Line 3: Title
  if (lines.length > 2) content.title = lines[2].trim();

  // Find "Contents", chapter label again, page number, section number, section title
  let bodyStart = 3;
  for (let j = 3; j < Math.min(lines.length, 12); j++) {
    if (lines[j] === "Contents") { bodyStart = j + 1; continue; }
    if (/^Chapter \d/.test(lines[j]) && lines[j].includes("·")) {
      const parts = lines[j].split("·");
      content.chapterLabel = parts[0].trim();
      content.chapterTitle = parts[1]?.trim() || "";
      bodyStart = j + 1;
      continue;
    }
    if (/^\d+ of \d+$/.test(lines[j])) {
      const m = lines[j].match(/^(\d+) of (\d+)$/);
      if (m) { content.pageNumber = m[1]; content.totalPages = m[2]; }
      bodyStart = j + 1;
      continue;
    }
    if (/^\d+\.\d+$/.test(lines[j])) {
      content.sectionNumber = lines[j];
      bodyStart = j + 1;
      continue;
    }
    if (bodyStart <= j && !content.sectionTitle && lines[j].length > 2 && lines[j] !== "#") {
      content.sectionTitle = lines[j].trim();
      bodyStart = j + 1;
      break;
    }
  }

  // Parse body: paragraphs, callouts, sub-sections, figures, prev/next
  let currentSubSection: { number: string; title: string; paragraphs: string[] } | null = null;
  let currentCallout: { title: string; body: string } | null = null;

  for (let j = bodyStart; j < lines.length; j++) {
    const line = lines[j].trim();

    // Previous/Next
    if (line === "Previous") { content.hasPrev = true; continue; }
    if (line === "Next") { content.hasNext = true; continue; }
    if (content.hasPrev && !content.prevTitle) { content.prevTitle = line; continue; }
    if (content.hasNext && !content.nextTitle) { content.nextTitle = line; continue; }

    // Sub-section: "5.1.1 Number formats"
    const subMatch = line.match(/^(\d+\.\d+\.\d+)\s+(.+)$/);
    if (subMatch) {
      if (currentSubSection) content.subSections.push(currentSubSection);
      if (currentCallout) { content.callouts.push(currentCallout); currentCallout = null; }
      currentSubSection = { number: subMatch[1], title: subMatch[2].replace(/#$/, "").trim(), paragraphs: [] };
      continue;
    }

    // Figure captions: "Figure X.X. ..."
    if (line.startsWith("Figure ")) {
      if (currentSubSection) currentSubSection.paragraphs.push(line);
      else content.paragraphs.push(line);
      continue;
    }

    // Skip "#" markers
    if (line === "#") continue;

    // Callout headers (short lines before a longer explanation)
    // This is a heuristic - short standalone lines that aren't paragraph-length
    if (line.length < 40 && line.length > 2 && !line.endsWith(".") && j + 1 < lines.length && lines[j + 1].length > 60) {
      if (currentCallout) content.callouts.push(currentCallout);
      currentCallout = { title: line, body: lines[j + 1].trim() };
      j++; // skip next line since we consumed it
      continue;
    }

    // Regular paragraph
    if (line.length > 0) {
      if (currentCallout) { content.callouts.push(currentCallout); currentCallout = null; }
      if (currentSubSection) {
        currentSubSection.paragraphs.push(line);
      } else {
        content.paragraphs.push(line);
      }
    }
  }

  if (currentSubSection) content.subSections.push(currentSubSection);
  if (currentCallout) content.callouts.push(currentCallout);

  return content;
}
