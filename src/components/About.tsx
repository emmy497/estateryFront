import { useState } from "react";
import AboutCard from "./AboutCard";
import Button from "./Button";
import TestimonialCard from "./TestimonialCard";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const About = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) { toast.error("Please enter your email address."); return; }
    try {
      setLoading(true);
      await api.post("/newsletter/subscribe", { email });
      toast.success("You're subscribed! Check your inbox.");
      setEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F5F2] px-4 sm:px-8 lg:px-[100px] pb-[100px] lg:pb-[220px] ">
      {/* ABOUT SECTION */}
      <div className="pt-[56px] mb-[80px] flex flex-col lg:flex-row items-center lg:items-start gap-10">
        <img
          src="/images/about-image.png"
          className="w-full max-w-[458px] h-auto"
          alt=""
        />

        <div className="py-[18px] text-center lg:text-left">
          <h3 className="text-[#A9744A] text-[16px] sm:text-[18px]">
            About Us
          </h3>

          <h4 className="text-[24px] sm:text-[28px] lg:text-[32px] text-[#202020] font-[500] mb-[12px]">
            Where Property Meets Simplicity
          </h4>

          <p className="text-[16px] sm:text-[18px] mb-[30px] lg:mb-[44px]">
            We are a modern real estate platform built to simplify the way
            people buy, rent, and sell properties. Our goal is to remove the
            stress, confusion, and unnecessary costs often associated with
            property transactions by creating a seamless and transparent
            experience for everyone.
          </p>

          <div className="w-[143px] mx-auto lg:mx-0">
            <NavLink to="/about">
              <Button title="Learn More" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="pb-[60px] lg:pb-[80px]">
        <h3 className="text-[#A9744A] text-[18px] font-[500] text-center">
          Why Choose Us
        </h3>

        <h4 className="text-center text-[24px] lg:text-[32px]">
          Why Choose Estatery
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[40px]">
          <AboutCard
            title="Fast & Easy Process"
            icon="/images/bolt.svg"
            paragraph="From searching to listing, everything is designed to be simple, quick, and hassle-free."
          />
          <AboutCard
            title="Direct Communication"
            icon="/images/hands.svg"
            paragraph="Connect instantly with landlords, buyers, or sellers without delays or middlemen."
          />
          <AboutCard
            title="Verified Listings"
            icon="/images/safe.png"
            paragraph="Every property goes through a verification process to ensure you’re browsing genuine"
          />
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div>
        <h2 className="text-[#A9744A] text-center text-[18px] font-[500] mb-[6px]">
          Testimonials
        </h2>

        <p className="text-center text-[24px] lg:text-[32px] font-[500] mb-[40px]">
          What Our Satisfied Clients Says
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-[80px] lg:mb-[112px]">
          <TestimonialCard
            image="/images/juice.png"
            paragraph={`"Finding a place used to be stressful, but this platform made it so easy. I was able to browse, connect, and move in within days"`}
            category="Renter"
            name="Shina Martins"
          />
          <TestimonialCard
            image="/images/olakitan.svg"
            paragraph={`"Finding a place used to be stressful, but this platform made it so easy. I was able to browse, connect, and move in within days"`}
            category="Buyer"
            name="Olakintan Samson"
          />
          <TestimonialCard
            image="/images/kunle.svg"
            paragraph={`"Finding a place used to be stressful, but this platform made it so easy. I was able to browse, connect, and move in within days"`}
            category="Renter"
            name="Kunle bodiyan"
          />
        </div>

        {/* CTA SECTION */}
        <div className="relative mx-auto bg-[url('/images/testimonial-image.jpg')] bg-cover bg-center w-full h-[400px] sm:h-[500px] lg:h-[581px] flex justify-center items-center rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 w-[90%] sm:w-[70%] lg:w-[573px] bg-white/30 backdrop-blur-md p-6 sm:p-10 lg:p-20 text-white text-center rounded-xl">
            <h3 className="text-[22px] sm:text-[28px] lg:text-[32px] mb-4">
              No Spam Promise
            </h3>

            <p className="text-[14px] sm:text-[16px] lg:text-[18px]">
              Are you a landlord? Discover ways to increase your home's value
              and get listed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-[20px] sm:mt-[31px]">
              <input
                className="w-full sm:w-[313px] border rounded-lg border-white px-3 py-2 bg-transparent placeholder:text-white outline-none"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />

              <div className="w-full sm:w-[109px]" onClick={handleSubscribe}>
                <Button title={loading ? "..." : "Submit"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About