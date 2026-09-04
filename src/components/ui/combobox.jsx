import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
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

  const selectedOption =
    options.find((opt) => opt.value === value) ||
    (value === "all" ? { value: "all", label: "All" } : null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <div ref={containerRef} className={cn("relative min-w-0", className)}>
      <div
        className={cn(
          "flex h-11 w-full min-w-0 items-center overflow-hidden rounded-xl border border-border bg-white px-3.5 transition-colors",
          open && "border-primary ring-2 ring-light-blue",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={handleInputClick}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Search className="h-4 w-4 shrink-0 text-muted" />

          <div className="min-w-0 flex-1 overflow-hidden">
            {open ? (
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={selectedOption?.label || placeholder}
                className="block w-full min-w-0 overflow-hidden border-0 bg-transparent p-0 text-sm! font-medium text-body-light outline-none placeholder:text-muted"
                disabled={disabled}
                autoFocus
              />
            ) : (
              <div
                className="block min-w-0 w-full truncate text-sm font-medium text-body-light"
                title={selectedOption?.label || placeholder}
              >
                {selectedOption?.label || placeholder}
              </div>
            )}
          </div>
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-cream hover:text-body-light"
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
                    "relative flex w-full min-w-0 cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-left text-sm font-medium text-body-light outline-none transition-colors hover:bg-orange-100 hover:text-primary focus:bg-orange-100 focus:text-primary",
                    value === option.value && "bg-orange-100 text-black",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>

                  {value === option.value && (
                    <Check className="absolute right-2 h-4 w-4 shrink-0 text-primary" />
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
