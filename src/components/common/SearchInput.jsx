import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchInput({
  value = "",
  onChange,
  onClear,
  suggestions = ["vegetables", "fruits", "pulses", "grains"],
  placeholder = "Search for",
  className = "",
}) {
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionVisible, setSuggestionVisible] = useState(true);

  useEffect(() => {
    if (value || suggestions.length <= 1) {
      setSuggestionVisible(false);
      return;
    }

    setSuggestionVisible(true);

    const interval = setInterval(() => {
      setSuggestionVisible(false);

      setTimeout(() => {
        setSuggestionIndex((current) => (current + 1) % suggestions.length);

        setSuggestionVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [value, suggestions]);

  return (
    <div className={`relative min-w-0 ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted" />

      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder=""
        className="
          h-11
          w-full
          rounded-xl
          border-border
          bg-white
          pl-11
          pr-11
          shadow-none!
          transition-all
          placeholder:text-transparent
          focus:border-primary
          focus:ring-primary/20
        "
      />

      {!value && suggestions.length > 0 && (
        <div className="pointer-events-none absolute inset-y-0 left-11 right-11 flex items-center overflow-hidden">
          <div
            className={`text-sm text-muted transition-all duration-300 ${
              suggestionVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-3 opacity-0"
            }`}
          >
            {placeholder}{" "}
            <span className="font-medium text-body-dark/90">
              {suggestions[suggestionIndex]}
            </span>
          </div>
        </div>
      )}

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="
            absolute
            right-3
            top-1/2
            grid
            h-7
            w-7
            -translate-y-1/2
            place-items-center
            rounded-full
            text-muted
            transition-all
            duration-150
            hover:bg-gray-50
            hover:text-body-light
            active:scale-90
          "
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
