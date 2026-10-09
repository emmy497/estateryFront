import type { ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  // actions shown in the bar along the bottom of the card
  footer?: ReactNode;
  tone?: "default" | "danger";
}

const SectionCard = ({
  id,
  title,
  description,
  children,
  footer,
  tone = "default",
}: SectionCardProps) => {
  const danger = tone === "danger";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-6 overflow-hidden rounded-2xl border bg-white ${
        danger ? "border-[#F5C2BD]" : "border-[#ECE8E3]"
      }`}
    >
      <div className="px-5 py-6 sm:px-8 sm:py-7">
        <h2
          id={`${id}-title`}
          className={`text-[18px] font-medium tracking-[-0.01em] ${danger ? "text-[#B42318]" : "text-[#111418]"}`}
        >
          {title}
        </h2>
        <p className="mt-1 text-[14px] leading-[1.6] text-[#6B6F76]">{description}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && (
        <div
          className={`flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8 ${
            danger ? "border-[#F5C2BD] bg-[#FEF3F2]" : "border-[#ECE8E3] bg-[#FAFAF9]"
          }`}
        >
          {footer}
        </div>
      )}
    </section>
  );
};

export default SectionCard;

// Shared field styles for the account forms
export const inputClass =
  "w-full h-12 rounded-xl border border-[#E2DDD6] bg-white px-4 text-[15px] text-[#111418] placeholder:text-[#9A9DA3] transition focus:outline-none focus:border-[#8B6B4E] focus:ring-4 focus:ring-[#8B6B4E]/10 disabled:bg-[#F7F5F2] disabled:text-[#6B6F76]";

export const labelClass = "mb-2 block text-[14px] font-medium text-[#111418]";

export const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1C1915] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#3A332C] disabled:cursor-not-allowed disabled:opacity-40";

export const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E2DDD6] bg-white px-5 text-[15px] text-[#111418] transition-colors hover:border-[#C9C1B7] disabled:cursor-not-allowed disabled:opacity-50";
