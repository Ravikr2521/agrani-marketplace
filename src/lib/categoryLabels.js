const categoryTranslationKeys = {
  FRUIT: "Fruit",
  FRUITS: "Fruits",
  VEGETABLE: "Vegetable",
  VEGETABLES: "Vegetables",
  PULSE: "Pulses",
  PULSES: "Pulses",
  DAAL: "Daal",
  GRAIN: "Grains",
  GRAINS: "Grains",
  ESSENTIALS: "ESSENTIALS",
};

export function getCategoryTranslationKey(category) {
  const normalized = String(category || "").trim().toUpperCase();

  return (
    categoryTranslationKeys[normalized] ||
    normalized
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}
