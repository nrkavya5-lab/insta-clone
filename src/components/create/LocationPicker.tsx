"use client";

import { useState } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

const popularLocations = [
  "New York, New York",
  "Los Angeles, California",
  "San Francisco, California",
  "London, United Kingdom",
  "Paris, France",
  "Tokyo, Japan",
  "Sydney, Australia",
  "Dubai, UAE",
];

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = search
    ? popularLocations.filter((l) =>
        l.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-[var(--ig-text-secondary)] hover:text-[var(--ig-text-primary)] transition-colors"
      >
        <MapPin className="w-4 h-4" />
        {value || "Add location"}
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 w-72 rounded border border-[var(--ig-border)] bg-[var(--ig-bg-primary)] shadow-lg z-10">
          <div className="relative m-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ig-text-secondary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location..."
              className="w-full rounded bg-[var(--ig-bg-tertiary)] pl-9 pr-3 py-2 text-sm outline-none"
            />
          </div>

          {value && (
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[var(--ig-error)] hover:bg-[var(--ig-bg-tertiary)]"
            >
              Remove location
            </button>
          )}

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : search ? (
            filtered.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  onChange(loc);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--ig-bg-tertiary)] transition-colors"
              >
                <MapPin className="w-3 h-3 inline mr-2 text-[var(--ig-text-secondary)]" />
                {loc}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-[var(--ig-text-secondary)]">
              Type to search locations
            </p>
          )}
        </div>
      )}
    </div>
  );
}
