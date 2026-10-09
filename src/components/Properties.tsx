import { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";
import Spinner from "./Spinner";
import { type House } from "../types/House";
import api from "../api/api";

const Properties = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        setHouses(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(houses.length / pageSize),
    [houses.length],
  );

  const currentHouses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return houses.slice(startIndex, startIndex + pageSize);
  }, [currentPage, houses]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-[#F5F0EA] pt-[70px] lg:px-[100px]">
      <div className="flex flex-col lg:flex-row text-center gap-4 justify-between items-center mb-[41px]">
        <h3 className="text-[32px]">Featured Properties</h3>
        <div>
          <Button title="View All" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[50px] pb-[20px] px-[20px] lg:px-0 mx-auto">
            {currentHouses.map((house) => (
              <PropertyCard key={house._id} house={house} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Properties;
