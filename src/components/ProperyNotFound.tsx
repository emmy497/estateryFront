interface ProperyNotFoundProps {
  onClearFilters: () => void;
}

const ProperyNotFound = ({ onClearFilters }: ProperyNotFoundProps) => {
  return (
    <section>
      <div className="py-[120px] w-full flex justify-center">
        <div className="text-center max-w-sm">
          <img
            className="w-[220px] mx-auto"
            src="/images/Frame.png"
            alt="No match found"
          />

          <h6 className="font-semibold text-[18px] mt-6 text-gray-800">No match found</h6>

          <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
            <p>We couldn’t find any house that matches your search request.</p>
          </div>

          <button
            onClick={onClearFilters}
            className="rounded-[8px] px-6 py-2.5 bg-[#1C1915] text-white text-sm font-medium mt-6 hover:bg-[#3A332C] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProperyNotFound