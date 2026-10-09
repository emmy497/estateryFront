import { useQuery } from "@tanstack/react-query";
import { searchProperties } from "../api/Properties";
import { type House } from "../types/House";
import PropertyCard from "./PropertyCard";

interface SimilarPropertiesProps {
  currentHouse: House;
}

// candidates are the newest listings in the same category, ranked below
const CANDIDATES = 24;

const SimilarProperties = ({ currentHouse }: SimilarPropertiesProps) => {
  const category = currentHouse.category === "sale" ? "sale" : "rent";

  const { data } = useQuery({
    queryKey: ["properties", "search", { category, limit: CANDIDATES }],
    queryFn: () => searchProperties({ category, limit: CANDIDATES }),
  });
  const houses = data?.items ?? [];

  const similarProperties = houses
    .filter((house) => house._id !== currentHouse._id)
    .map((house) => {
      let score = 0;

      if (house.category === currentHouse.category) score += 4;
      if (house.location === currentHouse.location) score += 3;
      if (house.beds === currentHouse.beds) score += 2;
      if (house.baths === currentHouse.baths) score += 2;
      if (house.state === currentHouse.state) score += 1;

      return { house, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        Math.abs(a.house.price - currentHouse.price) -
        Math.abs(b.house.price - currentHouse.price)
      );
    })
    .slice(0, 3)
    .map((item) => item.house);

  if (similarProperties.length === 0) return null;

  return (
    <section className="pb-[74px]">
      <h2 className="text-[24px] sm:text-[28px] font-semibold mb-[24px] text-[#202020]">
        Similar Properties
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[32px]">
        {similarProperties.map((house) => (
          <PropertyCard key={house._id} house={house} />
        ))}
      </div>
    </section>
  );
};

export default SimilarProperties;
