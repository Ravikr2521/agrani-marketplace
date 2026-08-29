import { useMemo, useState } from "react";
import { Filter, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationFilter } from "./LocationFilter";

function FilterFields({ value, onChange, categories, packUnits, onClear }) {
  const activeCount = [
    value.category !== "all",
    value.availability !== "all",
    value.packUnit !== "all",
    value.price !== "all",
    value.state !== undefined && value.state !== "all",
    value.district !== undefined && value.district !== "all",
    value.block !== undefined && value.block !== "all",
  ].filter(Boolean).length;
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-2 block text-xs font-bold  tracking-[0.12em] text-muted">
          Category
        </label>
        <Select
          value={value.category || "all"}
          onValueChange={(v) => onChange({ ...value, category: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div>
        <label className="mb-2 block text-xs font-bold  tracking-[0.12em] text-muted">
          Pack unit
        </label>
        <Select
          value={value.packUnit || "all"}
          onValueChange={(v) => onChange({ ...value, packUnit: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pack units</SelectItem>
            {packUnits.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <div>
        <label className="mb-2 block text-xs font-bold  tracking-[0.12em] text-muted">
          Price
        </label>
        <Select
          value={value.price || "all"}
          onValueChange={(v) => onChange({ ...value, price: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any price</SelectItem>
            <SelectItem value="0-250">Under ₹250</SelectItem>
            <SelectItem value="250-500">₹250 – ₹500</SelectItem>
            <SelectItem value="500-1000">₹500 – ₹1,000</SelectItem>
            <SelectItem value="1000+">Above ₹1,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className=" border-border pt-2">
        <h3 className="mb-3 text-sm font-bold text-gray-800">Location</h3>
        <LocationFilter
          value={{
            state: value.state || "all",
            district: value.district || "all",
            block: value.block || "all",
          }}
          onChange={(locationValue) => onChange({ ...value, ...locationValue })}
          showLabels={false}
        />
      </div>

      {activeCount > 0 && (
        <Button variant="ghost" className="w-full text-muted" onClick={onClear}>
          <RotateCcw className="h-4 w-4" /> Clear {activeCount} filter
          {activeCount > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}

export default function ProductFilters({
  categories = [],
  packUnits = [],
  value,
  onChange,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = useMemo(
    () =>
      [
        value.category !== "all",
        value.availability !== "all",
        value.packUnit !== "all",
        value.price !== "all",
        value.state !== undefined && value.state !== "all",
        value.district !== undefined && value.district !== "all",
        value.block !== undefined && value.block !== "all",
      ].filter(Boolean).length,
    [value],
  );
  const clear = () =>
    onChange({
      category: "all",
      availability: "all",
      packUnit: "all",
      price: "all",
      state: "all",
      district: "all",
      block: "all",
    });

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
            </div>
            {activeCount > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-light-blue px-1.5 text-xs font-bold text-primary">
                {activeCount}
              </span>
            )}
          </div>
          <FilterFields
            value={value}
            onChange={onChange}
            categories={categories}
            packUnits={packUnits}
            onClear={clear}
          />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4" /> Filters{" "}
              {activeCount > 0 && (
                <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[#fffdf8] p-0"
          >
            <SheetHeader className="border-b border-border pr-14">
              <SheetTitle>Filter products</SheetTitle>
              <p className="text-left text-sm text-muted">
                Refine the marketplace by what you need.
              </p>
            </SheetHeader>
            <div className="p-5">
              <FilterFields
                value={value}
                onChange={onChange}
                categories={categories}
                packUnits={packUnits}
                onClear={clear}
              />
              <Button
                className="mt-5 w-full"
                onClick={() => setMobileOpen(false)}
              >
                Show Products
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
