import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function Combobox({
  value = "",
  onValueChange = () => {},
  options = [],
  placeholder = "Select...",
  isLoading = false,
  disabled = false,
  className = "",
  emptyMessage = "No options found",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Get the selected option label
  const selectedOption =
    options.find((opt) => opt.value === value) ||
    (value === "all" ? { value: "all", label: "All" } : null);

  // Filter options based on search
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredOptions(filtered);
    }
  }, [search, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onValueChange("");
    setSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setOpen(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Input container */}
      <div
        className={cn(
          "flex h-11 w-full items-center rounded-xl border border-border bg-white px-3.5 transition-colors",
          open && "border-primary ring-2 ring-light-blue",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={handleInputClick}
      >
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <div className="flex-1 min-w-0">
            {open ? (
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={selectedOption?.label || placeholder}
                className="w-full border-0 bg-transparent p-0 text-sm font-medium text-body-light outline-none placeholder:text-muted"
                disabled={disabled}
                autoFocus
              />
            ) : (
              <div className="truncate text-sm font-medium text-body-light">
                {selectedOption?.label || placeholder}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-cream hover:text-body-light"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white shadow-xl animate-in fade-in-0 zoom-in-95">
          <div className="max-h-64 overflow-y-auto p-1">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-body-light outline-none transition-colors hover:bg-light-blue hover:text-primary focus:bg-light-blue focus:text-primary",
                    value === option.value && "bg-light-blue text-primary",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="absolute right-2 h-4 w-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
