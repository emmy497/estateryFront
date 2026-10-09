import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    question: "What is Estatery?",
    answer:
      "Estatery is a real estate platform where you can browse verified homes for rent and sale, save the ones you love, book tours and list your own property, all in one place.",
  },
  {
    question: "How do I book a tour of a property?",
    answer:
      "Open any listing and choose Request a Tour. Pick an in-person or virtual visit with a date and time that suits you, and we'll email you as soon as the tour is confirmed or rescheduled.",
  },
  {
    question: "How much does it cost to use Estatery?",
    answer:
      "Browsing, saving properties and booking tours are completely free. We don't charge renters or buyers any commission. You only pay the rent or price agreed for the home itself.",
  },
  {
    question: "How can I list my property on Estatery?",
    answer:
      "Create an account, open the menu and select List Property. Send us your details and location, our team will review your request, and you'll get an email once it's accepted.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-20 pt-20 lg:pt-[150px] pb-20 lg:pb-[120px]">
      <div className="grid gap-10 lg:grid-cols-[600fr_680fr] lg:gap-0">
        <div>
          <h2 className="max-w-[460px] text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.18] font-[450] tracking-[-0.025em]">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 max-w-[320px] text-[15px] leading-[1.6] text-[#6B6F76]">
            Have a question? Here are answers to the ones we hear most.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={faq.question} className="rounded-[10px] border border-[#E7E5E1] bg-white">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 px-5 lg:px-6 py-5 lg:py-6 text-left text-[17px] lg:text-[20px] leading-[1.4] font-[450] tracking-[-0.01em]"
                  >
                    {faq.question}
                    {isOpen ? (
                      <Minus size={20} strokeWidth={1.5} className="shrink-0" />
                    ) : (
                      <Plus size={20} strokeWidth={1.5} className="shrink-0" />
                    )}
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 lg:px-6 pb-6 -mt-1 text-[15px] lg:text-[16px] leading-[1.65] text-[#6B6F76]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
