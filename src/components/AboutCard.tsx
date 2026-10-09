interface AboutCardProps  {
  icon: string;
  title: string;
  paragraph: string;
}

const AboutCard = ({icon, title, paragraph}: AboutCardProps) => {
  return (
    <div className="flex flex-col items-center py-[26px] px-[23px] border border-[#E6E2E2] rounded-[20px] bg-white text-center">
      <img src={icon} className="mb=-[32px] w-[55px] h-[55px]" alt="" />
      <h1 className="font-[600] text-[20px] mt-[34px] mb-[16px]">{title}</h1>
      <p className="">{paragraph}</p>
    </div>
  );
}

export default AboutCard