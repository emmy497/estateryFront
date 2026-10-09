import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const contactInfo = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.82 5.82l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+1 891 989-11-91",
    href: "tel:+18919891191",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "info@estatery.com",
    href: "mailto:info@estatery.com",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Office",
    value: "14 Wuse Zone 5, Abuja, Nigeria",
    href: "#",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    label: "Working Hours",
    value: "Mon – Fri, 9am – 6pm",
    href: "#",
  },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="h-[200px] md:h-[280px] lg:h-[330px] bg-[#1C1915] w-full flex flex-col justify-center items-center px-4 text-center">
        <p className="text-[rgba(255,255,255,0.55)] font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
        <h1 className="text-[36px] lg:text-[56px] font-bold text-white leading-tight">
          We'd Love to Hear From You
        </h1>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="px-4 md:px-10 lg:px-[100px] py-[70px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — info cards */}
          <div className="space-y-5">
            <h2 className="text-[22px] font-bold text-[#1C1915] mb-6 text-center lg:text-left">Contact Information</h2>
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 bg-white border border-[#E6E3E3] rounded-xl p-5 shadow-sm hover:border-[#8B6B4E] transition group"
              >
                <div className="w-11 h-11 bg-[#F5F0EA] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#F5F0EA] transition">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-[#1C1915] font-medium text-sm">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* RIGHT — form */}
          <div className="bg-white border border-[#E6E3E3] rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-[22px] font-bold text-[#1C1915] mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B6B4E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B6B4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B6B4E] bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="property-inquiry">Property Inquiry</option>
                  <option value="list-property">List a Property</option>
                  <option value="tour-request">Tour Request</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B6B4E] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#1C1915] hover:bg-[#3A332C] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MAP PLACEHOLDER */}
      <section className="px-4 md:px-10 lg:px-[100px] pb-[70px]">
        <div className="w-full h-[280px] bg-[#F5F0EA] rounded-2xl flex items-center justify-center border border-[#E6E3E3]">
          <div className="text-center">
            <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8B6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-gray-500 text-sm">14 Wuse Zone 5, Abuja, Nigeria</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
