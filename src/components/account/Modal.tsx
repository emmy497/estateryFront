import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  description?: ReactNode;
  onClose: () => void;
  // block closing while a request is in flight
  busy?: boolean;
  children: ReactNode;
}

// Accessible dialog: Escape and backdrop close it, focus moves inside on open
// and returns to whatever opened it on close.
const Modal = ({ title, description, onClose, busy = false, children }: ModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // latest values for the key handler, so the mount effect below runs only
  // once (re-running it would steal focus back to the first field)
  const latest = useRef({ onClose, busy });
  useEffect(() => {
    latest.current = { onClose, busy };
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstField = panelRef.current?.querySelector<HTMLElement>(
      "input, button:not([data-close]), textarea, select",
    );
    firstField?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !latest.current.busy) latest.current.onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-[9999] flex items-center justify-center bg-[#1C1915]/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-modal-in relative w-full max-w-[440px] rounded-2xl bg-white p-6 sm:p-7 shadow-[0_24px_60px_-20px_rgba(17,20,24,0.45)]"
      >
        <button
          type="button"
          data-close
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#6B6F76] hover:bg-[#F7F5F2] hover:text-[#111418] disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <h2 id={titleId} className="pr-8 text-[20px] font-medium tracking-[-0.01em] text-[#111418]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[14px] leading-[1.6] text-[#6B6F76]">{description}</p>
        )}

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
