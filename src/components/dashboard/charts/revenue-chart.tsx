"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { WeekBucket } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  data: WeekBucket[];
  className?: string;
}

const WIDTH = 640;
const HEIGHT = 220;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 16;
const PAD_B = 28;
const LINE_COLOR = "var(--color-ktm)";

export function RevenueChart({ data, className }: RevenueChartProps) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tableView, setTableView] = useState(false);

  const max = Math.max(1, ...data.map((d) => d.revenue));
  const plotW = WIDTH - PAD_L - PAD_R;
  const plotH = HEIGHT - PAD_T - PAD_B;

  const points = useMemo(
    () =>
      data.map((d, i) => {
        const x = PAD_L + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
        const y = PAD_T + plotH - (d.revenue / max) * plotH;
        return { x, y, ...d };
      }),
    [data, max, plotW, plotH]
  );

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x.toFixed(1)} ${PAD_T + plotH} L ${points[0]?.x.toFixed(1)} ${PAD_T + plotH} Z`;

  const gridLines = [0, 0.5, 1];

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const xInSvg = (e.clientX - rect.left) * scaleX;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - xInSvg);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const active = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Venit ultimele {data.length} săptămâni</p>
          <p className="font-heading text-2xl font-bold text-gradient-ktm">
            {formatPrice(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTableView((v) => !v)}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {tableView ? "Vezi grafic" : "Vezi ca tabel"}
        </button>
      </div>

      {tableView ? (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Săptămână</th>
                <th className="px-3 py-2 font-medium">Venit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.weekStart} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2">{d.label}</td>
                  <td className="px-3 py-2 tabular-nums">{formatPrice(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full touch-none"
            onPointerMove={handleMove}
            onPointerLeave={() => setHoverIndex(null)}
            role="img"
            aria-label={`Grafic venit pe ultimele ${data.length} săptămâni, total ${formatPrice(total)}`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.28} />
                <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>

            {gridLines.map((g) => {
              const y = PAD_T + plotH * (1 - g);
              return (
                <line
                  key={g}
                  x1={PAD_L}
                  x2={WIDTH - PAD_R}
                  y1={y}
                  y2={y}
                  stroke="oklch(1 0 0 / 8%)"
                  strokeWidth={1}
                />
              );
            })}

            <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
            <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {hoverIndex !== null && points[hoverIndex] && (
              <line
                x1={points[hoverIndex].x}
                x2={points[hoverIndex].x}
                y1={PAD_T}
                y2={PAD_T + plotH}
                stroke="oklch(1 0 0 / 20%)"
                strokeWidth={1}
              />
            )}

            {points.map((p, i) => (
              <g key={p.weekStart}>
                <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
                {(i === points.length - 1 || hoverIndex === i) && (
                  <>
                    <circle cx={p.x} cy={p.y} r={5} fill="var(--background)" />
                    <circle cx={p.x} cy={p.y} r={4} fill={LINE_COLOR} />
                  </>
                )}
              </g>
            ))}

            {points.map(
              (p, i) =>
                (i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 4) === 0) && (
                  <text
                    key={p.weekStart}
                    x={p.x}
                    y={HEIGHT - 8}
                    textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                    className="fill-muted-foreground text-[10px]"
                  >
                    {p.label}
                  </text>
                )
            )}
          </svg>

          {active && (
            <div
              className={cn(
                "pointer-events-none absolute top-0 rounded-lg border border-white/10 bg-popover px-3 py-2 text-xs shadow-lg transition-transform",
              )}
              style={{
                left: `${(active.x / WIDTH) * 100}%`,
                transform: `translate(${active.x > WIDTH * 0.7 ? "-100%" : "-8px"}, 4px)`,
              }}
            >
              <p className="font-semibold text-foreground">{formatPrice(active.revenue)}</p>
              <p className="text-muted-foreground">{active.label} · {active.bookings} rezervări</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
