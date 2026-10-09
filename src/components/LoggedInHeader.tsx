interface SearchValues {
  propertyType: "all" | "rent" | "sale";
  budget: string;
  location: string;
}

interface LoggedInHeaderProps {
  searchValues: SearchValues;
  onSearchChange: (field: keyof SearchValues, value: string) => void;
  onSearch: () => void;
}

const LoggedInHeader = ({
  searchValues,
  onSearchChange,
  onSearch,
}: LoggedInHeaderProps) => {
  return (
    <div className="bg-[url('/images/home/hero-2400.webp')] bg-cover bg-position-[50%_45%] relative text-white text-center px-4 py-16 md:py-24 ">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(80,128,168,0.92)_0%,rgba(84,132,170,0.6)_100%)]"></div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl mb-4 font-medium tracking-[-0.03em]">
          Find the Right Property for You
        </h1>
        <p className="text-sm md:text-lg mb-10 text-white/90 font-normal">
          Browse verified properties, save your favorites, and connect directly
          with sellers—simple, fast, and stress-free.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="
          bg-white 
          w-full 
          max-w-[1030px] 
          mx-auto 
          rounded-[18px] 
          text-black 
          flex flex-col lg:flex-row 
          gap-6 
          p-6 md:p-8 
          items-stretch lg:items-end
        "
        >
          {/* Property Type */}
          <div className="flex flex-col text-start w-full">
            <label className="mb-2 text-sm md:text-base font-semibold">
              Property Type
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md bg-[#F6F6F6] focus:outline-none"
              value={searchValues.propertyType}
              onChange={(e) => onSearchChange("propertyType", e.target.value)}
            >
              <option value="all">All</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* Budget */}
          <div className="flex flex-col text-start w-full">
            <label className="mb-2 text-sm md:text-base font-semibold">
              Budget
            </label>
            <input
              className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md bg-[#F6F6F6] focus:outline-none"
              type="text"
              placeholder="Enter max budget"
              value={searchValues.budget}
              onChange={(e) => onSearchChange("budget", e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="flex flex-col text-start w-full">
            <label className="mb-2 text-sm md:text-base font-semibold">
              Location
            </label>
            <input
              className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md bg-[#F6F6F6] focus:outline-none"
              type="text"
              placeholder="Enter location"
              value={searchValues.location}
              onChange={(e) => onSearchChange("location", e.target.value)}
            />
          </div>

          {/* Button */}
          <div className="w-full  flex items-end">
            <button
              type="submit"
              className="bg-[#1C1915] w-full h-[52px] cursor-pointer rounded-[8px] py-[12px] px-[19px] text-[#FFFFFF] text-[16px] md:text-[18px]"
            >
              Search Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoggedInHeader;