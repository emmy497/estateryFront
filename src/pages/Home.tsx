import { useQuery } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Hero from "../components/home/Hero";
import QualitySection from "../components/home/QualitySection";
import DreamGallery from "../components/home/DreamGallery";
import Faq from "../components/home/Faq";
import { searchProperties } from "../api/Properties";

const Home = () => {
  // only the three newest listings; if this fails the gallery shows interior photos
  const { data } = useQuery({
    queryKey: ["properties", "search", { limit: 3 }],
    queryFn: () => searchProperties({ limit: 3 }),
  });

  return (
    <div className="overflow-x-hidden bg-white text-[#111418]">
      <Hero />
      <QualitySection />
      <DreamGallery houses={data?.items ?? []} />
      <Faq />
      <Footer />
    </div>
  );
};

export default Home;
