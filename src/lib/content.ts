import fs from "fs";
import path from "path";

export interface Block {
  type: "paragraph" | "callout" | "figure" | "subSection" | "list";
  text?: string;
  calloutTitle?: string;
  calloutBody?: string;
  figureText?: string;
  subNumber?: string;
  subTitle?: string;
  subBlocks?: Block[];
  items?: string[];
}

export interface ChapterContent {
  title: string;
  chapterLabel: string;
  chapterTitle: string;
  pageNumber: string;
  totalPages: string;
  sectionNumber: string;
  sectionTitle: string;
  blocks: Block[];
  hasNext: boolean;
  hasPrev: boolean;
  nextTitle?: string;
  prevTitle?: string;
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
    if (line.startsWith("Learn Inference") || line.startsWith("Appendix") || line.includes("pp. ")) continue;
    if (line.startsWith("Every term") || line.startsWith("Search") || line === "⌘K" || line.startsWith("Find a term")) continue;
    if (line === "206 terms" || line === "Glossary") continue;

    if (/^[A-Z]$/.test(line.trim())) {
      currentLetter = line.trim();
      continue;
    }

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

// Lines that are navigation/control, not content
const navWords = /^(Previous|Next|Software|Contents|Glossary|Description)$/i;

// Chapter title words that shouldn't be treated as callouts
const chapterWords = /^(Hardware|Models|Inference|Production|Techniques|Modalities|Prerequisites|Software)$/i;

function isCalloutHeader(line: string, nextLine: string): boolean {
  return (
    line.length < 50 &&
    line.length > 3 &&
    !line.endsWith(".") &&
    !navWords.test(line) &&
    !chapterWords.test(line) &&
    !line.match(/^\d+\.\d+/) &&
    nextLine.length > 60
  );
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
    blocks: [],
    hasNext: false,
    hasPrev: false,
  };

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
  let foundSectionNumber = false;
  for (let j = 3; j < Math.min(lines.length, 14); j++) {
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
      foundSectionNumber = true;
      bodyStart = j + 1;
      continue;
    }
    // Only set sectionTitle AFTER we've found the section number
    if (foundSectionNumber && !content.sectionTitle && lines[j].length > 2 && lines[j] !== "#") {
      content.sectionTitle = lines[j].trim();
      bodyStart = j + 1;
      break;
    }
  }

  // Parse body into blocks — preserves order of paragraphs, callouts, figures, sub-sections
  let currentSubBlocks: Block[] | null = null;
  let currentSubNumber = "";
  let currentSubTitle = "";
  let pendingList: string[] = [];

  function flushList(target: Block[]) {
    if (pendingList.length >= 2) {
      target.push({ type: "list", items: [...pendingList] });
    } else {
      for (const item of pendingList) {
        target.push({ type: "paragraph", text: item });
      }
    }
    pendingList = [];
  }

  function currentTarget(): Block[] {
    return currentSubBlocks ?? content.blocks;
  }

  for (let j = bodyStart; j < lines.length; j++) {
    const line = lines[j].trim();

    // Previous/Next navigation
    if (line === "Previous") { content.hasPrev = true; continue; }
    if (line === "Next") { content.hasNext = true; continue; }
    if (content.hasPrev && !content.prevTitle) {
      // prevTitle might span two lines: "Software" + "Performance..."
      content.prevTitle = line;
      if (j + 1 < lines.length && lines[j + 1].trim().length > 3 && lines[j + 1].trim() !== "Next") {
        content.prevTitle = lines[j + 1].trim();
        j++;
      }
      continue;
    }
    if (content.hasNext && !content.nextTitle) { content.nextTitle = line; continue; }

    // Skip trailing chapter context lines before Previous/Next
    // e.g., "Software" followed by "Performance benchmarking..."
    if (chapterWords.test(line) && j + 1 < lines.length) {
      const next = lines[j + 1].trim();
      if (next === "Previous" || next === "Next") continue;
    }

    // Sub-section: "5.1.1" optionally followed by title on next line
    const subNumMatch = line.match(/^(\d+\.\d+\.\d+)$/);
    if (subNumMatch) {
      flushList(currentTarget());
      if (currentSubBlocks !== null) {
        content.blocks.push({
          type: "subSection",
          subNumber: currentSubNumber,
          subTitle: currentSubTitle,
          subBlocks: currentSubBlocks,
        });
      }
      currentSubNumber = subNumMatch[1];
      // Title is on the next line (or same line if matched with space)
      if (j + 1 < lines.length && lines[j + 1].trim() !== "#") {
        currentSubTitle = lines[j + 1].trim().replace(/#$/, "").trim();
        j++;
      } else {
        currentSubTitle = "";
      }
      // Skip "#" marker after title
      if (j + 1 < lines.length && lines[j + 1].trim() === "#") j++;
      currentSubBlocks = [];
      continue;
    }

    // Sub-section with title on same line: "5.1.1 Number formats"
    const subMatch = line.match(/^(\d+\.\d+\.\d+)\s+(.+)$/);
    if (subMatch) {
      flushList(currentTarget());
      if (currentSubBlocks !== null) {
        content.blocks.push({
          type: "subSection",
          subNumber: currentSubNumber,
          subTitle: currentSubTitle,
          subBlocks: currentSubBlocks,
        });
      }
      currentSubNumber = subMatch[1];
      currentSubTitle = subMatch[2].replace(/#$/, "").trim();
      currentSubBlocks = [];
      continue;
    }

    // Figure captions
    if (line.startsWith("Figure ")) {
      flushList(currentTarget());
      currentTarget().push({ type: "figure", figureText: line });
      continue;
    }

    // Skip "#" markers
    if (line === "#") continue;

    // Skip repeated header/footer lines that leaked into body
    if (line === "Contents") continue;
    if (/^Chapter \d/.test(line) && line.includes("·")) continue;
    if (/^\d+ of \d+$/.test(line)) continue;
    if (/^\d+\.\d+$/.test(line) && line.length < 8) continue; // section number like "5.1"

    // Skip simulator UI labels that leaked into text content
    if (/^(Number format|Granularity|Bit layout|FP8 \(|FP16 \(|BF16 \(|FP4 \(|INT8|Per tensor|Per channel|Per block)$/.test(line)) continue;
    if (/^(sign \d|exponent \d|mantissa \d|\d+ bits|\d+ values)/.test(line)) continue;
    if (/^(Hopper, \d{4}|Ampere, \d{4})$/.test(line)) continue;
    if (/^Scale factors across/.test(line)) continue;
    if (/^1 scale factor/.test(line)) continue;

    // Callout: short header + long body
    if (j + 1 < lines.length && isCalloutHeader(line, lines[j + 1])) {
      // Don't treat titles or single-word headings as callouts
      if (line === content.sectionTitle || line === content.chapterTitle || line === content.title) {
        flushList(currentTarget());
        if (currentSubBlocks !== null) {
          currentSubBlocks.push({ type: "paragraph", text: line });
        } else {
          content.blocks.push({ type: "paragraph", text: line });
        }
        continue;
      }
      flushList(currentTarget());
      currentTarget().push({
        type: "callout",
        calloutTitle: line,
        calloutBody: lines[j + 1].trim(),
      });
      j++;
      continue;
    }

    // Regular paragraph
    if (line.length > 0) {
      // Detect potential list items: lines that are standalone sentences
      // starting with a capital and ending with a period, but not too long
      if (line.endsWith(".") && line.length < 200) {
        // Check if this looks like a list item (starts with a noun phrase)
        const nextLine = j + 1 < lines.length ? lines[j + 1].trim() : "";
        if (nextLine.endsWith(".") && nextLine.length < 200 && pendingList.length >= 0) {
          pendingList.push(line);
          continue;
        } else if (pendingList.length >= 1) {
          pendingList.push(line);
          flushList(currentTarget());
          continue;
        }
      }

      flushList(currentTarget());
      currentTarget().push({ type: "paragraph", text: line });
    }
  }

  flushList(currentTarget());
  if (currentSubBlocks !== null) {
    content.blocks.push({
      type: "subSection",
      subNumber: currentSubNumber,
      subTitle: currentSubTitle,
      subBlocks: currentSubBlocks,
    });
  }

  return content;
}
