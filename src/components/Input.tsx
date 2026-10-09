interface inputProps {
  label : string;
  option1: string;
  option2: string;
}

const Input = ({label, option1, option2}: inputProps) => {
  return (
    <div className="flex flex-col text-start">
      <label className="mb-2 text-[18px] font-semibold " htmlFor="propertyType">
        {label}
      </label>
      <div className="bg-[#F6F6F6] min-w-[221px]  px-[8px] py-1 rounded-md ">
        <select
          id="propertyType"
          name="propertyType"
          className=" text-[#5C5C5C] focus:outline-none focus:ring-0 focus:border-transparent cursor-pointer pr-34"
        >
        
          <option value="sale">{option1}</option>
          <option value="rent">{option2}</option>
        </select>
      </div>
    </div>
  );
}

export default Input