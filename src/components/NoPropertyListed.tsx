import { NavLink } from "react-router-dom";

const NoPropertyListed = () => {
  return (
    <div>
      {/* holding all the images */}
      <div className="flex flex-col items-center justify-center m-[40px]">
        <img
          className="w-[259px] h-[127px] mb-8"
          src="/images/man-error.png"
          alt="no property listed"
        />
        <h3 className="items-center font-medium text-[20px] tracking-[0.85px] mb-[22px]">
          Nothing here, List property to get started
        </h3>
        <p className="font-regular text-[16px] text-[#666666]">
          You don’t have any properties listed or tour requests yet. Start by
          adding your first property to get started
        </p>

        <NavLink to="/add-property">
          <button className="flex justify-center gap-2 items-center bg-[#1C1915] text-white rounded-[8px] px-[16px] py-[10px] mt-[20px]">
            Add New Property
            <span>
              <img src="/images/HomeAdd.png" alt="home-add" />
            </span>
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default NoPropertyListed;
