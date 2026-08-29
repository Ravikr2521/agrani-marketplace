import React from "react";

/**
 * Component to display Hindi labels using Noto Sans Devanagari font
 * as per brand guidelines
 */
export default function HindiLabels() {
  const hindiLabels = [
    { english: "Farmer", hindi: "किसान" },
    { english: "Your Location", hindi: "आपका स्थान" },
    { english: "Products", hindi: "उत्पाद" },
    { english: "Orders", hindi: "आदेश" },
    { english: "Cart", hindi: "कार्ट" },
    { english: "Categories", hindi: "श्रेणियाँ" },
    { english: "Price", hindi: "मूल्य" },
    { english: "Quantity", hindi: "मात्रा" },
    { english: "Add to Cart", hindi: "कार्ट में जोड़ें" },
    { english: "Buy Now", hindi: "अभी खरीदें" },
  ];

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-bold text-body-dark mb-4">
        Hindi Labels Example
      </h2>

      <p className="text-sm text-muted mb-6">
        These labels use the Noto Sans Devanagari font as specified in the brand
        guidelines. Apply the{" "}
        <code className="bg-cream px-1.5 py-0.5 rounded text-sm">
          hindi-text
        </code>{" "}
        class to elements containing Hindi text.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hindiLabels.map((label, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-cream transition-colors"
          >
            <span className="text-sm text-body-light">{label.english}</span>
            <span className="hindi-text text-lg font-medium text-primary">
              {label.hindi}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-light-blue border border-primary/20">
        <h3 className="font-semibold text-primary mb-2">Usage Example:</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Default (Poppins):</span>
            <span className="text-body-dark">Add to Cart</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">
              Hindi (Noto Sans Devanagari):
            </span>
            <span className="hindi-text text-body-dark">कार्ट में जोड़ें</span>
          </div>
        </div>
      </div>
    </div>
  );
}
