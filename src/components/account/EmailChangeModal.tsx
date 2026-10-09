import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import { apiErrorMessage } from "../../utils/apiError";
import Modal from "./Modal";
import PasswordInput from "./PasswordInput";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "./SectionCard";

interface EmailChangeModalProps {
  currentEmail: string;
  onClose: () => void;
  onChanged: (user: { _id: string; fullName: string; email: string; role: "user" | "admin"; avatar?: string | null }) => void;
}

// Two steps: send a code to the new address, then confirm it. The email only
// changes once the code is confirmed (enforced by the API).
const EmailChangeModal = ({ currentEmail, onClose, onChanged }: EmailChangeModalProps) => {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const requestCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/user/email-change/request", { newEmail: newEmail.trim(), password });
      setStep("confirm");
      setOtp("");
      toast.success(`We sent a code to ${newEmail.trim()}`);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Couldn't send the code. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const confirmCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const response = await api.post("/user/email-change/confirm", { otp });
      onChanged(response.data.user);
      toast.success("Your email has been updated");
      onClose();
    } catch (error) {
      toast.error(apiErrorMessage(error, "That code didn't work. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  if (step === "confirm") {
    return (
      <Modal
        key="confirm"
        title="Check your inbox"
        description={
          <>
            Enter the 6-digit code we sent to <strong className="text-[#111418]">{newEmail.trim()}</strong>.
            It expires in 15 minutes.
          </>
        }
        onClose={onClose}
        busy={busy}
      >
        <form onSubmit={confirmCode}>
          <label htmlFor="email-change-otp" className={labelClass}>
            Verification code
          </label>
          <input
            id="email-change-otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className={`${inputClass} text-center font-mono text-[22px] tracking-[0.5em]`}
          />

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setStep("request")}
              disabled={busy}
              className="text-[14px] text-[#6B6F76] underline-offset-4 hover:text-[#111418] hover:underline"
            >
              Use a different email
            </button>
            <button type="submit" disabled={busy || otp.length !== 6} className={primaryButtonClass}>
              {busy ? "Confirming…" : "Confirm email"}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim());
  const sameEmail = newEmail.trim().toLowerCase() === currentEmail.toLowerCase();

  return (
    <Modal
      key="request"
      title="Change email address"
      description="We'll send a verification code to your new address. Your email won't change until you confirm it."
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={requestCode} className="space-y-4">
        <div>
          <label htmlFor="email-change-new" className={labelClass}>
            New email address
          </label>
          <input
            id="email-change-new"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
          {sameEmail && (
            <p className="mt-2 text-[13px] text-[#B42318]">This is already your email address.</p>
          )}
        </div>

        <PasswordInput
          label="Current password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="To confirm it's you"
        />

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={busy} className={secondaryButtonClass}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !emailValid || sameEmail || !password}
            className={primaryButtonClass}
          >
            {busy ? "Sending…" : "Send code"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmailChangeModal;
