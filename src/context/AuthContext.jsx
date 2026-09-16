import { createContext, useContext, useMemo, useState } from "react";
import { getLanguageFromQuery, LANGUAGE_STORAGE_KEY } from "@/i18n";

const AuthContext = createContext(null);

const DEV_MOBILE_NO = "6666666013";

const DEV_TOKEN = "f47ac10b58cc4372a5670e02b2c3d4e5";

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function getInitialAuth() {
  const params = new URLSearchParams(window.location.search);

  const language = getLanguageFromQuery();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  const urlToken = params.get("token")?.split(/[?&]/)[0];

  if (urlToken) {
    const payload = decodeJwtPayload(urlToken);

    const mobile =
      payload?.preferred_username ||
      payload?.mobile ||
      payload?.phone_number ||
      payload?.phone;
    // ||  DEV_MOBILE_NO;

    const mobileString = String(mobile);

    localStorage.setItem("agrani_auth_token", urlToken);
    localStorage.setItem("farmers_marketplace_verified_phone", mobileString);

    return {
      token: DEV_TOKEN,
      AgraniToken: urlToken,
      SellerMobile: mobileString,
      language,
    };
  }

  const savedAgraniToken = localStorage.getItem("agrani_auth_token");
  if (savedAgraniToken) {
    const payload = decodeJwtPayload(savedAgraniToken);
    const mobile =
      payload?.preferred_username ||
      payload?.mobile ||
      payload?.phone_number ||
      payload?.phone ||
      DEV_MOBILE_NO;

    const mobileString = String(mobile);

    const savedPhone = localStorage.getItem(
      "farmers_marketplace_verified_phone",
    );
    if (!savedPhone) {
      localStorage.setItem("farmers_marketplace_verified_phone", mobileString);
    }

    return {
      token: DEV_TOKEN,
      AgraniToken: savedAgraniToken,
      SellerMobile: mobileString,
      language,
    };
  }

  // Fallback to dev tokens
  return {
    token: DEV_TOKEN,
    language,
    // AgraniToken: DEV_AGRANI_TOKEN,
    // SellerMobile: DEV_MOBILE_NO,
  };
}

export const AuthProvider = ({ children }) => {
  const initialAuth = useMemo(() => getInitialAuth(), []);

  const [token, setToken] = useState(initialAuth?.token ?? null);
  const [AgraniToken, setAgraniToken] = useState(
    initialAuth?.AgraniToken ?? null,
  );
  const [SellerMobile, setSellerMobile] = useState(
    initialAuth?.SellerMobile ?? null,
  );
  const [language] = useState(initialAuth?.language ?? "en");

  const value = {
    token,
    setToken,
    SellerMobile,
    setSellerMobile,
    AgraniToken,
    setAgraniToken,
    language,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
