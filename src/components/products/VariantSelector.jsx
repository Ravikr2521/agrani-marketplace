import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/utils";

export default function VariantSelector({ variants = [], value, onChange }) {
  return (
    <Select value={value ? String(value) : undefined} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full bg-white">
        <SelectValue placeholder="Select variant" />
      </SelectTrigger>

      <SelectContent className="z-100">
        {variants.map((v) => (
          <SelectItem key={v.id} value={String(v.id)}>
            <div className="flex items-center gap-1">
              <span className="font-medium">{v.name || "Standard"}</span>
              <span className="text-xs text-muted">
                · {v.pack_quantity} {v.pack_unit}
              </span>
              <span className="text-xs font-semibold text-primary">
                · {formatINR(v.price)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
