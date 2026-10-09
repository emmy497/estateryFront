import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass, labelClass } from "./SectionCard";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  invalid = false,
  describedBy,
}: PasswordInputProps) => {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`${inputClass} pr-12 ${invalid ? "border-[#F04438] focus:border-[#F04438] focus:ring-[#F04438]/10" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#9A9DA3] hover:text-[#111418]"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
