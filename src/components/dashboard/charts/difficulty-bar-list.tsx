"use client";

import { useState } from "react";
import type { DifficultyCount } from "@/lib/analytics";
import { DIFFICULTY_LABELS } from "@/lib/format";

interface DifficultyBarListProps {
  data: DifficultyCount[];
  className?: string;
}

/**
 * Culori validate pentru discriminare categorică (CVD + normal-vision),
 * din paleta de referință dataviz — vezi skill-ul "dataviz" § color-formula.
 * Nu reutilizează accentele de brand (ktm/yamaha/kawasaki), care nu trec
 * verificarea de separare pe 4 sloturi adiacente.
 */
const SLOT_COLOR: Record<DifficultyCount["difficulty"], string> = {
  beginner: "#3987e5",
  intermediate: "#d95926",
  advanced: "#199e70",
  pro: "#c98500",
};

export function DifficultyBarList({ data, className }: DifficultyBarListProps) {
  const [tableView, setTableView] = useState(false);
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Distribuție dificultate ({total} trasee)
        </p>
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
                <th className="px-3 py-2 font-medium">Dificultate</th>
                <th className="px-3 py-2 font-medium">Trasee</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.difficulty} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2">{DIFFICULTY_LABELS[d.difficulty]}</td>
                  <td className="px-3 py-2 tabular-nums">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.difficulty} className="flex items-center gap-3">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: SLOT_COLOR[d.difficulty] }}
                aria-hidden
              />
              <span className="w-24 shrink-0 text-sm text-foreground">
                {DIFFICULTY_LABELS[d.difficulty]}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    backgroundColor: SLOT_COLOR[d.difficulty],
                  }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
