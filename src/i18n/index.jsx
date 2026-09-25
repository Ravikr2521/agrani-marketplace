import i18n from "i18next";
import { useEffect } from "react";
import {
  initReactI18next,
  I18nextProvider,
  useTranslation as useReactTranslation,
} from "react-i18next";
import hi from "./locales/hi";
import te from "./locales/te";
import kn from "./locales/kn";
import mr from "./locales/mr";

export const LANGUAGE_STORAGE_KEY = "agrani_language";

export const normaliseLanguage = (value) => {
  const language = String(value || "")
    .trim()
    .toLowerCase();

  return ["en", "hi", "te", "kn", "mr"].includes(language) ? language : "en";
};

export const getLanguageFromQuery = () => {
  if (typeof window === "undefined") return "en";
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  return queryLanguage === null
    ? normaliseLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
    : normaliseLanguage(queryLanguage);
};

export const setApplicationLanguage = (language) => {
  const nextLanguage = normaliseLanguage(language);

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);

  const url = new URL(window.location.href);
  url.searchParams.set("lang", nextLanguage);
  window.location.assign(url.toString());
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {},
    },
    hi: {
      translation: hi,
    },
    te: {
      translation: te,
    },
    kn: {
      translation: kn,
    },
    mr: {
      translation: mr,
    },
  },
  lng: getLanguageFromQuery(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

function LegacyTextTranslator() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return undefined;

    const originals = new WeakMap();

    const translate = () => {
      observer.disconnect();
      const language = normaliseLanguage(i18n.language);

      root
        .querySelectorAll("[placeholder], [aria-label], [title]")
        .forEach((element) => {
          ["placeholder", "aria-label", "title"].forEach((attribute) => {
            const current = element.getAttribute(attribute);
            if (!current) return;
            const record = originals.get(element) || {};
            const original =
              record[`${attribute}:applied`] === current
                ? record[attribute]
                : current;
            const next =
              language === "en"
                ? original
                : i18n.t(original, { lng: language });
            record[attribute] = original;
            record[`${attribute}:applied`] = next;
            originals.set(element, record);
            if (current !== next) element.setAttribute(attribute, next);
          });
        });

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const current = node.nodeValue;
        const record = originals.get(node);
        const original =
          record && record.applied === current
            ? record.original
            : current.trim();
        if (!original || !hi[original]) return;
        const prefix = current.match(/^\s*/)?.[0] || "";
        const suffix = current.match(/\s*$/)?.[0] || "";
        const next = `${prefix}${
          language === "en" ? original : i18n.t(original, { lng: language })
        }${suffix}`;
        originals.set(node, { original, applied: next });
        if (current !== next) node.nodeValue = next;
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    const observer = new MutationObserver(translate);
    translate();
    return () => observer.disconnect();
  }, []);
  return null;
}

export function I18nProvider({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LegacyTextTranslator />
      {children}
    </I18nextProvider>
  );
}

export const useTranslation = useReactTranslation;
