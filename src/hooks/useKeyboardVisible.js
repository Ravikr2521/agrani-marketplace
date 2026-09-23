import { useEffect, useRef, useState } from "react";

function isEditableElement(element) {
  if (!element || !(element instanceof HTMLElement)) return false;

  return (
    element.isContentEditable ||
    element.tagName === "TEXTAREA" ||
    (element.tagName === "INPUT" &&
      ![
        "button",
        "checkbox",
        "file",
        "hidden",
        "radio",
        "reset",
        "submit",
      ].includes(element.type))
  );
}

export function useKeyboardVisible() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const maximumViewportHeight = useRef(0);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    const updateKeyboardVisibility = () => {
      const hasFocusedEditable = isEditableElement(document.activeElement);

      if (!hasFocusedEditable) {
        maximumViewportHeight.current = Math.max(
          maximumViewportHeight.current,
          visualViewport?.height ?? window.innerHeight,
        );
      }

      const keyboardHeight = visualViewport
        ? maximumViewportHeight.current - visualViewport.height
        : 0;

      setKeyboardVisible(
        hasFocusedEditable && (keyboardHeight > 120 || !visualViewport),
      );
    };

    const handleFocusChange = () => {
      if (isEditableElement(document.activeElement)) {
        setKeyboardVisible(true);
        return;
      }

      window.setTimeout(updateKeyboardVisibility, 0);
    };

    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("focusout", handleFocusChange);
    visualViewport?.addEventListener("resize", updateKeyboardVisibility);
    visualViewport?.addEventListener("scroll", updateKeyboardVisibility);

    updateKeyboardVisibility();

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
      document.removeEventListener("focusout", handleFocusChange);
      visualViewport?.removeEventListener("resize", updateKeyboardVisibility);
      visualViewport?.removeEventListener("scroll", updateKeyboardVisibility);
    };
  }, []);

  return keyboardVisible;
}
