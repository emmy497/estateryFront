import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Properties", to: "/properties" },
      { label: "For Rent", to: "/properties?category=rent" },
      { label: "For Sale", to: "/properties?category=sale" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "List a property", to: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Sign up", to: "/signup" },
      { label: "Saved properties", to: "/saved-properties" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#FAFAFA] text-[#111418]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-20 pt-16 lg:pt-20 pb-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div>
            <NavLink to="/" aria-label="Estatery home">
              <Logo className="text-[26px]" />
            </NavLink>
            <p className="mt-5 text-[16px] leading-[1.6] text-[#6B6F76]">
              More Comfortable.
              <br />
              More Classy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-10 lg:gap-x-[72px]">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[16px] font-medium">{column.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <NavLink
                        to={link.to}
                        className="text-[15px] text-[#6B6F76] hover:text-[#111418] transition-colors"
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 lg:mt-24 pt-6 border-t border-[#E7E5E1] flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center text-[13px] text-[#6B6F76]">
          <p>&copy; {new Date().getFullYear()} Estatery. All rights reserved</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <NavLink to="/about" className="hover:text-[#111418]">About</NavLink>
            <NavLink to="/contact" className="hover:text-[#111418]">Contact</NavLink>
            <NavLink to="/properties" className="hover:text-[#111418]">Properties</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
