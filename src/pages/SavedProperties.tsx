import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import { searchProperties } from "../api/Properties";
import { type House } from "../types/House";
import Footer from "../components/Footer";
import NoProperties from "../components/NoProperties";
import Spinner from "../components/Spinner";

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedProperties = async () => {
      const savedIds = JSON.parse(
        localStorage.getItem("savedProperties") || "[]",
      ) as string[];

      if (savedIds.length === 0) {
        setSavedProperties([]);
        setIsLoading(false);
        return;
      }

      try {
        // fetch just the saved listings instead of every property
        const { items } = await searchProperties({
          ids: savedIds.slice(0, 50),
          limit: 50,
        });
        setSavedProperties(items);
      } catch (error) {
        console.error("Failed to load saved properties:", error);
        setSavedProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProperties();
  }, []);

  const handleToggleSaved = (id: string, isSaved: boolean) => {
    if (!isSaved) {
      setSavedProperties((current) =>
        current.filter((house) => house._id !== id),
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-[200px] md:h-[280px] lg:h-[330px] bg-[#1C1915] w-full flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-[36px] md:text-[36px] lg:text-[48px] font-bold text-white py-[8px]">
          Your Saved Properties
        </h1>
        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#DCD9D9]">
          Quickly access properties you’ve shown interest in.
        </p>
      </div>

      <div className="px-4 md:px-10 lg:px-[100px] py-10">
        <div className="">
          {isLoading ? (
            <Spinner />
          ) : savedProperties.length === 0 ? (
            <NoProperties />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[50px]">
              {savedProperties.map((house) => (
                <PropertyCard
                  key={house._id}
                  house={house}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedProperties;
