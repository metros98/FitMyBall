"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCompare } from "./compare-context";
import { useBallSearch } from "@/lib/query/hooks/use-ball-search";
import { cn } from "@/lib/utils";
import type { Ball } from "@/types/ball";

const DEBOUNCE_MS = 300;

export function BallSearchCombobox() {
  const { addBall, isSelected, isFull } = useCompare();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useBallSearch(debouncedQuery, 8);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    setIsOpen(value.length >= 2);
  }, []);

  const handleAddBall = useCallback(
    (ball: Ball) => {
      addBall({ id: ball.id, name: ball.name });
      setQuery("");
      setIsOpen(false);
    },
    [addBall]
  );

  const handleInputFocus = useCallback(() => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  }, [query]);

  const handleInputBlur = useCallback(() => {
    // Delay closing to allow click events to fire
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  const results = data?.results ?? [];
  const showResults = isOpen && debouncedQuery.length >= 2;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search golf balls by name or manufacturer..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-9"
          disabled={isFull}
        />
      </div>

      {/* Dropdown Results */}
      {showResults && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-[300px] overflow-y-auto p-1">
            {isLoading && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {!isLoading && results.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No balls found for &quot;{debouncedQuery}&quot;
              </div>
            )}

            {!isLoading &&
              results.map((ball) => {
                const alreadySelected = isSelected(ball.id);
                const disabled = alreadySelected || isFull;

                return (
                  <div
                    key={ball.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-sm px-3 py-2.5",
                      "hover:bg-accent",
                      disabled && "opacity-50"
                    )}
                  >
                    {/* Ball Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="truncate font-medium text-sm">
                          {ball.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {ball.manufacturer}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Compression: {ball.compression}</span>
                        <span>${ball.pricePerDozen}/doz</span>
                      </div>
                    </div>

                    {/* Add Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1.5 shrink-0"
                      onClick={() => handleAddBall(ball)}
                      disabled={disabled}
                    >
                      {alreadySelected ? (
                        "Added"
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
