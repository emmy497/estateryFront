import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";

const stats = [
  { value: "50k+", label: "Happy Renters" },
  { value: "100k+", label: "Active Users" },
  { value: "1k+", label: "Properties Listed" },
  { value: "10+", label: "Years Experience" },
];

const team = [
  { name: "Adaeze Okonkwo", role: "CEO & Co-founder", img: "/images/UserProfile.png" },
  { name: "Emeka Nwosu", role: "Head of Operations", img: "/images/UserProfile.png" },
  { name: "Fatima Aliyu", role: "Lead Agent", img: "/images/UserProfile.png" },
  { name: "Chukwudi Eze", role: "Tech Lead", img: "/images/UserProfile.png" },
];

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Trust & Transparency",
    desc: "We believe every transaction should be honest, clear, and straightforward — no hidden fees, no surprises.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "People First",
    desc: "From first-time renters to seasoned property owners, we put the needs of our community at the center of everything.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Speed & Simplicity",
    desc: "We've removed the friction from property search. Find, tour, and secure your ideal home faster than ever before.",
  },
];

const AboutUs = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="h-[200px] md:h-[280px] lg:h-[330px] bg-[#1C1915] w-full flex flex-col justify-center items-center px-4 text-center">
          <p className="text-[rgba(255,255,255,0.55)] font-semibold text-sm mb-3 uppercase tracking-widest">About Us</p>
          <h1 className="text-[36px] lg:text-[56px] font-bold text-white leading-tight">
            We Help You Find a Place to Call Home
          </h1>
      </section>

      {/* STATS */}
      <section className="px-4 md:px-10 lg:px-[100px] py-[60px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-[#E6E3E3] rounded-xl p-6 text-center shadow-sm">
              <p className="text-[28px] lg:text-[36px] font-bold text-[#8B6B4E]">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#F5F0EA] px-4 md:px-10 lg:px-[100px] py-[70px]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#8B6B4E] font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#1C1915] mb-5">
            Making Property Accessible for Everyone
          </h2>
          <p className="text-[#403F3F] text-[16px] leading-relaxed">
            We started Estatery because we believed the property market was
            overdue for a change. Too many people were paying high commissions,
            dealing with unreliable listings, and waiting too long to find their
            ideal space. Our mission is to use technology to eliminate those
            barriers and give everyone — regardless of budget — a fair shot at
            finding their perfect home or investment.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-4 md:px-10 lg:px-[100px] py-[70px]">
        <div className="text-center mb-12">
          <p className="text-[#8B6B4E] font-semibold text-sm uppercase tracking-widest mb-3">What We Stand For</p>
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#1C1915]">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white border border-[#E6E3E3] rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#F5F0EA] rounded-xl flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="font-semibold text-[#1C1915] text-[16px] mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-[#F5F0EA] px-4 md:px-10 lg:px-[100px] py-[70px]">
        <div className="text-center mb-12">
          <p className="text-[#8B6B4E] font-semibold text-sm uppercase tracking-widest mb-3">The People</p>
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#1C1915]">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl p-5 text-center shadow-sm border border-[#E6E3E3]">
              <img
                src={member.img}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              />
              <p className="font-semibold text-[#1C1915] text-sm">{member.name}</p>
              <p className="text-xs text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-10 lg:px-[100px] py-[70px] text-center">
        <h2 className="text-[28px] lg:text-[36px] font-bold text-[#1C1915] mb-4">
          Ready to Find Your Next Home?
        </h2>
        <p className="text-gray-500 text-[16px] mb-8 max-w-lg mx-auto">
          Browse thousands of listings across Nigeria and connect directly with property owners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink
            to="/properties"
            className="bg-[#1C1915] hover:bg-[#3A332C] text-white px-8 py-3 rounded-lg text-sm font-semibold transition"
          >
            Browse Properties
          </NavLink>
          <NavLink
            to="/contact"
            className="border border-[#8B6B4E] text-[#8B6B4E] hover:bg-[#F5F0EA] px-8 py-3 rounded-lg text-sm font-semibold transition"
          >
            Contact Us
          </NavLink>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
