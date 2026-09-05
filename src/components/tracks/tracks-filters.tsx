"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS, SOIL_LABELS } from "@/lib/format";
import type { SoilCondition, TrackDifficulty } from "@/types";

export interface TrackFiltersState {
  difficulties: TrackDifficulty[];
  maxPrice: string;
  soilCondition: SoilCondition | "";
}

export const EMPTY_FILTERS: TrackFiltersState = {
  difficulties: [],
  maxPrice: "",
  soilCondition: "",
};

interface TracksFiltersProps {
  value: TrackFiltersState;
  onChange: (value: TrackFiltersState) => void;
  className?: string;
}

const DIFFICULTY_VALUES = Object.keys(DIFFICULTY_LABELS) as TrackDifficulty[];
const SOIL_VALUES = Object.keys(SOIL_LABELS) as SoilCondition[];

export function TracksFilters({ value, onChange, className }: TracksFiltersProps) {
  const hasActiveFilters =
    value.difficulties.length > 0 || value.maxPrice !== "" || value.soilCondition !== "";

  function toggleDifficulty(d: TrackDifficulty) {
    onChange({
      ...value,
      difficulties: value.difficulties.includes(d)
        ? value.difficulties.filter((x) => x !== d)
        : [...value.difficulties, d],
    });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="glass glass-edge flex flex-wrap items-center gap-2 rounded-xl p-2">
        <SlidersHorizontal className="ml-1 size-4 shrink-0 text-muted-foreground" />
        {DIFFICULTY_VALUES.map((d) => (
          <Button
            key={d}
            type="button"
            size="sm"
            variant={value.difficulties.includes(d) ? "default" : "outline"}
            onClick={() => toggleDifficulty(d)}
          >
            {DIFFICULTY_LABELS[d]}
          </Button>
        ))}

        <div className="flex items-center gap-1.5">
          <Label htmlFor="soil-filter" className="sr-only">
            Condiție teren
          </Label>
          <Select
            value={value.soilCondition || "all"}
            onValueChange={(v) =>
              onChange({
                ...value,
                soilCondition: v === "all" ? "" : (v as SoilCondition),
              })
            }
          >
            <SelectTrigger id="soil-filter" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Orice teren</SelectItem>
              {SOIL_VALUES.map((s) => (
                <SelectItem key={s} value={s}>
                  {SOIL_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <Label htmlFor="max-price" className="sr-only">
            Preț maxim
          </Label>
          <Input
            id="max-price"
            type="number"
            min={0}
            placeholder="Preț max. (lei)"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            className="h-8 w-36"
          />
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={() => onChange(EMPTY_FILTERS)}
          >
            <X className="size-3.5" />
            Resetează
          </Button>
        )}
      </div>
    </div>
  );
}
