import AboutCard from "./AboutCard";
import Button from "./Button";
import TestimonialCard from "./TestimonialCard";

const Ab = () => {
  return (
    <div className=" bg-[#F7F5F2] px-[100px] pb-[220px]">
      <div className="pt-[56px] mb-[80px] flex">
        <img
          src="/images/about-image.png"
          className="mr-[73px] w-[458px] h-[302px]"
          alt=""
        />
        <div className="py-[18px]">
          <h3 className="text-[#A9744A] text-[18px]">About Us</h3>
          <h4 className="text-[32px] text-[#202020] font-[500] mb-[12px]">
            Where Property Meets Simplicity
          </h4>
          <p className="text-[18px] font-[400] mb-[44px]">
            We are a modern real estate platform built to simplify the way
            people buy, rent, and sell properties. Our goal is to remove the
            stress, confusion, and unnecessary costs often associated with
            property transactions by creating a seamless and transparent
            experience for everyone.
          </p>
          <div className="w-[143px] h-[37px]">
            <Button title="Learn More" />
          </div>
        </div>
      </div>

      <div className=" pb-[80px] ">
        <h3 className="text-[#A9744A] text-[18px] font-[500] text-center">
          Why Choose Us
        </h3>
        <h4 className="text-center">Why Choose Estatery</h4>
        <div className="flex gap-[27px] mt-[40px]">
          <AboutCard
            title="Fast & Easy Process"
            icon="/images/bolt.png"
            paragraph="From searching to listing, everything is designed to be simple, quick, and hassle-free."
          />
          <AboutCard
            title="Direct Communication"
            icon="/images/hands.png"
            paragraph="Connect instantly with landlords, buyers, or sellers without delays or middlemen."
          />
          <AboutCard
            title="Verified Listings "
            icon="/images/safe.png"
            paragraph="Every property goes through a verification process to ensure you’re browsing genuine"
          />
        </div>
      </div>

      <div className="">
        <h2 className="text-[#A9744A] text-center text-[18px] font-[500]mb-[6px]">
          Testimonials
        </h2>
        <p className="text-center text-[32px] font-[500] mb-[40px]">
          What Our Satisfied Clients Says
        </p>

        <div className="flex gap-[37px] mb-[112px]">
          <TestimonialCard
            image="/images/juice.png"
            paragraph={`"Finding a place used to be stressful, but this platform made it so easy. I was able to browse, connect, and move in within days"`}
            category="Renter"
            name="Shina Martins"
          />
          <TestimonialCard
            image="/images/juice.png"
            paragraph={`"Finding a place used to be stressful, but this platform made it so easy. I was able to browse, connect, and move in within days"`}
            category="Renter"
            name="Shina Martins"
          />
          <TestimonialCard
            image="/images/juice.png"
            paragraph={`"Finding a place used to be stressful, but this platform made it so easy. I was able to browse, connect, and move in within days"`}
            category="Renter"
            name="Shina Martins"
          />
        </div>

        <div className="relative mx-auto bg-[url('/images/testimonial-image.jpg')] bg-cover w-300.25 h-[581px] flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="w-[573px] h-85.5 bg-white/30 backdrop-blur-md p-20 text-white text-center">
            <h3 className="text-[32px] mb-4">No Spam Promise</h3>
            <p className="text-[18px]">
              Are you a landlord? Discover ways to increase your home's value
              and get listed.
            </p>

            <div className="flex gap-[22px] mt-[31px]">
              <input
                className="w-[313px] border rounded-lg border-white"
                type="text"
              />
              <div className="w-[109px]">
                <Button title="Submit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ab;
