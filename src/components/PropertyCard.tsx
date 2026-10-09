import { NavLink, useNavigate } from "react-router-dom";
import { type House } from "../types/House";
import Button from "./Button";
import { useContext, useEffect, useState } from "react";
import { BathIcon, Bed, MapPin } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";

interface PropertyCardProps {
  house: House;
  onToggleSaved?: (id: string, isSaved: boolean) => void;
}

const PropertyCard = ({ house, onToggleSaved }: PropertyCardProps) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Load saved properties
  useEffect(() => {
    const savedIds = JSON.parse(
      localStorage.getItem("savedProperties") || "[]",
    ) as string[];

    setIsSaved(savedIds.includes(house._id));
  }, [house._id]);

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.info("Please log in to save properties");
      navigate("/login");
      return;
    }

    const savedIds = JSON.parse(
      localStorage.getItem("savedProperties") || "[]",
    ) as string[];

    let nextSavedIds: string[];

    if (savedIds.includes(house._id)) {
      nextSavedIds = savedIds.filter((id) => id !== house._id);
    } else {
      nextSavedIds = [...savedIds, house._id];
    }

    const nextSavedState = !savedIds.includes(house._id);

    localStorage.setItem("savedProperties", JSON.stringify(nextSavedIds));
    setIsSaved(nextSavedState);

    if (onToggleSaved) {
      onToggleSaved(house._id, nextSavedState);
    }
  };

  return (
    <NavLink to={`/property/${house._id}`}>
      <div
        className="
          w-full
          cursor-pointer
          h-auto
          rounded-[12px]
          border border-[#ECE8E3]
          bg-white
          shadow-[0_1px_2px_rgba(17,20,24,0.04)]
          hover:shadow-[0_18px_40px_-16px_rgba(28,25,21,0.28)]
          transition-shadow
          group
        "
      >
        {/* Image (photo-tint adds the warm brown overlay) */}
        <div className="photo-tint w-full h-[200px] sm:h-[231px] overflow-hidden rounded-t-[12px]">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={house.images[0]}
            alt={house.title}
          />

          <div
            className="z-[2] rounded-full bg-white/90 backdrop-blur-sm px-3 h-[30px] absolute top-[16px] left-[16px] flex justify-center items-center text-[13px] font-medium text-[#1C1915] capitalize"
          >
            For {house.category}
          </div>

          <button
            type="button"
            onClick={toggleFavorite}
            className="z-[2] absolute top-[12px] right-[14px] rounded-full p-2 bg-white/90 backdrop-blur-sm shadow-sm transition cursor-pointer"
          >
            <img
              className="w-[24px] h-[24px]"
              src={isSaved ? "/images/FavoriteHeart.png" : "/images/love.png"}
              alt={isSaved ? "Remove from saved" : "Save property"}
            />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            bg-white
            h-auto
            lg:h-[225px]
            rounded-b-[12px]
            p-[20px]
          "
        >
          <h2 className="text-[18px] text-[#111418] font-medium tracking-[-0.01em] mb-[10px] truncate">
            {house.title}
          </h2>

          <p className="text-sm text-[#6B6F76] flex items-center gap-[8px]">
            <MapPin size={20} />
            {house.location}, {house.state}
          </p>

          <div className="flex gap-4 mt-[19px] text-sm mb-[20px]">
            <div className="flex items-center gap-[4px]">
              <Bed size={20} />
              <div>{house.beds} Beds</div>
            </div>

            <div className="flex items-center gap-[4px]">
              <BathIcon size={20} />
              <span>{house.baths} Baths</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <Button title="Details" />
            </div>

            <h3 className="text-sm sm:text-base md:text-md lg:text-lg font-medium text-[#111418]">
              ₦{house.price.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default PropertyCard;
