import Navbar from "../Navbar";

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#5484AA] h-[620px] sm:h-[760px] lg:h-[clamp(760px,78vw,1125px)]">
      <picture>
        <source media="(min-width: 768px)" srcSet="/images/home/hero-2400.webp" />
        <img
          src="/images/home/hero-1200.webp"
          alt="Modern two-storey house with timber cladding at dusk"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_0%]"
          fetchPriority="high"
        />
      </picture>

      {/* deepen the sky behind the headline, then dissolve the ground into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(80,128,168,0.92)_0%,rgba(84,132,170,0.55)_24%,rgba(84,132,170,0)_52%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[34%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_55%,#ffffff_100%)]"
      />

      <Navbar variant="overlay" />

      <div className="px-4 pt-[132px] sm:pt-[150px] lg:pt-[168px] text-center text-white">
        <h1 className="mx-auto max-w-[760px] text-[36px] sm:text-[60px] lg:text-[76px] leading-[1.06] font-medium tracking-[-0.035em]">
          More Comfortable.
          <br />
          More Classy.
        </h1>
        <p className="mt-5 lg:mt-7 text-[15px] lg:text-[17px] text-white/95">
          Make your living experience even more memorable.
        </p>
      </div>
    </section>
  );
};

export default Hero;
