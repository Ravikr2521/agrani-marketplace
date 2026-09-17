import i18n from "i18next";
import { useEffect } from "react";
import {
  initReactI18next,
  I18nextProvider,
  useTranslation as useReactTranslation,
} from "react-i18next";

export const LANGUAGE_STORAGE_KEY = "agrani_language";

export const normaliseLanguage = (value) =>
  String(value || "")
    .trim()
    .toLowerCase() === "hi"
    ? "hi"
    : "en";

export const getLanguageFromQuery = () => {
  if (typeof window === "undefined") return "en";
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  return queryLanguage === null
    ? normaliseLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
    : normaliseLanguage(queryLanguage);
};

const hi = {
  Home: "होम",
  Category: "श्रेणी",
  Categories: "श्रेणियाँ",
  Orders: "ऑर्डर",
  Cart: "कार्ट",
  "Your Cart": "आपका कार्ट",
  "Delivery Details": "डिलीवरी विवरण",
  "Order Confirmed": "ऑर्डर की पुष्टि",
  Wishlist: "पसंदीदा",
  "My Account": "मेरा खाता",
  Logout: "लॉग आउट",

  "Search for": "खोजें",
  "Search products": "उत्पाद खोजें",

  "Add to cart": "कार्ट में जोड़ें",
  "Add to Cart": "कार्ट में जोड़ें",

  "Buy Now": "अभी खरीदें",
  "Continue Shopping": "खरीदारी जारी रखें",
  "Continue to delivery": "डिलीवरी के लिए आगे बढ़ें",

  Items: "आइटम",
  Subtotal: "उप-योग",
  "Order total": "ऑर्डर कुल",
  "Place Order": "ऑर्डर करें",
  "Placing order...": "ऑर्डर किया जा रहा है...",

  Back: "वापस",
  "Delivery details": "डिलीवरी विवरण",
  "Where should we deliver your order?": "आपका ऑर्डर कहाँ पहुँचाना है?",
  "Your name": "आपका नाम",
  "Mobile number": "मोबाइल नंबर",
  "Delivery address": "डिलीवरी पता",
  Pincode: "पिनकोड",
  Change: "बदलें",
  "Verified Mobile": "सत्यापित मोबाइल",
  "Full name": "पूरा नाम",
  "10-digit number": "10 अंकों का नंबर",
  "6-digit pincode": "6 अंकों का पिनकोड",

  "Order confirmed!": "ऑर्डर की पुष्टि हो गई!",
  "Order summary": "ऑर्डर सारांश",
  Status: "स्थिति",
  "What's next?": "आगे क्या होगा?",

  "Verify Your Mobile": "अपना मोबाइल सत्यापित करें",
  "Enter OTP": "OTP दर्ज करें",
  "Send OTP": "OTP भेजें",
  "Sending OTP…": "OTP भेजा जा रहा है…",
  "Verify OTP": "OTP सत्यापित करें",
  "Verifying…": "सत्यापित किया जा रहा है…",
  "Resend OTP": "OTP फिर से भेजें",
  "Sending…": "भेजा जा रहा है…",
  "Edit number": "नंबर बदलें",

  "Please enter a valid 10-digit mobile number.":
    "कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।",

  "OTP sent to your mobile number.": "आपके मोबाइल नंबर पर OTP भेज दिया गया है।",

  "Please enter the complete 4-digit OTP.":
    "कृपया पूरा 4 अंकों का OTP दर्ज करें।",

  "Mobile number verified and logged in!":
    "मोबाइल नंबर सत्यापित हो गया और लॉग इन हो गया!",

  "Mobile number verified!": "मोबाइल नंबर सत्यापित हो गया!",
  "Invalid OTP. Please try again.": "अमान्य OTP। कृपया फिर से प्रयास करें।",
  "OTP resent.": "OTP फिर से भेज दिया गया है।",
  "Failed to resend OTP.": "OTP फिर से भेजा नहीं जा सका।",

  "Added to cart": "कार्ट में जोड़ दिया गया",
  Remove: "हटाएं",
  "Currently unavailable": "अभी उपलब्ध नहीं है",
  "Decrease quantity": "मात्रा कम करें",
  "Increase quantity": "मात्रा बढ़ाएं",
  "Clear search": "खोज साफ करें",

  Filters: "फ़िल्टर",
  "Loading produce...": "उत्पाद लोड हो रहे हैं...",
  Quantity: "मात्रा",
  Price: "कीमत",
  Total: "कुल",
  Review: "समीक्षा",
  Details: "विवरण",
  Done: "पूर्ण",

  "Your cart is empty": "आपका कार्ट खाली है",
  "Add products before checking out.": "चेकआउट करने से पहले उत्पाद जोड़ें।",
  "Browse products": "उत्पाद देखें",
  Checkout: "चेकआउट",
  "Review order": "ऑर्डर देखें",

  "No orders yet": "अभी कोई ऑर्डर नहीं है",
  "View Orders": "ऑर्डर देखें",
  "Refresh orders": "ऑर्डर रीफ़्रेश करें",
  "Ordered products": "ऑर्डर किए गए उत्पाद",
  Buyer: "खरीदार",
  "Continue shopping": "खरीदारी जारी रखें",
  "In stock": "स्टॉक में",
  "Seller details": "विक्रेता विवरण",
  Mobile: "मोबाइल",
  Email: "ईमेल",

  "Choose your preferred pack": "अपना पसंदीदा पैक चुनें",
  "Select variant": "विकल्प चुनें",
  "Select unit": "इकाई चुनें",
  "Select status": "स्थिति चुनें",
  "Select state": "राज्य चुनें",
  "Select district": "जिला चुनें",
  "Select block": "ब्लॉक चुनें",

  "All categories": "सभी श्रेणियाँ",
  "All pack units": "सभी पैक इकाइयाँ",
  "Any price": "कोई भी कीमत",
  Location: "स्थान",
  "Filter products": "उत्पाद फ़िल्टर करें",

  "No image": "कोई छवि नहीं",
  "Previous image": "पिछली छवि",
  "Next image": "अगली छवि",
  "Previous products": "पिछले उत्पाद",
  "Next products": "अगले उत्पाद",

  "Remove from wishlist": "पसंदीदा से हटाएं",
  "Remove from cart": "कार्ट से हटाएं",
  "Maximum available quantity reached": "अधिकतम उपलब्ध मात्रा पहुँच गई है",
  "Product unavailable": "उत्पाद उपलब्ध नहीं है",
  "Failed to add to cart": "कार्ट में जोड़ना विफल रहा",
  "Removed from wishlist": "पसंदीदा से हटा दिया गया",
  "Failed to remove from wishlist": "पसंदीदा से हटाना विफल रहा",

  "Please login to view your wishlist":
    "अपनी पसंदीदा सूची देखने के लिए लॉग इन करें",

  "Failed to fetch wishlist": "पसंदीदा सूची लोड नहीं हो सकी",
  "Product information not available": "उत्पाद की जानकारी उपलब्ध नहीं है",
  "Failed to place order": "ऑर्डर नहीं किया जा सका",
  "Please try again.": "कृपया फिर से प्रयास करें।",

  "Mobile number verification required": "मोबाइल नंबर सत्यापन आवश्यक है",
  "Mobile number mismatch": "मोबाइल नंबर मेल नहीं खाता",
  "Name is required": "नाम आवश्यक है",
  "Delivery address is required": "डिलीवरी पता आवश्यक है",

  "Enter a valid 10-digit mobile number":
    "मान्य 10 अंकों का मोबाइल नंबर दर्ज करें",

  "Enter a valid 6-digit pincode": "मान्य 6 अंकों का पिनकोड दर्ज करें",

  "All orders": "सभी ऑर्डर",
  Previous: "पिछला",
  Next: "अगला",
  Filter: "फ़िल्टर",
  "Loading products...": "उत्पाद लोड हो रहे हैं...",
  "Search your listings": "अपनी लिस्टिंग खोजें",
  "No variants yet.": "अभी कोई विकल्प नहीं है।",
  Variants: "विकल्प",
  "All India": "पूरा भारत",
  "Select Areas": "क्षेत्र चुनें",
  "Search state...": "राज्य खोजें...",
  "No saved addresses": "कोई सहेजा हुआ पता नहीं है",
  "Add new address": "नया पता जोड़ें",
  "Delivery location": "डिलीवरी स्थान",

  "Products Near By": "आसपास के उत्पाद",
  "Fresh products from verified agricultural sellers.":
    "सत्यापित कृषि विक्रेताओं के ताज़ा उत्पाद।",

  "No products found": "कोई उत्पाद नहीं मिला",
  "Try changing your search or filters.": "अपनी खोज या फ़िल्टर बदलकर देखें।",

  "Top Recommendations": "आपके लिए सुझाव",
  "Products picked especially for you.": "आपके लिए खास तौर पर चुने गए उत्पाद।",

  "Fresh Fruits": "ताज़े फल",
  "Fresh and naturally grown fruits from local sellers.":
    "स्थानीय विक्रेताओं के ताज़े और प्राकृतिक फल।",

  "Fresh Vegetables": "ताज़ी सब्ज़ियाँ",
  "Fresh vegetables sourced from verified sellers.":
    "सत्यापित विक्रेताओं की ताज़ी सब्ज़ियाँ।",

  Pulses: "दालें",
  "Quality pulses for your everyday needs.":
    "आपकी रोज़मर्रा की ज़रूरतों के लिए अच्छी दालें।",

  pulses: "दालें",

  "Farm fresh": "खेत की ताज़गी",
  "Fresh picks, every day": "हर दिन ताज़ा चयन",
  "Trusted quality": "विश्वसनीय गुणवत्ता",
  "From verified sellers": "सत्यापित विक्रेताओं से",
  "Shop smarter": "बेहतर खरीदारी करें",
  "Find your essentials": "अपनी ज़रूरत की चीज़ें खोजें",
  "Explore category": "श्रेणी देखें",

  "Best Sellers": "सबसे ज़्यादा बिकने वाले",
  "Popular products shoppers are buying now.":
    "लोकप्रिय उत्पाद जिन्हें खरीदार अभी खरीद रहे हैं।",

  "Best selling": "लोकप्रिय",
  "Explore products": "उत्पाद देखें",

  "Fresh agricultural marketplace": "ताज़ा कृषि बाज़ार",
  "Fresh produce from local farms": "स्थानीय खेतों से ताज़ी उपज",

  "Browse verified farm stocks, choose your variant, and order without an account.":
    "सत्यापित खेतों की उपज देखें, अपना विकल्प चुनें और बिना खाते के ऑर्डर करें।",

  "Simple & convenient delivery": "सरल और सुविधाजनक डिलीवरी",
  "From farm to your doorstep": "खेत से आपके दरवाज़े तक",

  "Choose your preferred produce and pack size and get your order delivered with ease.":
    "अपनी पसंद की उपज और पैक आकार चुनें और आसानी से डिलीवरी पाएँ।",

  "Verified agricultural sellers": "सत्यापित कृषि विक्रेता",
  "Quality you can trust": "भरोसेमंद गुणवत्ता",

  "Discover fresh products from verified sellers and select the exact variant and pack size you need.":
    "सत्यापित विक्रेताओं से ताज़े उत्पाद खोजें और अपनी ज़रूरत का सटीक विकल्प व पैक आकार चुनें।",

  "Naturally fresh, farm-picked": "प्राकृतिक रूप से ताज़ा, खेत से चुने गए",
  "Crisp, fresh & locally sourced": "कुरकुरी, ताज़ी और स्थानीय उपज",
  "Quality Pulses": "उत्तम दालें",
  "Everyday essentials from trusted sellers":
    "विश्वसनीय विक्रेताओं से रोज़मर्रा की ज़रूरी चीज़ें",

  "Review your order": "अपना ऑर्डर देखें",
  "Check your items before continuing.": "आगे बढ़ने से पहले आइटम जाँचें",

  "in your basket": "कार्ट में",
  "Pick a fresh variant from the marketplace and it will appear here.":
    "मार्केटप्लेस से उत्पाद जोड़ें और वे यहाँ दिखाई देंगे।",

  "Browse Produce": "उत्पाद देखें",
  Standard: "सामान्य",

  "Taxes and delivery charges may apply":
    "टैक्स और डिलीवरी शुल्क अलग से लागू हो सकते हैं",

  "Enter your delivery information": "डिलीवरी जानकारी भरें",
  "House / flat no., street, locality": "मकान / फ्लैट नंबर, गली, क्षेत्र",

  "Your delivery information is securely handled.":
    "आपकी डिलीवरी जानकारी सुरक्षित रखी जाती है।",

  "Please verify your mobile number before placing order":
    "ऑर्डर करने से पहले अपना मोबाइल नंबर सत्यापित करें",

  "Please use your verified mobile number":
    "कृपया अपना सत्यापित मोबाइल नंबर इस्तेमाल करें",

  "Order was not created.": "ऑर्डर नहीं बनाया जा सका",

  "Thank you for your order. We've received it and will start preparing it shortly.":
    "आपके ऑर्डर के लिए धन्यवाद! आपका ऑर्डर जल्द तैयार किया जाएगा।",

  "Your order has been received and will be prepared for delivery.":
    "आपका ऑर्डर प्राप्त हो गया है और डिलीवरी के लिए तैयार किया जाएगा।",

  "My Wishlist": "मेरी विशलिस्ट",
  "Move to Cart": "कार्ट में डालें",
  "Order history": "ऑर्डर इतिहास",

  "View and manage your marketplace orders":
    "अपने मार्केटप्लेस ऑर्डर देखें और प्रबंधित करें",

  "Verify your mobile number to access your order history":
    "ऑर्डर इतिहास देखने के लिए अपना मोबाइल नंबर सत्यापित करें",

  "Orders for": "ऑर्डर",
  item: "आइटम",
  items: "आइटम",

  "View details": "विवरण देखें",
  "Unable to load orders.": "ऑर्डर लोड नहीं किए जा सके।",
  "Try Again": "पुनः प्रयास करें",

  "Orders you place on the marketplace will appear here.":
    "मार्केटप्लेस पर आपके द्वारा किए गए ऑर्डर यहाँ दिखाई देंगे।",

  "Switch account": "अकाउंट बदलें",
  Pending: "लंबित",
  Shipped: "भेज दिया गया",
  Delivered: "डिलीवर हो गया",
  Completed: "पूरा हुआ",

  "Order details": "ऑर्डर विवरण",
  "Order placed": "ऑर्डर किया गया",
  Product: "उत्पाद",
  "Sold by": "विक्रेता",
  PIN: "पिन",
  "Order not found.": "ऑर्डर नहीं मिला।",
  "Unable to load order.": "ऑर्डर लोड नहीं किया जा सका।",

  "Please verify your mobile number first to view order details.":
    "ऑर्डर विवरण देखने के लिए पहले अपना मोबाइल नंबर सत्यापित करें",
  "Explore fresh picks": "ताज़ा उत्पाद देखें",
  "Fresh products direct from local farmers.":
    "स्थानीय किसानों से सीधे ताज़ा उत्पाद।",
  listing: "लिस्टिंग",
  listings: "लिस्टिंग्स",
  "on this page": "इस पेज पर",
  "active filter": "सक्रिय फ़िल्टर",
  Active: "सक्रिय",
  Availability: "उपलब्धता",
  Pack: "पैक",
  State: "राज्य",
  District: "ज़िला",
  Block: "ब्लॉक",
  vegetables: "सब्ज़ियाँ",
  fruits: "फल",
  grains: "अनाज",
  "Under ₹250": "₹250 से कम",
  "₹250 – ₹500": "₹250 – ₹500",
  "₹500 – ₹1,000": "₹500 – ₹1,000",
  "Above ₹1,000": "₹1,000 से अधिक",
  Clear: "साफ़ करें",
  filter: "फ़िल्टर",
  filters: "फ़िल्टर",
  "Refine the marketplace by what you need.":
    "अपनी ज़रूरत के अनुसार मार्केटप्लेस को सीमित करें।",
  "Show Products": "उत्पाद दिखाएं",
  s: "",
  "Clear Cart": "कार्ट खाली करें",
};

i18n.use(initReactI18next).init({
  resources: { hi: { translation: hi }, en: { translation: {} } },
  lng: getLanguageFromQuery(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

function LegacyTextTranslator() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return undefined;

    const originals = new WeakMap();

    const translate = () => {
      observer.disconnect();
      const language = i18n.language === "hi" ? "hi" : "en";

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
            const next = language === "hi" ? i18n.t(original) : original;
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
        const next = `${prefix}${language === "hi" ? i18n.t(original) : original}${suffix}`;
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
