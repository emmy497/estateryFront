interface LogoProps {
  className?: string;
}

// Wordmark with a house outline around the first letter. Uses currentColor,
// so it works in white over the hero and dark everywhere else.
const Logo = ({ className = "" }: LogoProps) => {
  return (
    <span
      className={`inline-flex items-end pt-[0.3em] font-medium tracking-[-0.02em] leading-none select-none ${className}`}
      aria-label="Estatery"
    >
      <span className="relative inline-block px-[0.16em] mr-[0.05em]">
        {/* offsets in em track the font: roof just above cap height, floor on the baseline */}
        <svg
          className="absolute inset-x-0 top-[-0.3em] h-[1.2em] w-full overflow-visible"
          viewBox="0 0 20 26"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M19 16V9.4L10 1 1 9.4V25h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        E
      </span>
      statery
    </span>
  );
};

export default Logo;
