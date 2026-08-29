export default function CheckoutSteps({ step }) {
  return (
    <div className="grid grid-cols-3 gap-2 px-5 py-4 sm:px-6">
      <div
        className={`h-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`}
      />
      <div
        className={`h-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`}
      />
      <div
        className={`h-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-border"}`}
      />
      <div className="col-span-3 -mt-1 grid grid-cols-3 text-[10px] font-medium text-muted">
        <span className={step >= 1 ? "text-primary" : ""}>Review</span>
        <span className={`text-center ${step >= 2 ? "text-primary" : ""}`}>
          Details
        </span>
        <span className={`text-right ${step >= 3 ? "text-primary" : ""}`}>
          Done
        </span>
      </div>
    </div>
  );
}
