import Navbar from "./Navbar";
import Button from "./Button";

const Head = () => {
  return (
    <div>
      <Navbar />
      <section className="h-[684px] w-full  flex justify-center">
        <div className="w-full h-[435px] my-[125px] mx-[100px]  flex  ">
          {/* left */}
          <div className="w-1/2">
            <div className="lg:max-w-[542px]">
              <h1 className="font-[700] font-bold text-[48px] ">
                Buy, Rent or Sell Your Property Easily
              </h1>

              <p className="mt-[16px] font-[400] font-[18px] max-w-[472px] text-[#403F3F] ">
                A great platform to buy, sell, or even rent your properties
                without any commissions.
              </p>

              <div className="w-[203px] mt-[44px]">
                <Button title="Browse Properties" />
              </div>

              <div className="flex max-w-[490px] gap-[40px] mt-[54px]">
                <div className="flex flex-col text-start ">
                  <h2 className="text-[32px] font-medium ">50k+</h2>
                  <h4 className="text-[20px] font-normal text-[#403F3F]">
                    Happy Renters
                  </h4>
                </div>

                <div className="flex flex-col text-start ">
                  <h2 className="text-[32px] font-medium ">100k+</h2>
                  <h4 className="text-[20px] font-normal text-[#403F3F]">
                    Active Users
                  </h4>
                </div>
                <div className="flex flex-col text-start ">
                  <h2 className="text-[32px] font-medium ">1k+</h2>
                  <h4 className="text-[20px] font-normal text-[#403F3F]">
                    Properties Listed
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* right */}
          <img
            src="/images/head.png"
            className="w-1/2 h-[434px] object-cover rounded-[22px]"
            alt=""
          />
        </div>
      </section>
    </div>
  );
};

export default Head;
