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
    console.log("getBuyerMobileNumber token payload:", payload);

    const mobile =
      payload?.preferred_username ||
      payload?.mobile ||
      payload?.phone_number ||
      payload?.phone;
    if (mobile) {
      const mobileString = String(mobile);
      console.log("getBuyerMobileNumber extracted mobile:", mobileString);

      localStorage.setItem("farmers_marketplace_buyer_phone", mobileString);
      localStorage.setItem("farmers_marketplace_verified_phone", mobileString);

      return mobileString;
    }
  }

  return null;
}

export function saveBuyerMobileNumber(mobileNumber) {
  if (mobileNumber && /^\d{10}$/.test(mobileNumber)) {
    localStorage.setItem("farmers_marketplace_buyer_phone", mobileNumber);
    localStorage.setItem("farmers_marketplace_verified_phone", mobileNumber);
  }
}

export function clearBuyerMobileNumber() {
  localStorage.removeItem("farmers_marketplace_buyer_phone");
  localStorage.removeItem("farmers_marketplace_verified_phone");
}

export function hasBuyerMobileNumber() {
  return !!getBuyerMobileNumber();
}
