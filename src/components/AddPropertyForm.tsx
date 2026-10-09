import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import LoadingOverlay from "./LoadingOverlay";
import { PRESET_PROPERTY_FEATURES } from "../utils/propertyFeatures";

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    state: "",
    price: "",
    category: "rent",
    beds: "",
    baths: "",
    area: "",
    parking: "",
    contactPhone: "",
    contactEmail: "",
    agentName: "",
    features: [] as string[],
  });

  const [images, setImages] = useState<File[]>([]);
  const [agentImageFile, setAgentImageFile] = useState<File | null>(null);
  const [agentImagePreview, setAgentImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^\d+$/.test(raw)) {
      setFormData((prev) => ({ ...prev, price: raw }));
    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE FEATURES (CHECKBOX)
  const handleFeatureChange = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);

      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
    });
  };

  // IMAGE HANDLERS
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImages(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleAgentImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (agentImagePreview) URL.revokeObjectURL(agentImagePreview);
    setAgentImageFile(file);
    setAgentImagePreview(URL.createObjectURL(file));
  };

  // SUBMIT
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  try {
    setLoading(true);

    const data = new FormData();

    // append normal fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "features") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value as string);
      }
    });

    // append property images
    images.forEach((img) => {
      data.append("images", img);
    });

    // append agent image
    if (agentImageFile) {
      data.append("agentImage", agentImageFile);
    }

    const response = await api.post("/properties", data);

    console.log("SUCCESS:", response);

    toast.success("Property created successfully!");

    // reset form
    setFormData({
      title: "",
      description: "",
      location: "",
      state: "",
      price: "",
      category: "rent",
      beds: "",
      baths: "",
      area: "",
      parking: "",
      contactPhone: "",
      contactEmail: "",
      agentName: "",
      features: [],
    });

    setImages([]);
    setAgentImageFile(null);
    setAgentImagePreview(null);
  } catch (error: any) {
    console.error(error);
    const msg = error?.response?.data?.message || error?.message || "Upload failed";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen p-4 md:p-8">
        {loading && <LoadingOverlay />}

        
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        {/* BASIC INFO */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Basic Information</h2>

          {/* IMAGE UPLOAD */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center cursor-pointer"
          >
            <p className="text-gray-500 text-sm md:text-base">
              Drag & drop images (JPG/PNG)
            </p>

            <p className="my-2 text-gray-400">or</p>

            <label className="bg-[#1C1915] text-white px-4 py-2 rounded-md cursor-pointer">
              Choose File
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="h-24 w-full object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* INPUTS */}
          <div className="mt-6 space-y-4">
            <input
              name="title"
              placeholder="Property Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3  border-[#D9D9D9] focus:outline-none"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3  border-[#D9D9D9] focus:outline-none"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3  border-[#D9D9D9] focus:outline-none"
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>

            <input
              name="price"
              placeholder="Price"
              value={formData.price ? Number(formData.price).toLocaleString() : ""}
              onChange={handlePriceChange}
              className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="location"
              placeholder="City/Area"
              value={formData.location}
              onChange={handleChange}
              className="border border-[#D9D9D9] focus:outline-none p-3 rounded-lg"
            />

            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="border  border-[#D9D9D9] focus:outline-none p-3 rounded-lg"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Property Details</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              name="beds"
              placeholder="Beds"
              value={formData.beds}
              onChange={handleChange}
              className="border p-3 rounded-lg  border-[#D9D9D9] focus:outline-none"
            />
            <input
              name="baths"
              placeholder="Baths"
              value={formData.baths}
              onChange={handleChange}
              className="border p-3 rounded-lg  border-[#D9D9D9] focus:outline-none"
            />
            <input
              name="area"
              placeholder="Area (sqft)"
              value={formData.area}
              onChange={handleChange}
              className="border p-3 rounded-lg  border-[#D9D9D9] focus:outline-none"
            />
            <input
              name="parking"
              placeholder="Parking"
              value={formData.parking}
              onChange={handleChange}
              className="border p-3 rounded-lg  border-[#D9D9D9] focus:outline-none"
            />
          </div>
        </div>

        {/* FEATURES */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Features</h2>

          <div className="flex flex-wrap gap-4">
            {PRESET_PROPERTY_FEATURES.map((feature) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={() => handleFeatureChange(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Contact Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="contactPhone"
              placeholder="Phone Number"
              value={formData.contactPhone}
              onChange={handleChange}
              className="border p-3 rounded-lg  border-[#D9D9D9] focus:outline-none"
            />

            <input
              name="contactEmail"
              placeholder="Email"
              value={formData.contactEmail}
              onChange={handleChange}
              className="border p-3 rounded-lg  border-[#D9D9D9] focus:outline-none"
            />
          </div>
        </div>

        {/* AGENT */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Agent Details</h2>

          <div className="flex items-center gap-4">
            {/* Avatar picker */}
            <label className="relative shrink-0 cursor-pointer group">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#D9D9D9] bg-gray-100 group-hover:border-[#8B6B4E] transition-colors">
                {agentImagePreview ? (
                  <img src={agentImagePreview} className="w-full h-full object-cover" alt="agent" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] text-center leading-tight px-2">
                    Add photo
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#1C1915] rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                +
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAgentImageSelect} />
            </label>

            {/* Name input aligned to avatar height */}
            <input
              name="agentName"
              placeholder="Agent Name"
              value={formData.agentName}
              onChange={handleChange}
              className="flex-1 border rounded-lg p-3 border-[#D9D9D9] focus:outline-none focus:border-[#8B6B4E]"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button type="button" className="border border-[#8B6B4E] text-[#8B6B4E] px-6 py-2 rounded-lg">
            Save Draft
          </button>

          <button type="submit" className="bg-[#1C1915] text-white px-6 py-2 rounded-lg">
            Publish Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
