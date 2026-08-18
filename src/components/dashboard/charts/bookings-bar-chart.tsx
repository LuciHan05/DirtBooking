"use client";

import { useState } from "react";
import type { WeekBucket } from "@/lib/analytics";

interface BookingsBarChartProps {
  data: WeekBucket[];
  className?: string;
}

const WIDTH = 640;
const HEIGHT = 200;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 20;
const PAD_B = 28;
const BAR_COLOR = "var(--color-yamaha)";

export function BookingsBarChart({ data, className }: BookingsBarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tableView, setTableView] = useState(false);

  const max = Math.max(1, ...data.map((d) => d.bookings));
  const plotW = WIDTH - PAD_L - PAD_R;
  const plotH = HEIGHT - PAD_T - PAD_B;
  const slot = plotW / data.length;
  const barWidth = Math.min(24, slot * 0.55);
  const total = data.reduce((s, d) => s + d.bookings, 0);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Rezervări ultimele {data.length} săptămâni</p>
          <p className="font-heading text-2xl font-bold text-yamaha">{total}</p>
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
                <th className="px-3 py-2 font-medium">Rezervări</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.weekStart} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2">{d.label}</td>
                  <td className="px-3 py-2 tabular-nums">{d.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full"
            role="img"
            aria-label={`Grafic rezervări pe ultimele ${data.length} săptămâni, total ${total}`}
          >
            {[0, 0.5, 1].map((g) => {
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
            <line
              x1={PAD_L}
              x2={WIDTH - PAD_R}
              y1={PAD_T + plotH}
              y2={PAD_T + plotH}
              stroke="oklch(1 0 0 / 16%)"
              strokeWidth={1}
            />

            {data.map((d, i) => {
              const cx = PAD_L + slot * i + slot / 2;
              const barH = (d.bookings / max) * plotH;
              const y = PAD_T + plotH - barH;
              const isHover = hoverIndex === i;
              return (
                <g
                  key={d.weekStart}
                  onPointerEnter={() => setHoverIndex(i)}
                  onPointerLeave={() => setHoverIndex(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={cx - slot / 2 + 1}
                    y={PAD_T}
                    width={slot - 2}
                    height={plotH}
                    fill="transparent"
                  />
                  <rect
                    x={cx - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={Math.max(barH, d.bookings > 0 ? 3 : 0)}
                    rx={4}
                    fill={BAR_COLOR}
                    opacity={isHover ? 1 : 0.85}
                  />
                  {d.bookings > 0 && (
                    <text
                      x={cx}
                      y={y - 6}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px] tabular-nums"
                    >
                      {d.bookings}
                    </text>
                  )}
                  <text
                    x={cx}
                    y={HEIGHT - 8}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 4) === 0
                      ? d.label
                      : ""}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoverIndex !== null && (
            <div
              className="pointer-events-none absolute top-0 rounded-lg border border-white/10 bg-popover px-3 py-2 text-xs shadow-lg"
              style={{
                left: `${((PAD_L + slot * hoverIndex + slot / 2) / WIDTH) * 100}%`,
                transform: `translate(${hoverIndex > data.length * 0.7 ? "-100%" : "-8px"}, 4px)`,
              }}
            >
              <p className="font-semibold text-foreground">
                {data[hoverIndex].bookings} rezervări
              </p>
              <p className="text-muted-foreground">{data[hoverIndex].label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
