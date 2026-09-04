import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({ side = "right", className, children }) {
  const sideClass = {
    right: "right-0 top-0 h-full w-[min(92vw,480px)] border-l",
    left: "left-0 top-0 h-full w-[min(92vw,480px)] border-r",
    bottom: "bottom-0 left-0 w-full max-h-[92vh] border-t",
  }[side];

  const animationClass = {
    right: `
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=open]:slide-in-from-right
      data-[state=closed]:slide-out-to-right
    `,
    left: `
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=open]:slide-in-from-left
      data-[state=closed]:slide-out-to-left
    `,
    bottom: `
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=open]:slide-in-from-bottom
      data-[state=closed]:slide-out-to-bottom
    `,
  }[side];

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="
          fixed
          inset-0
          z-50
          bg-slate-950/45
          backdrop-blur-[2px]
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
        "
      />

      <DialogPrimitive.Content
        className={cn(
          `
            fixed
            z-50
            bg-white
            shadow-[-20px_0_60px_rgba(0,0,0,0.12)]
            outline-none
            will-change-transform
            transform-gpu
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=open]:fade-in-0
            data-[state=closed]:fade-out-0
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
          `,
          animationClass,
          sideClass,
          className,
        )}
      >
        {children}

        <DialogPrimitive.Close
          className="
            absolute
            right-4
            top-4
            rounded-lg
            p-2
            text-muted
            transition-all
            duration-200
            hover:bg-gray-50
            hover:text-body-dark
            active:scale-90
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-700/30
          "
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const SheetHeader = ({ className, ...p }) => (
  <div className={cn("p-5 pb-4", className)} {...p} />
);

export const SheetTitle = ({ className, ...p }) => (
  <DialogPrimitive.Title
    className={cn("text-lg font-semibold", className)}
    {...p}
  />
);

export const SheetDescription = ({ className, ...p }) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted", className)}
    {...p}
  />
);
