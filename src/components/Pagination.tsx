interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-[8px] pb-[74px] pt-[40px] px-[20px] lg:px-0">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center border cursor-pointer ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-[#8B6B4E] text-[#8B6B4E] hover:bg-[#1C1915] hover:text-white"
        }`}
      >
        {"<"}
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center border cursor-pointer ${
            page === currentPage
              ? "bg-[#1C1915] text-white"
              : "border-[#8B6B4E] text-[#8B6B4E] hover:bg-[#1C1915] hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center border cursor-pointer ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-[#8B6B4E] text-[#8B6B4E] hover:bg-[#1C1915] hover:text-white"
        }`}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
