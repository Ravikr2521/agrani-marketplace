import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      const scrollContainers = document.querySelectorAll(
        '[class*="overflow-y-auto"], [class*="overflow-auto"]',
      );

      scrollContainers.forEach((element) => {
        element.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
    };

    requestAnimationFrame(scrollToTop);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
