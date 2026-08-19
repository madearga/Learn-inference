"use client";

import { useState } from "react";

interface BitFormat {
  name: string;
  bits: number;
  sign: number;
  exponent: number;
  mantissa: number;
  values: number;
  year: string;
  description: string;
}

const formats: BitFormat[] = [
  {
    name: "FP8 (E4M3)",
    bits: 8,
    sign: 1,
    exponent: 4,
    mantissa: 3,
    values: 256,
    year: "Hopper, 2022",
    description:
      "Halves memory traffic and doubles tensor core throughput. The workhorse of production quantization, and usually safe for weights and activations.",
  },
  {
    name: "FP8 (E5M2)",
    bits: 8,
    sign: 1,
    exponent: 5,
    mantissa: 2,
    values: 256,
    year: "Hopper, 2022",
    description:
      "Wider dynamic range at the cost of precision. Used for gradients during training, less common for inference.",
  },
  {
    name: "FP16 (E5M10)",
    bits: 16,
    sign: 1,
    exponent: 5,
    mantissa: 10,
    values: 65536,
    year: "Standard",
    description:
      "The default training format. Full precision for inference, but double the memory of FP8.",
  },
  {
    name: "BF16 (E8M7)",
    bits: 16,
    sign: 1,
    exponent: 8,
    mantissa: 7,
    values: 65536,
    year: "Ampere, 2020",
    description:
      "Same range as FP32 with fewer mantissa bits. The most common training format for large models.",
  },
  {
    name: "FP4 (E2M1)",
    bits: 4,
    sign: 1,
    exponent: 2,
    mantissa: 1,
    values: 16,
    year: "Blackwell, 2024",
    description:
      "Sixteen values is hopeless across a whole tensor, but perfectly reasonable across a block of 32. NVFP4 uses per-block scale factors.",
  },
  {
    name: "INT8",
    bits: 8,
    sign: 1,
    exponent: 0,
    mantissa: 7,
    values: 256,
    year: "Universal",
    description:
      "Integer quantization. Cheaper but flattens outliers, which carry real signal in neural networks.",
  },
];

const granularities = [
  {
    name: "Per tensor",
    description:
      "One scale factor for the whole tensor. Cheapest to store and apply, and the most likely to smooth a genuine outlier into nothing.",
    scaleFactors: "1",
  },
  {
    name: "Per channel",
    description:
      "One scale factor per channel. Better at preserving outliers, at the cost of more storage.",
    scaleFactors: "~1024",
  },
  {
    name: "Per block (32)",
    description:
      "What MXFP8, MXFP4, and NVFP4 do. Keeps outliers local enough to survive, at the cost of many more scale factors.",
    scaleFactors: "~32768",
  },
];

export function QuantizationSimulator() {
  const [formatIdx, setFormatIdx] = useState(0);
  const [granularityIdx, setGranularityIdx] = useState(0);
  const fmt = formats[formatIdx];
  const gran = granularities[granularityIdx];

  // Build visual bit representation
  const bitSegments: { label: string; count: number; color: string }[] = [];
  if (fmt.sign > 0)
    bitSegments.push({ label: "sign", count: fmt.sign, color: "bg-amber-500" });
  if (fmt.exponent > 0)
    bitSegments.push({ label: "exponent", count: fmt.exponent, color: "bg-blue-500" });
  if (fmt.mantissa > 0)
    bitSegments.push({ label: "mantissa", count: fmt.mantissa, color: "bg-emerald-500" });

  return (
    <div className="border-hairline bg-surface my-8 rounded-xl border p-6">
      <div className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
        Interactive: Number format explorer
      </div>

      {/* Format selector */}
      <div className="mb-6">
        <label className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wide">
          Number format
        </label>
        <div className="flex flex-wrap gap-2">
          {formats.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setFormatIdx(i)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                i === formatIdx
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-hairline text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bit layout visualization */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Bit layout</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            {fmt.bits} bits · {fmt.values.toLocaleString()} values
          </span>
        </div>
        <div className="flex gap-1">
          {bitSegments.map((seg, si) => (
            <div key={si} className="flex flex-col gap-1">
              {Array.from({ length: seg.count }).map((_, bi) => (
                <div
                  key={bi}
                  className={`h-8 w-8 rounded ${seg.color} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {seg.label[0].toUpperCase()}
                </div>
              ))}
              <span className="text-muted-foreground text-center text-xs">
                {seg.count}
              </span>
            </div>
          ))}
        </div>
        <div className="text-muted-foreground mt-2 text-xs">{fmt.year}</div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
        {fmt.description}
      </p>

      {/* Granularity selector */}
      <div className="mb-4">
        <label className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wide">
          Granularity
        </label>
        <div className="flex flex-wrap gap-2">
          {granularities.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setGranularityIdx(i)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                i === granularityIdx
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-hairline text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        {gran.description}
      </p>
      <div className="text-muted-foreground mt-2 text-xs">
        Scale factors across a 32-value vector: <span className="font-mono">{gran.scaleFactors}</span>
      </div>
    </div>
  );
}
