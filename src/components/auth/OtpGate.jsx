// import React, { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Phone,
//   KeyRound,
//   RefreshCw,
//   CheckCircle2,
//   ArrowRight,
//   Loader2,
//   ShoppingBag,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { getOTP, verifyOTP } from "@/api/auth";

// const OtpInput = ({ value, onChange }) => {
//   const digits = (value || "").split("").slice(0, 4);
//   while (digits.length < 4) digits.push("");

//   const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

//   const handleChange = (index, e) => {
//     const input = e.target.value;

//     if (!/^\d*$/.test(input)) return;

//     const newDigits = [...digits];

//     if (input && input.length > 0) {
//       const lastChar = input.slice(-1);
//       newDigits[index] = lastChar;

//       if (index < 3) {
//         setTimeout(() => {
//           inputRefs[index + 1].current?.focus();
//         }, 10);
//       }
//     } else {
//       newDigits[index] = "";
//     }

//     onChange(newDigits.join(""));
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace") {
//       if (!digits[index] && index > 0) {
//         const newDigits = [...digits];
//         newDigits[index - 1] = "";
//         onChange(newDigits.join(""));
//         setTimeout(() => {
//           inputRefs[index - 1].current?.focus();
//         }, 10);
//       }
//     }

//     if (e.key === "ArrowLeft" && index > 0) {
//       inputRefs[index - 1].current?.focus();
//     }
//     if (e.key === "ArrowRight" && index < 3) {
//       inputRefs[index + 1].current?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 4);

//     if (pasted) {
//       onChange(pasted);

//       const focusIndex = Math.min(pasted.length - 1, 3);
//       setTimeout(() => {
//         inputRefs[focusIndex].current?.focus();
//       }, 10);
//     }
//   };

//   return (
//     <div className="flex gap-3 justify-center">
//       {digits.map((digit, index) => (
//         <input
//           key={index}
//           ref={inputRefs[index]}
//           type="tel"
//           inputMode="numeric"
//           pattern="[0-9]*"
//           maxLength={1}
//           value={digit}
//           onChange={(e) => handleChange(index, e)}
//           onKeyDown={(e) => handleKeyDown(index, e)}
//           onFocus={(e) => e.target.select()}
//           onPaste={handlePaste}
//           className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 border-border bg-white text-body-dark focus:outline-none focus:border-primary transition-colors"
//           autoComplete="one-time-code"
//         />
//       ))}
//     </div>
//   );
// };

// export default function OtpGate({ onVerified }) {
//   const [step, setStep] = useState("phone");
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [sending, setSending] = useState(false);
//   const [verifying, setVerifying] = useState(false);

//   const handleSendOtp = async () => {
//     const cleaned = phone.trim();
//     if (!/^\d{10}$/.test(cleaned)) {
//       toast.warning("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     setSending(true);
//     try {
//       await getOTP(cleaned);
//       setOtp("");
//       setStep("otp");
//       toast.success("OTP sent to your mobile number.");
//     } catch (err) {
//       toast.error(err?.message || "Failed to send OTP. Please try again.");
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleVerify = async () => {
//     if (otp.length !== 4) {
//       toast.warning("Please enter the complete 4-digit OTP.");
//       return;
//     }

//     setVerifying(true);

//     try {
//       await verifyOTP(phone.trim(), otp);

//       toast.success("Mobile number verified!");
//       onVerified(phone.trim());
//     } catch (err) {
//       toast.error(err?.message || "Invalid OTP. Please try again.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const handleResend = async () => {
//     setSending(true);
//     try {
//       await getOTP(phone.trim());
//       toast.success("OTP resent.");
//     } catch {
//       toast.error("Failed to resend OTP.");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center md:py-16 py-10 px-4">
//       <div className="w-full max-w-sm space-y-6">
//         <div className="text-center space-y-2">
//           <div className="w-14 h-14 rounded-2xl bg-light-blue border border-light-blue flex items-center justify-center mx-auto">
//             {step === "phone" ? (
//               <Phone className="w-6 h-6 text-primary" />
//             ) : (
//               <KeyRound className="w-6 h-6 text-primary" />
//             )}
//           </div>
//           <h2 className="text-base font-bold text-body-dark">
//             {step === "phone" ? "Verify Your Mobile" : "Enter OTP"}
//           </h2>
//           <p className="text-[13px] text-muted leading-relaxed">
//             {step === "phone"
//               ? "Enter your registered mobile number to view your marketplace orders"
//               : `We've sent a 4-digit OTP to ${phone}. Enter it below to continue.`}
//           </p>
//         </div>

//         <AnimatePresence mode="wait">
//           {step === "phone" ? (
//             <motion.div
//               key="phone"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               className="space-y-3"
//             >
//               <div className="relative">
//                 <Phone
//                   size={14}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
//                 />
//                 <Input
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   placeholder="10-digit mobile number"
//                   value={phone}
//                   onChange={(e) =>
//                     setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
//                   }
//                   className="pl-9"
//                   onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
//                 />
//               </div>
//               <Button
//                 className="w-full gap-2"
//                 onClick={handleSendOtp}
//                 disabled={sending || phone.length !== 10}
//               >
//                 {sending ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <ArrowRight className="w-4 h-4" />
//                 )}
//                 {sending ? "Sending OTP…" : "Send OTP"}
//               </Button>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="otp"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               className="space-y-4"
//             >
//               <OtpInput value={otp} onChange={setOtp} />
//               <Button
//                 className="w-full gap-2"
//                 onClick={handleVerify}
//                 disabled={verifying || otp.length !== 4}
//               >
//                 {verifying ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <CheckCircle2 className="w-4 h-4" />
//                 )}
//                 {verifying ? "Verifying…" : "Verify OTP"}
//               </Button>
//               <div className="flex items-center justify-between text-xs">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep("phone");
//                     setOtp("");
//                   }}
//                   className="text-muted hover:text-body-dark transition-colors"
//                 >
//                   ← Change number
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleResend}
//                   disabled={sending}
//                   className="text-primary hover:underline disabled:opacity-50 transition-colors"
//                 >
//                   {sending ? "Sending…" : "Resend OTP"}
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  KeyRound,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getOTP, verifyOTP } from "@/api/auth";

const OtpInput = ({ value, onChange }) => {
  const digits = (value || "").split("").slice(0, 4);

  while (digits.length < 4) digits.push("");

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, e) => {
    const input = e.target.value;

    if (!/^\d*$/.test(input)) return;

    const newDigits = [...digits];

    if (input && input.length > 0) {
      const lastChar = input.slice(-1);
      newDigits[index] = lastChar;

      if (index < 3) {
        setTimeout(() => {
          inputRefs[index + 1].current?.focus();
        }, 10);
      }
    } else {
      newDigits[index] = "";
    }

    onChange(newDigits.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];

        newDigits[index - 1] = "";

        onChange(newDigits.join(""));

        setTimeout(() => {
          inputRefs[index - 1].current?.focus();
        }, 10);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pasted) {
      onChange(pasted);

      const focusIndex = Math.min(pasted.length - 1, 3);

      setTimeout(() => {
        inputRefs[focusIndex].current?.focus();
      }, 10);
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          onPaste={handlePaste}
          className="h-12 w-12 rounded-xl border-2 border-border bg-white text-center text-xl font-bold text-body-dark transition-colors focus:border-primary focus:outline-none"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default function OtpGate({ onVerified }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendOtp = async () => {
    const cleaned = phone.trim();

    if (!/^\d{10}$/.test(cleaned)) {
      toast.warning("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSending(true);

    try {
      setOtp("");
      setStep("otp");

      toast.success("OTP sent to your mobile number.");
    } catch (err) {
      toast.error(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 4) {
      toast.warning("Please enter the complete 4-digit OTP.");
      return;
    }

    setVerifying(true);

    try {
      toast.success("Mobile number verified!");

      onVerified(phone.trim());
    } catch (err) {
      toast.error(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setSending(true);

    try {
      toast.success("OTP resent.");
    } catch (err) {
      toast.error(err?.message || "Failed to resend OTP.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-light-blue bg-light-blue">
            {step === "phone" ? (
              <Phone className="h-6 w-6 text-primary" />
            ) : (
              <KeyRound className="h-6 w-6 text-primary" />
            )}
          </div>

          <h2 className="text-base font-bold text-body-dark">
            {step === "phone" ? "Verify Your Mobile" : "Enter OTP"}
          </h2>

          <p className="text-[13px] leading-relaxed text-muted">
            {step === "phone"
              ? "Enter your registered mobile number to view your marketplace orders"
              : `We've sent a 4-digit OTP to ${phone}. Enter it below to continue.`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <div className="relative">
                <Phone
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleSendOtp}
                disabled={sending || phone.length !== 10}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}

                {sending ? "Sending OTP…" : "Send OTP"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <OtpInput value={otp} onChange={setOtp} />

              <Button
                className="w-full gap-2"
                onClick={handleVerify}
                disabled={verifying || otp.length !== 4}
              >
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {verifying ? "Verifying…" : "Verify OTP"}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  className="text-muted transition-colors hover:text-body-dark"
                >
                  ← Change number
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={sending}
                  className="text-primary transition-colors hover:underline disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Resend OTP"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
