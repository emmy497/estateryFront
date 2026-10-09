import Navbar from "../components/Navbar";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import Footer from "../components/Footer";
import SimilarProperties from "../components/SimilarProperties";
import api from "../api/api";
import { useContext, useEffect, useState } from "react";
import { getPropertyById } from "../api/Properties";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import TourRequestModal from "../components/TourRequestModal";
import PropertyMap from "../components/PropertyMap";
import Spinner from "../components/Spinner";
import { BathIcon, BedSingleIcon, Move, ParkingSquare } from "lucide-react";
import { isPastSlot, minTimeFor, todayISO } from "../utils/tourDate";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(false);

  const toggleFavorite = () => {
    if (!token) {
      toast.info("Please log in to save properties");
      navigate("/login");
      return;
    }

    const savedIds = JSON.parse(
      localStorage.getItem("savedProperties") || "[]",
    ) as string[];

    const nextSavedIds = savedIds.includes(id!)
      ? savedIds.filter((sid) => sid !== id)
      : [...savedIds, id!];

    localStorage.setItem("savedProperties", JSON.stringify(nextSavedIds));
    setIsSaved(!savedIds.includes(id!));
  };

  const [tourData, setTourData] = useState({
    type: "In Person",
    date: "",
    time: "",
    name: "",
    email: "",
    message: "",
  });

  const [showModal, setShowModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTourData({
      ...tourData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please log in to submit a tour request");
      navigate("/login");
      return;
    }

    if (!tourData.date || !tourData.time) {
      toast.error("Please choose a date and time for your tour");
      return;
    }

    if (isPastSlot(tourData.date, tourData.time)) {
      toast.error("Please choose a date and time that hasn't passed yet");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        "/tours",
        {
          property: id,
          tourType: tourData.type === "In Person" ? "in-person" : "virtual", // ✅ FIXED
          date: tourData.date,
          time: tourData.time,
          name: tourData.name,
          email: tourData.email,
          message: tourData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ if using auth
          },
        },
      );

      setTourData({
        type: "In Person",
        date: "",
        time: "",
        name: "",
        email: "",
        message: "",
      });

      setShowModal(true);
    } catch (error: any) {
      console.error("Error submitting tour:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to submit tour request");
    } finally {
      setSubmitting(false);
    }
  };
  // const [houses, setHouses] = useState<House[]>([]);
  // const { id } = useParams();

  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5009/api/properties");
  //       setHouses(res.data);
  //     } catch (error) {
  //       console.error("Error fetching properties:", error);
  //     }
  //   };

  //   fetchProperties();
  // }, []);

  // // FIX: MongoDB uses string IDs
  // const house = houses.find((h) => h._id === id);

  // console.log(house);

  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id!);

        setHouse(data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const savedIds = JSON.parse(
      localStorage.getItem("savedProperties") || "[]",
    ) as string[];
    setIsSaved(savedIds.includes(id));
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EA] text-[#403F3F]">
        <Spinner />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EA] text-[#403F3F]">
        <div className="text-center">
          <h1 className="text-[24px] font-semibold mb-4">Property not found</h1>
          <p className="text-[16px]">The selected property does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-[#F5F0EA] px-8 lg:px-[100px]">
        <div className="flex gap-5   mb-[40px] pt-8">
          <NavLink to="/properties">
            <h5>Properties</h5>
          </NavLink>

          <img src="/images/arrowR.svg" alt="" />

          <h5 className="text-[#8B6B4E]">{house?.title}</h5>
        </div>

        <div className="mb-[40px]">
          <h4 className="text-[32px] mb-[12px]">{house?.title}</h4>
          <div className="flex gap-[8px] items-center">
            <img src="/images/MapPin.png" alt="" />
            <h4>{house?.location}</h4>
          </div>
        </div>

        <div className="w-full mt-[40px] flex flex-col lg:flex-row gap-4 mb-[40px]">
          {/* Main Image */}
          <div
            className="photo-tint w-full lg:w-[70%] h-[250px] sm:h-[350px] lg:h-[460px] bg-no-repeat bg-cover bg-center overflow-hidden rounded-[12px]"
            style={{
              backgroundImage: `url(${house?.images[0]})`,
            }}
          >
            <div className="z-[2] absolute left-[16px] top-[16px] bg-white/90 backdrop-blur-sm text-[#1C1915] font-medium capitalize py-[6px] px-[12px] rounded-full text-sm">
              For {house?.category}
            </div>

            {/* Heart */}
            <button
              onClick={toggleFavorite}
              className="z-[2] absolute right-[16px] top-[16px] bg-white/90 backdrop-blur-sm p-2 rounded-full shadow cursor-pointer"
            >
              <img
                className="w-[24px] h-[24px]"
                src={isSaved ? "/images/FavoriteHeart.png" : "/images/love.png"}
                alt="favorite"
              />
            </button>
          </div>

          {/* Side Images */}
          <div className="flex flex-row lg:flex-col gap-[12px] w-full lg:w-[30%] justify-between">
            {[house?.images[1], house?.images[2]].map((src, index) =>
              src ? (
                <div
                  key={index}
                  className="photo-tint w-1/2 lg:w-full h-[120px] sm:h-[160px] lg:h-[220px] overflow-hidden rounded-[12px]"
                >
                  <img className="w-full h-full object-cover" src={src} alt="" />
                </div>
              ) : null,
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row mt-8 gap-6 mb-[28px]">
          {/* Property Details */}
          <div className="flex flex-wrap justify-between items-center rounded-[8px] border p-[20px] w-full lg:max-w-[830px] bg-white border-[#E7E7E7] gap-6">
            {/* Bedrooms */}
            <div className="flex flex-col gap-[6px] min-w-[120px]">
              <h5 className="font-medium text-black text-[14px] sm:text-[15px]">
                Bedrooms
              </h5>
              <div className="flex items-center gap-[8px]">
                {/* <img
                  className="h-[22px] w-[22px]"
                  src="/images/Bed.png"
                  alt="bed"
                /> */}
                <BedSingleIcon size={18} />
                <h6 className="text-[#606060] text-[16px] sm:text-[18px]">
                  {house?.beds}
                </h6>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col gap-[6px] min-w-[120px]">
              <h5 className="font-medium text-black text-[14px] sm:text-[15px]">
                Bathrooms
              </h5>
              <div className="flex items-center gap-[8px]">
                {/* <img
                  className="h-[22px] w-[22px]"
                  src="/images/Bathtub.png"
                  alt="bath"
                /> */}
                <BathIcon size={18} />

                <h6 className="text-[#606060] text-[16px] sm:text-[18px]">
                  {house?.baths}
                </h6>
              </div>
            </div>

            {/* Square Area */}
            <div className="flex flex-col gap-[6px] min-w-[120px]">
              <h5 className="font-medium text-black text-[14px] sm:text-[15px]">
                Square Area
              </h5>
              <div className="flex items-center gap-[8px]">
                {/* <img
                  className="h-[22px] w-[22px]"
                  src="/images/square-area.png"
                  alt="area"
                /> */}
                <Move size={18} />
                <h6 className="text-[#606060] text-[16px] sm:text-[18px]">
                  {house?.area}
                </h6>
              </div>
            </div>

            {/* Parking */}
            <div className="flex flex-col gap-[6px] min-w-[120px]">
              <h5 className="font-medium text-black text-[14px] sm:text-[15px]">
                Parking
              </h5>
              <div className="flex items-center gap-[8px]">
                {/* <img
                  className="h-[22px] w-[22px]"
                  src="/images/parking.png"
                  alt="parking"
                /> */}
                <ParkingSquare size={18} />
                <h6 className="text-[#606060] text-[16px] sm:text-[18px]">
                  {house?.parking}
                </h6>
              </div>
            </div>

            {/* Property Status */}
            <div className="flex flex-col gap-[6px] min-w-[120px]">
              <h5 className="font-medium text-black text-[14px] sm:text-[15px]">
                Property Status
              </h5>
              <h6 className="text-[#606060] text-[16px] sm:text-[18px]">
                For {house?.category}
              </h6>
            </div>
          </div>

          {/* Price */}
          <div className="flex lg:ml-auto w-full lg:w-auto justify-between lg:justify-end items-center">
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] sm:text-[26px] lg:text-[32px] font-bold text-black">
                {formatPrice(house.price)}
              </span>
              <span className="text-[14px] sm:text-[16px] text-[#606060]">
                /year
              </span>
            </div>
          </div>
        </div>

        {/* Main content — left + right */}
        <div className="flex flex-col lg:flex-row gap-[32px] mt-[28px] mb-[60px]   justify-between  ">
          {/* Left section */}
          <div className="flex-1 min-w-0 lg:w-[50%] flex flex-col">
            <div className="max-w-[769px]">
              <h1 className="text-[18px] sm:text-[22px] font-semibold text-black mb-[14px] ">
                About this property
              </h1>
              <p className="text-[14px] sm:text-[18px] text-[#605E5E] font-normal mb-[24px] leading-relaxed">
                Spacious and well-designed 3-bedroom apartment located in a
                serene environment. Features modern fittings, ample parking
                space, and easy access to major roads, schools, and shopping
                centers.
              </p>
            </div>

            <h1 className="text-[18px] sm:text-[22px] font-semibold text-black mb-[20px]">
              Property Features
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[32px] gap-y-0 mb-[32px]">
              {house.features.map((feature: any) => (
                <div
                  key={feature}
                  className="flex items-center gap-[8px] mb-[20px]"
                >
                  <img
                    src="/images/Checkbox.svg"
                    className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] shrink-0"
                    alt=""
                  />
                  <span className="text-[14px] sm:text-[18px] font-normal text-[#605E5E]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col min-h-[300px]">
              <h1 className="text-[18px] sm:text-[22px] font-semibold text-black mb-[20px]">
                Location
              </h1>

              <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden">
                {!house.coordinates?.lat || !house.coordinates?.lng ? (
                  <div className="h-full min-h-[300px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
                    Location not available for this property
                  </div>
                ) : (
                  <PropertyMap
                    lat={house.coordinates.lat}
                    lng={house.coordinates.lng}
                    title={house.title}
                    location={house.location}
                    image={house.images?.[0]}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col gap-[23px] w-full lg:w-[399px] shrink-0">
            {/* Agent Detail */}
            <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] px-[20px] sm:px-[27px] py-[26px] shadow">
              <h1 className="text-[20px] sm:text-[24px] font-medium mb-[20px]">
                Agent Detail
              </h1>
              <div className="flex items-center gap-[12px] sm:gap-[13px] mb-[24px]">
                <img
                  className="w-[52px] h-[52px] sm:w-[69px] sm:h-[69px] rounded-full object-cover shrink-0"
                  src={house.agentImage || "/images/ChineseAgent.png"}
                  alt="Agent"
                />
                <div>
                  <h2 className="font-medium text-[16px] sm:text-[18px]">
                    {house.agentName || "Property Agent"}
                  </h2>
                  <p className="font-normal text-[13px] sm:text-[14px] text-[#403F3F]">
                    Real Estate Agent
                  </p>
                </div>
              </div>

              {token ? (
                <a
                  href={`tel:${house.contactPhone}`}
                  className="bg-[#1C1915] w-full h-[47px] flex items-center justify-center gap-[10px] rounded-[8px] hover:bg-[#3A332C] transition-colors"
                >
                  <img
                    src="/images/call.png"
                    alt="call icon"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="text-[#FFFFFF] text-[16px] sm:text-[18px] font-medium">
                    Call Agent
                  </span>
                </a>
              ) : (
                <button
                  onClick={() => { toast.info("Please log in to contact the agent"); navigate("/login"); }}
                  className="bg-[#1C1915] w-full h-[47px] flex items-center justify-center gap-[10px] rounded-[8px] hover:bg-[#3A332C] transition-colors"
                >
                  <img
                    src="/images/call.png"
                    alt="call icon"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="text-[#FFFFFF] text-[16px] sm:text-[18px] font-medium">
                    Call Agent
                  </span>
                </button>
              )}
            </div>

            {/* Schedule a Tour */}
            {/* Schedule a Tour */}
            <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] px-[20px] sm:px-[27px] py-[26px] shadow">
              <h1 className="text-[20px] sm:text-[24px] font-medium mb-[20px]">
                Schedule a Tour
              </h1>

              {/* TYPE */}
              <div className="flex items-center gap-[10px]">
                <button
                  onClick={() =>
                    setTourData({ ...tourData, type: "In Person" })
                  }
                  className={`flex-1 rounded-[8px] ${
                    tourData.type === "In Person"
                      ? "bg-[#1C1915] text-white"
                      : "bg-white border-2 border-[#8B6B4E] text-[#8B6B4E]"
                  } font-medium text-[15px] sm:text-[18px] py-[10px] h-[47px]`}
                >
                  In Person
                </button>

                <button
                  onClick={() => setTourData({ ...tourData, type: "Virtual" })}
                  className={`flex-1 rounded-[8px] ${
                    tourData.type === "Virtual"
                      ? "bg-[#1C1915] text-white"
                      : "bg-white border-2 border-[#8B6B4E] text-[#8B6B4E]"
                  } font-medium text-[15px] sm:text-[18px] py-[10px] h-[47px]`}
                >
                  Virtual
                </button>
              </div>

              {/* INPUTS */}
              <input
                name="date"
                type="date"
                min={todayISO()}
                value={tourData.date}
                onChange={handleChange}
                className="mt-[16px] border border-[#D9D9D9] focus:outline-none w-full p-3 rounded-[8px]"
              />

              <input
                name="time"
                type="time"
                min={minTimeFor(tourData.date)}
                value={tourData.time}
                onChange={handleChange}
                className="mt-[16px] border border-[#D9D9D9] focus:outline-none w-full p-3 rounded-[8px]"
              />

              <input
                name="name"
                type="text"
                placeholder="Name"
                value={tourData.name}
                onChange={handleChange}
                className="mt-[16px] border border-[#D9D9D9] focus:outline-none w-full p-3 rounded-[8px]"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={tourData.email}
                onChange={handleChange}
                className="mt-[16px] border border-[#D9D9D9] focus:outline-none w-full p-3 rounded-[8px]"
              />

              <textarea
                name="message"
                placeholder="Message"
                value={tourData.message}
                onChange={handleChange}
                className="mt-[16px] border border-[#D9D9D9] focus:outline-none w-full p-3 rounded-[8px]"
              />

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#1C1915] w-full h-[47px] mt-[20px] rounded-[8px] text-white"
              >
                {submitting ? "Submitting..." : "Submit Tour Request"}
              </button>
            </div>
          </div>
        </div>
        <SimilarProperties currentHouse={house} />
      </div>
      <Footer />

      <TourRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default PropertyDetails;
