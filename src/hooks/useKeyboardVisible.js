import { useEffect, useState } from "react";

export function useKeyboardVisible() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (!visualViewport) return;

    const handleViewportResize = () => {
      const viewportHeight = visualViewport.height;
      const windowHeight = window.innerHeight;

      const keyboardHeight = windowHeight - viewportHeight;

      setKeyboardVisible(keyboardHeight > 120);
    };

    visualViewport.addEventListener("resize", handleViewportResize);
    visualViewport.addEventListener("scroll", handleViewportResize);

    handleViewportResize();

    return () => {
      visualViewport.removeEventListener("resize", handleViewportResize);
      visualViewport.removeEventListener("scroll", handleViewportResize);
    };
  }, []);

  return keyboardVisible;
}
