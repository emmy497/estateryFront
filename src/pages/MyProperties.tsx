import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import MyPropertiesTable from "../components/MyPropertiesTable";
import NoPropertyListed from "../components/NoPropertyListed";
import { NavLink } from "react-router-dom";
import { getProperties } from "../api/Properties";
import Spinner from "../components/Spinner";

const MyProperties = () => {
  const [filters, setFilters] = useState({
    search: "",
    propertyType: "all",
    status: "all",
  });
  const [hasAnyProperties, setHasAnyProperties] = useState<boolean | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfAnyPropertiesExist = async () => {
      try {
        // Fetch all properties without any filters to check if database is empty
        const response = await getProperties({});
        setHasAnyProperties(response && response.length > 0);
      } catch (error) {
        console.error("Error checking properties:", error);
        setHasAnyProperties(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfAnyPropertiesExist();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Spinner />
      </DashboardLayout>
    );
  }

  if (hasAnyProperties === false) {
    return (
      <DashboardLayout>
        <div className="mx-3 mt-20">
          <NoPropertyListed />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-3 mt-4 space-y-4">
        {/* FILTER BAR */}
        <div className="border bg-white border-[#E6E3E3] rounded-md p-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* LEFT FILTERS */}
          <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-end lg:flex-wrap">
            {/* SEARCH */}
            <div className="flex flex-col gap-2 w-full sm:w-[250px] lg:w-[280px]">
              <label className="mb-2 text-sm font-semibold">Search</label>

              <div className="relative w-full border border-[#E6E3E3] rounded-md px-3 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full border-none focus:outline-none pl-7 text-sm"
                />

                <img
                  src="/images/proicons_search.png"
                  alt="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />
              </div>
            </div>

            {/* PROPERTY TYPE */}
            <div className="flex flex-col w-full sm:w-[180px] ">
              <label className="mb-2 text-sm font-semibold">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    propertyType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md focus:outline-none text-sm"
              >
                <option value="all">All</option>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            {/* STATUS */}
            <div className="flex flex-col w-full sm:w-[180px]">
              <label className="mb-2 text-sm font-semibold">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md focus:outline-none text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="w-full lg:w-auto">
            <NavLink to="/add-property">
              <button className="bg-[#1C1915] w-full lg:w-auto lg:min-w-[200px] h-[48px] cursor-pointer rounded-[8px] px-4 text-white text-sm flex items-center justify-center gap-2">
                <img src="/images/Add-Home.png" alt="" className="w-5 h-5" />
                <span>Add New Property</span>
              </button>
            </NavLink>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <MyPropertiesTable filters={filters} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;
