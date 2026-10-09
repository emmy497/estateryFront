import { NavLink } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { type House } from "../../types/House";

interface DreamGalleryProps {
  houses: House[];
}

// Interior shots used until enough listings exist to fill every slot
const fallbacks = [
  { src: "/images/home/lounge-chair.webp", alt: "Woven lounge chair beneath an abstract painting" },
  { src: "/images/home/sofa.webp", alt: "Lounge with a cognac leather sofa by a tall window" },
  { src: "/images/home/staircase.webp", alt: "Living area beneath a floating staircase" },
];

const Slot = ({
  house,
  fallback,
  className,
}: {
  house?: House;
  fallback: (typeof fallbacks)[number];
  className: string;
}) => {
  if (!house) {
    return (
      <div className={`overflow-hidden rounded-[10px] bg-[#F1EEEA] ${className}`}>
        <img src={fallback.src} alt={fallback.alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <NavLink
      to={`/property/${house._id}`}
      className={`photo-tint group block overflow-hidden rounded-[10px] bg-[#F1EEEA] ${className}`}
    >
      <img
        src={house.images[0]}
        alt={house.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-4 bg-[linear-gradient(180deg,rgba(28,25,21,0)_0%,rgba(28,25,21,0.72)_100%)] p-5 pt-16 text-white">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-medium">{house.title}</p>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-white/80">
            <MapPin size={14} className="shrink-0" />
            {house.location}, {house.state}
          </p>
        </div>
        <p className="shrink-0 text-[15px] font-medium">
          ₦{house.price.toLocaleString()}
        </p>
      </div>
    </NavLink>
  );
};

const DreamGallery = ({ houses }: DreamGalleryProps) => {
  const [first, second, third] = houses;

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-20 pt-20 lg:pt-[150px]">
      <div className="grid gap-6 lg:grid-cols-[600fr_680fr] lg:gap-0">
        <div className="lg:pr-[50px]">
          <h2 className="max-w-[400px] text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.18] font-[450] tracking-[-0.025em]">
            Find Your Dream Home Here
          </h2>
          <p className="mt-6 max-w-[550px] text-[16px] leading-[1.65] text-[#6B6F76]">
            See for yourself how Estatery homes offer beautiful, comfortable
            living for you and your family. Browse photos of the houses, the
            neighbourhoods and the facilities around them.
          </p>
          <NavLink
            to="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1C1915] px-6 py-3 text-[15px] text-white transition-colors hover:bg-[#3A332C]"
          >
            Browse properties
            <ArrowRight size={16} />
          </NavLink>

          <Slot house={first} fallback={fallbacks[0]} className="mt-10 lg:mt-[90px] aspect-[550/640]" />
        </div>

        <div className="flex flex-col gap-6 lg:gap-[68px]">
          <Slot house={second} fallback={fallbacks[1]} className="aspect-[680/733]" />
          <Slot house={third} fallback={fallbacks[2]} className="aspect-[460/308] lg:w-[68%]" />
        </div>
      </div>
    </section>
  );
};

export default DreamGallery;
