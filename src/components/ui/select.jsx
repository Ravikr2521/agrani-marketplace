import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;

export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        `
          flex
          h-11
          w-full
          items-center
          justify-between
          rounded-xl
          border
          border-border
          bg-white
          px-3.5
          text-sm
          font-medium
          text-body-light
          outline-none
          transition-colors
          focus:border-primary
          focus:ring-2
          focus:ring-orange-200
          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className,
      )}
      {...props}
    >
      {/* Selected value */}
      {children}

      {/* Dropdown icon */}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ children, className, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        className={cn(
          `
            z-70
            min-w-(--radix-select-trigger-width)
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-white
            p-1
            text-body-light
            shadow-xl
            animate-in
            fade-in-0
            zoom-in-95
          `,
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ value, children, className, ...props }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        `
          relative
          flex
          w-full
          cursor-pointer
          select-none
          items-center
          rounded-lg
          py-2
          pl-3
          pr-8
          text-sm
          font-medium
          text-body-light
          outline-none
          transition-colors

          focus:bg-orange-200
          focus:text-primary

          data-highlighted:bg-orange-100
          data-highlighted:text-primary

          data-disabled:pointer-events-none
          data-disabled:opacity-50
        `,
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator
        className="
          absolute
          right-2
          flex
          items-center
          justify-center
        "
      >
        <Check className="h-4 w-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
