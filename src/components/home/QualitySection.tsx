const stats = [
  { value: "+1K", label: "Properties Listed" },
  { value: "+50K", label: "Happy Renters" },
  { value: "+100K", label: "Active Users" },
];

const strip = [
  { src: "/images/home/living-room.webp", alt: "Living room with oak wall panels and a white sofa", width: "w-[440px] lg:w-[560px]" },
  { src: "/images/home/bathroom.webp", alt: "Bright bathroom with a freestanding tub and garden view", width: "w-[470px] lg:w-[600px]" },
  { src: "/images/home/sofa.webp", alt: "Lounge with a cognac leather sofa by a tall window", width: "w-[400px] lg:w-[520px]" },
  { src: "/images/home/staircase.webp", alt: "Living area beneath a floating staircase", width: "w-[375px] lg:w-[480px]" },
];

const features = [
  {
    title: "Strategic Locations",
    body: "Every listing is in a neighbourhood that is easy to reach from all directions, close to city centres, airports, schools, shopping and the places you visit most.",
  },
  {
    title: "Modern Design",
    body: "Browse homes with modern, elegant interiors. Filter by type, budget and location to find the size and style that suits your taste and your family's needs.",
  },
  {
    title: "Verified & Secure",
    body: "Each property is reviewed by our team before it goes live, and tours are confirmed by email, so you only deal with genuine listings and real owners.",
  },
];

const QualitySection = () => {
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-20 pt-16 lg:pt-[150px]">
        <div className="grid gap-8 lg:grid-cols-[600fr_680fr] lg:gap-0">
          <h2 className="max-w-[460px] text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.18] font-[450] tracking-[-0.025em]">
            Enjoy Quality Life with Estatery Homes
          </h2>

          <div>
            <p className="text-[16px] leading-[1.65] text-[#6B6F76]">
              Estatery is the right choice for anyone looking for a comfortable,
              safe and affordable home. Rent or buy in well-kept
              neighbourhoods, enjoy the privacy and comfort of a beautiful,
              clean environment, and stay close to playgrounds, sports fields,
              shopping centres, schools and more.
            </p>

            <dl className="mt-12 lg:mt-[90px] grid grid-cols-3 gap-4 lg:gap-0">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-3 lg:mt-4 text-[14px] lg:text-[16px] text-[#6B6F76]">
                    {stat.label}
                  </dt>
                  <dd className="text-[28px] lg:text-[36px] leading-none font-[450] tracking-[-0.02em]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* image strip runs off the right edge, like a peek at more rooms */}
      <div
        className="mt-16 lg:mt-[130px] flex gap-6 lg:gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 lg:scroll-px-20 px-4 sm:px-6 lg:px-20"
        tabIndex={0}
        aria-label="Interior photos"
      >
        {strip.map((image) => (
          <div
            key={image.src}
            className={`${image.width} h-[250px] lg:h-[320px] max-w-[85vw] shrink-0 snap-start overflow-hidden rounded-[10px] bg-[#F1EEEA]`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-20 pt-16 lg:pt-[150px]">
        <div className="grid lg:grid-cols-[600fr_680fr]">
          <div className="lg:col-start-2 flex flex-col gap-10 lg:gap-14">
            {features.map((feature) => (
              <div key={feature.title}>
                <h3 className="text-[22px] lg:text-[24px] font-[450] tracking-[-0.015em]">
                  {feature.title}
                </h3>
                <p className="mt-3 lg:mt-5 text-[16px] leading-[1.65] text-[#6B6F76]">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default QualitySection;
