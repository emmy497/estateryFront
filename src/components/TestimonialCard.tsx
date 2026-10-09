interface TestimonialCardProps {
    paragraph: string;
    image: string;
    name: string;
    category: string;
}

const TestimonialCard = ({paragraph, image, name, category}: TestimonialCardProps) => {
  return (
    <div className=" px-[20px] py-[10px] bg-[#EEEDED] rounded-[10px]">
      <p className="font-[500] text-[14px] text-[#403F3F]  border-b-[1px] border-[#D2D0D0] pb-[20px] mb-[20px]">
        {paragraph}
      </p>
      <div className="flex gap-[10px]">
        <img src={image} className="w-[48px] h-[48px]" alt="" />
        <div className="flex flex-col">
          <h2 className=" fonr-[600] text-[16px]">{name}</h2>
          <h4 className="text-[#656565]">{category}</h4>{" "}
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard