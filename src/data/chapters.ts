export interface SubChapter {
  slug: string;
  number: string;
  title: string;
}

export interface Chapter {
  slug: string;
  number: string;
  title: string;
  subchapters: SubChapter[];
}

export const chapters: Chapter[] = [
  {
    slug: "inference",
    number: "0",
    title: "Inference",
    subchapters: [
      { slug: "two-phases", number: "0.1", title: "Two phases, two disciplines" },
      { slug: "three-layers", number: "0.2", title: "The three layers" },
      { slug: "runtime-techniques", number: "0.3", title: "Six techniques that define the runtime" },
      { slug: "scale-changes-problem", number: "0.4", title: "Scale changes the problem" },
      { slug: "abstraction", number: "0.5", title: "Where to put the abstraction" },
      { slug: "map", number: "0.6", title: "A map of what follows" },
    ],
  },
  {
    slug: "prerequisites",
    number: "1",
    title: "Prerequisites",
    subchapters: [
      { slug: "scale-and-specialization", number: "1.1", title: "Scale and specialization" },
      { slug: "about-your-app", number: "1.2", title: "About your app" },
      { slug: "model-selection", number: "1.3", title: "Model selection" },
      { slug: "latency-throughput", number: "1.4", title: "Measuring latency and throughput" },
    ],
  },
  {
    slug: "models",
    number: "2",
    title: "Models",
    subchapters: [
      { slug: "neural-networks", number: "2.1", title: "Neural networks" },
      { slug: "llm-mechanics", number: "2.2", title: "LLM inference mechanics" },
      { slug: "image-mechanics", number: "2.3", title: "Image generation inference mechanics" },
      { slug: "bottlenecks", number: "2.4", title: "Calculating inference bottlenecks" },
      { slug: "optimizing-attention", number: "2.5", title: "Optimizing attention" },
    ],
  },
  {
    slug: "hardware",
    number: "3",
    title: "Hardware",
    subchapters: [
      { slug: "gpu-architecture", number: "3.1", title: "GPU architecture" },
      { slug: "generations", number: "3.2", title: "GPU architecture generations" },
      { slug: "instances", number: "3.3", title: "Instances" },
      { slug: "other-accelerators", number: "3.4", title: "Other datacenter accelerator options" },
      { slug: "local-inference", number: "3.5", title: "Local inference" },
    ],
  },
  {
    slug: "software",
    number: "4",
    title: "Software",
    subchapters: [
      { slug: "cuda", number: "4.1", title: "CUDA" },
      { slug: "frameworks", number: "4.2", title: "Deep learning frameworks and libraries" },
      { slug: "engines", number: "4.3", title: "Inference engines" },
      { slug: "dynamo", number: "4.4", title: "NVIDIA Dynamo" },
      { slug: "benchmarking", number: "4.5", title: "Performance benchmarking and load testing" },
    ],
  },
  {
    slug: "techniques",
    number: "5",
    title: "Techniques",
    subchapters: [
      { slug: "quantization", number: "5.1", title: "Quantization" },
      { slug: "speculative-decoding", number: "5.2", title: "Speculative decoding" },
      { slug: "caching", number: "5.3", title: "Caching" },
      { slug: "parallelism", number: "5.4", title: "Model parallelism" },
      { slug: "disaggregation", number: "5.5", title: "Disaggregation" },
    ],
  },
  {
    slug: "modalities",
    number: "6",
    title: "Modalities",
    subchapters: [
      { slug: "vlms", number: "6.1", title: "Vision language models" },
      { slug: "embeddings", number: "6.2", title: "Embedding models" },
      { slug: "asr", number: "6.3", title: "ASR models" },
      { slug: "tts", number: "6.4", title: "TTS models" },
      { slug: "image-models", number: "6.5", title: "Image generation models" },
      { slug: "video-models", number: "6.6", title: "Video generation models" },
    ],
  },
  {
    slug: "production",
    number: "7",
    title: "Production",
    subchapters: [
      { slug: "containerization", number: "7.1", title: "Containerization" },
      { slug: "autoscaling", number: "7.2", title: "Autoscaling" },
      { slug: "multi-cloud", number: "7.3", title: "Multi-cloud capacity management" },
      { slug: "testing-deployment", number: "7.4", title: "Testing and deployment" },
      { slug: "client-code", number: "7.5", title: "Client code" },
      { slug: "closing", number: "7.6", title: "Where this leaves you" },
    ],
  },
];

export const furtherReadingSections = [
  { slug: "architecture", number: "B.1", title: "Architecture" },
  { slug: "developer-tools", number: "B.2", title: "Developer tools" },
  { slug: "frontier-models", number: "B.3", title: "Frontier open models" },
  { slug: "gpu-infrastructure", number: "B.4", title: "GPU infrastructure" },
  { slug: "optimization-research", number: "B.5", title: "Inference optimization research" },
  { slug: "evaluation", number: "B.6", title: "Intelligence evaluation" },
];

// Flatten all subchapters for navigation
export function getAllSubChapters() {
  const all: { chapterSlug: string; chapterNumber: string; chapterTitle: string; sub: SubChapter }[] = [];
  for (const ch of chapters) {
    for (const sub of ch.subchapters) {
      all.push({ chapterSlug: ch.slug, chapterNumber: ch.number, chapterTitle: ch.title, sub });
    }
  }
  return all;
}

export function findSubChapter(chapterSlug: string, subSlug: string) {
  const ch = chapters.find(c => c.slug === chapterSlug);
  if (!ch) return null;
  const sub = ch.subchapters.find(s => s.slug === subSlug);
  if (!sub) return null;
  return { chapter: ch, sub };
}

export function getAdjacentSubChapters(chapterSlug: string, subSlug: string) {
  const all = getAllSubChapters();
  const idx = all.findIndex(a => a.chapterSlug === chapterSlug && a.sub.slug === subSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
