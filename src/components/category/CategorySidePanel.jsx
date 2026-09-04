const getMediaUrl = (media) =>
  media?.productImgUrl || media?.image || media?.file || media?.url || "";

function getCategoryImage(products, category) {
  const product = products.find(
    (item) =>
      String(item?.category || "").toUpperCase() ===
      String(category || "").toUpperCase(),
  );

  if (!product) return "";

  for (const variant of product?.variants || []) {
    for (const media of variant?.all_media || []) {
      const image = getMediaUrl(media);

      if (image) {
        return image;
      }
    }
  }

  return "";
}

function formatCategoryName(category) {
  if (!category) return "";

  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CategorySidePanel({
  products = [],
  categories = [],
  selectedCategory = "all",
  onSelect,
}) {
  const items = [
    {
      value: "all",
      label: "All Products",
      image: getCategoryImage(products),
    },
    ...categories.map((category) => ({
      value: category,
      label: formatCategoryName(category),
      image: getCategoryImage(products, category),
    })),
  ];

  return (
    <aside className="w-17 shrink-0 sm:w-30 lg:w-16">
      <div className="space-y-5">
        {items.map((item) => {
          const active =
            String(selectedCategory).toUpperCase() ===
            String(item.value).toUpperCase();

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              className="group flex w-full flex-col items-center text-center"
            >
              <div
                className={`
                  relative
                  h-14
                  w-14
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  shadow-xs
                  transition-all
                  duration-200
                  sm:h-22
                  sm:w-22
                  lg:h-20
                  lg:w-20
                  ${
                    active
                      ? "border-primary  bg-light-blue ring-2 ring-primary/10"
                      : "border-border/70 hover:border-primary/40"
                  }
                `}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-stone-50">
                    <span className="text-2xl">🌱</span>
                  </div>
                )}

                {active && (
                  <div className="absolute inset-0 border-2 border-primary/60" />
                )}
              </div>

              <span
                className={`
                  mt-2
                  line-clamp-2
                  px-1
                  text-[11px]
                  leading-4
                  transition-colors
                  sm:text-xs
                  ${
                    active
                      ? "font-semibold text-body-dark"
                      : "font-medium text-muted group-hover:text-body-dark"
                  }
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
