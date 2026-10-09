import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import TourRequestsTable from "../components/TourRequestsTable";

const TourRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tourType, setTourType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <DashboardLayout>
      <div className="mx-3 mt-4 space-y-4">
        <div className=" bg-white  rounded-md p-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-[40px]">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">Search</h3>
            <div className="relative mt-2 w-ful border border-[#E6E3E3] rounded-md px-3 py-2 bg-white">
              <img
                src="/images/proicons_search.png"
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search user or properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none focus:outline-none pl-10 pr-3 text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end w-full lg:w-auto">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tourType"
                className="text-sm font-medium text-gray-900"
              >
                Tour Type
              </label>
              <select
                id="tourType"
                value={tourType}
                onChange={(e) => setTourType(e.target.value)}
                className="w-full border border-[#E6E3E3] rounded-md bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B6B4E]"
              >
                <option value="all">All</option>
                <option value="in-person">In-person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="statusFilter"
                className="text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-[#E6E3E3] rounded-md bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B6B4E]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="sortBy"
                className="text-sm font-medium text-gray-900"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-[#E6E3E3] rounded-md bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B6B4E]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TourRequestsTable
            searchQuery={searchQuery}
            tourType={tourType}
            statusFilter={statusFilter}
            sortBy={sortBy}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TourRequests;
