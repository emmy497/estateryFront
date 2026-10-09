

interface buttonProps {
  title: string

}

const Button = ({ title} : buttonProps) => {
  return (
    <button className="bg-[#1C1915] hover:bg-[#3A332C] transition-colors w-full h-[52px] cursor-pointer rounded-full py-[12px] px-[22px] text-[#FFFFFF] text-[16px] font-medium">
      {title}
    </button>
  );
}

export default Button
