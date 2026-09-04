export function getBuyerMobileNumber() {
  const localStorageMobile = localStorage.getItem(
    "farmers_marketplace_buyer_phone",
  );
  if (localStorageMobile) {
    return localStorageMobile;
  }
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

  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");

  if (urlToken) {
    const payload = decodeJwtPayload(urlToken);
    const mobile =
      payload?.preferred_username ||
      payload?.mobile ||
      payload?.phone_number ||
      payload?.phone;
    if (mobile) {
      localStorage.setItem("farmers_marketplace_buyer_phone", String(mobile));
      return String(mobile);
    }
  }

  return null;
}

export function saveBuyerMobileNumber(mobileNumber) {
  if (mobileNumber && /^\d{10}$/.test(mobileNumber)) {
    localStorage.setItem("farmers_marketplace_buyer_phone", mobileNumber);
  }
}

export function clearBuyerMobileNumber() {
  localStorage.removeItem("farmers_marketplace_buyer_phone");
}

export function hasBuyerMobileNumber() {
  return !!getBuyerMobileNumber();
}
