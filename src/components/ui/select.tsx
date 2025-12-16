"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectFiveProps {
  value?: string | number | undefined;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function SelectFive({
  value,
  onChange,
  options,
  placeholder = "Select option",
  disabled = false,
  searchable = false,
}: SelectFiveProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!searchTerm) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm]);

  return (
    <Select.Root
      value={value !== undefined ? String(value) : undefined}
      onValueChange={onChange}
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) {
          setSearchTerm("");
        } else if (searchable && searchInputRef.current) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      }}
    >
      <Select.Trigger className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600/40 text-white focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20">
        <Select.Value placeholder={placeholder} />
        <ChevronDown className="w-4 h-4 text-blue-300" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-slate-800 text-white border border-slate-700 rounded-lg shadow-xl"
          position="popper"
          align="start"
          sideOffset={5}
        >
          {searchable && (
            <div
              className="p-2 border-b border-slate-700/50"
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 bg-slate-700/50 border border-slate-600/40 rounded text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500/60"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation();

                    if (
                      e.key === "ArrowDown" ||
                      e.key === "ArrowUp" ||
                      e.key === "Enter"
                    ) {
                      e.preventDefault();
                    }

                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      const items = document.querySelectorAll(
                        "[data-radix-select-item]"
                      );
                      if (items.length > 0) {
                        const currentIndex = Array.from(items).findIndex(
                          (item) => item === document.activeElement
                        );
                        let nextIndex;

                        if (e.key === "ArrowDown") {
                          nextIndex =
                            currentIndex < items.length - 1
                              ? currentIndex + 1
                              : 0;
                        } else {
                          nextIndex =
                            currentIndex > 0
                              ? currentIndex - 1
                              : items.length - 1;
                        }

                        (items[nextIndex] as HTMLElement)?.focus();
                      }
                    }

                    if (
                      e.key === "Enter" &&
                      document.activeElement?.getAttribute(
                        "data-radix-select-item"
                      )
                    ) {
                      (document.activeElement as HTMLElement).click();
                    }
                  }}
                />
              </div>
            </div>
          )}

          <Select.Viewport
            className="p-1"
            style={{
              width: "var(--radix-select-trigger-width)",
              maxHeight: "180px",
              overflowY: "auto",
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={String(opt.value)}
                  className="flex items-center p-2 rounded-md cursor-pointer hover:bg-slate-700/40 focus:bg-slate-700/40 outline-none"
                  onKeyDown={(e) => {
                    if (e.key.length === 1 && searchable) {
                      e.preventDefault();
                      searchInputRef.current?.focus();
                    }
                  }}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <Check className="w-4 h-4 text-blue-400" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))
            ) : (
              <div className="p-2 text-slate-400 text-center text-sm">
                No options found
              </div>
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
