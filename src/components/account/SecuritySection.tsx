import { useState, type FormEvent } from "react";
import { Check, Circle } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/api";
import { apiErrorMessage } from "../../utils/apiError";
import PasswordInput from "./PasswordInput";
import SectionCard, { primaryButtonClass } from "./SectionCard";

const MIN_LENGTH = 6;

// Rough guide only; the server enforces the actual rules
const strengthOf = (password: string) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= MIN_LENGTH) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(1, score);
};

const STRENGTH = [
  { label: "", color: "" },
  { label: "Weak", color: "#F04438" },
  { label: "Fair", color: "#F79009" },
  { label: "Good", color: "#8B6B4E" },
  { label: "Strong", color: "#12B76A" },
];

const Requirement = ({ met, children }: { met: boolean; children: string }) => (
  <li className={`flex items-center gap-2 text-[13px] ${met ? "text-[#067647]" : "text-[#6B6F76]"}`}>
    {met ? <Check size={14} strokeWidth={2.5} /> : <Circle size={14} />}
    {children}
  </li>
);

const SecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const longEnough = newPassword.length >= MIN_LENGTH;
  const matches = newPassword.length > 0 && newPassword === confirmPassword;
  const different = newPassword.length > 0 && newPassword !== currentPassword;
  const canSubmit = Boolean(currentPassword) && longEnough && matches && different && !saving;
  const strength = strengthOf(newPassword);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    try {
      await api.put("/user/update-password", { currentPassword, newPassword, confirmPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Couldn't update your password. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SectionCard
        id="security"
        title="Password"
        description="Use a password you don't use anywhere else."
        footer={
          <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
            {saving ? "Updating…" : "Update password"}
          </button>
        }
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2 lg:max-w-[calc(50%-10px)]">
            <PasswordInput
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
          </div>

          <div>
            <PasswordInput
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              describedBy="password-strength password-rules"
            />
            {newPassword && (
              <div id="password-strength" className="mt-3" aria-live="polite">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className="h-1.5 flex-1 rounded-full bg-[#ECE8E3] transition-colors"
                      style={level <= strength ? { backgroundColor: STRENGTH[strength].color } : undefined}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-[13px] text-[#6B6F76]">
                  Strength: <span style={{ color: STRENGTH[strength].color }}>{STRENGTH[strength].label}</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <PasswordInput
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              invalid={confirmPassword.length > 0 && !matches}
            />
          </div>
        </div>

        <ul id="password-rules" className="mt-5 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <Requirement met={longEnough}>{`At least ${MIN_LENGTH} characters`}</Requirement>
          <Requirement met={matches}>Passwords match</Requirement>
          <Requirement met={different && Boolean(currentPassword)}>Different from current password</Requirement>
        </ul>
      </SectionCard>
    </form>
  );
};

export default SecuritySection;
