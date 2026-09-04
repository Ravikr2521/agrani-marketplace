import { createContext, useState, useCallback } from "react";
import {
  getBuyerMobileNumber,
  saveBuyerMobileNumber,
} from "@/utils/mobileNumber";

export const MobileNumberContext = createContext(null);

export function MobileNumberProvider({ children }) {
  const [showOtpGate, setShowOtpGate] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const getCurrentMobile = useCallback(() => {
    return getBuyerMobileNumber();
  }, []);

  const saveMobile = useCallback((mobileNumber) => {
    saveBuyerMobileNumber(mobileNumber);
  }, []);

  const requireMobileNumber = useCallback(
    (action) => {
      const mobile = getCurrentMobile();

      if (mobile) {
        action(mobile);
      } else {
        setPendingAction(() => action);
        setShowOtpGate(true);
      }
    },
    [getCurrentMobile],
  );

  const handleOtpVerified = useCallback(
    (mobileNumber) => {
      saveMobile(mobileNumber);
      setShowOtpGate(false);

      if (pendingAction) {
        pendingAction(mobileNumber);
        setPendingAction(null);
      }
    },
    [saveMobile, pendingAction],
  );

  const handleOtpClose = useCallback(() => {
    setShowOtpGate(false);
    setPendingAction(null);
  }, []);

  const value = {
    getCurrentMobile,
    requireMobileNumber,
    showOtpGate,
    pendingAction,
    handleOtpVerified,
    handleOtpClose,
  };

  return (
    <MobileNumberContext.Provider value={value}>
      {children}
    </MobileNumberContext.Provider>
  );
}
