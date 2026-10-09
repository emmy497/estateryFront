import { X, Trash2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getPropertyById, updateProperty, updatePropertyImages } from "../api/Properties";
import { toast } from "react-toastify";
import {
  PRESET_PROPERTY_FEATURES,
  normalizeFeaturesArray,
  splitPresetAndExtraFeatures,
} from "../utils/propertyFeatures";
import Spinner from "./Spinner";

type FormState = {
  title: string;
  description: string;
  location: string;
  state: string;
  price: string;
  category: string;
  beds: string;
  baths: string;
  area: string;
  parking: string;
  contactPhone: string;
  contactEmail: string;
  features: string[];
};

const emptyForm: FormState = {
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
  features: [],
};

export type EditPropertyModalProps = {
  isOpen: boolean;
  propertyId: string | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditPropertyModal({
  isOpen,
  propertyId,
  onClose,
  onSaved,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFeatureInput, setNewFeatureInput] = useState("");

  // Image editing state
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || !propertyId) {
      setFormData(emptyForm);
      setNewFeatureInput("");
      setExistingImages([]);
      setRemovedImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNewFeatureInput("");
    setRemovedImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    getPropertyById(propertyId)
      .then((p: Record<string, unknown>) => {
        if (cancelled) return;
        const feats = normalizeFeaturesArray(p.features);
        setFormData({
          title: String(p.title ?? ""),
          description: String(p.description ?? ""),
          location: String(p.location ?? ""),
          state: String(p.state ?? ""),
          price:
            p.price !== undefined && p.price !== null ? String(p.price) : "",
          category: String(p.category ?? "rent"),
          beds:
            p.beds !== undefined && p.beds !== null ? String(p.beds) : "",
          baths:
            p.baths !== undefined && p.baths !== null ? String(p.baths) : "",
          area: String(p.area ?? ""),
          parking:
            p.parking !== undefined && p.parking !== null
              ? String(p.parking)
              : "",
          contactPhone: String(p.contactPhone ?? ""),
          contactEmail: String(p.contactEmail ?? ""),
          features: feats,
        });
        setExistingImages(Array.isArray(p.images) ? (p.images as string[]) : []);
      })
      .catch(() => {
        if (!cancelled) setFormData(emptyForm);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, propertyId]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^\d+$/.test(raw)) {
      setFormData((prev) => ({ ...prev, price: raw }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePreset = (feature: string) => {
    setFormData((prev) => {
      const set = new Set(prev.features);
      if (set.has(feature)) set.delete(feature);
      else set.add(feature);
      return { ...prev, features: Array.from(set) };
    });
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const addCustomFeature = () => {
    const t = newFeatureInput.trim();
    if (!t) return;
    setFormData((prev) => {
      if (prev.features.includes(t)) return prev;
      return { ...prev, features: [...prev.features, t] };
    });
    setNewFeatureInput("");
  };

  const handleRemoveExisting = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleRemoveNew = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) return;

    const totalImages = existingImages.length + newImageFiles.length;
    if (totalImages === 0) {
      toast.error("Property must have at least one image");
      return;
    }

    try {
      setSaving(true);

      // Update images if anything changed
      if (removedImages.length > 0 || newImageFiles.length > 0) {
        console.log("Updating images — keep:", existingImages.length, "remove:", removedImages.length, "new:", newImageFiles.length);
        await updatePropertyImages(propertyId, existingImages, removedImages, newImageFiles);
        console.log("Images updated successfully");
      }

      await updateProperty(propertyId, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        state: formData.state,
        price: Number(formData.price),
        category: formData.category,
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        area: formData.area,
        parking: Number(formData.parking),
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        features: formData.features,
      });

      toast.success("Property updated successfully");
      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Save failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to update property";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const { extra: extraFeatures } = splitPresetAndExtraFeatures(formData.features);

  const overlay = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-[#ECE8E3] shrink-0">
          <h2 className="text-lg font-semibold">Edit Property</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-4 overflow-y-auto flex-1 space-y-4"
          >
            <div className="space-y-3">
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#8B6B4E]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#8B6B4E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Price</label>
                <input
                  name="price"
                  inputMode="numeric"
                  value={formData.price ? Number(formData.price).toLocaleString() : ""}
                  onChange={handlePriceChange}
                  required
                  className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Beds</label>
                <input
                  name="beds"
                  type="number"
                  min={0}
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-[#D9D9D9] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Baths</label>
                <input
                  name="baths"
                  type="number"
                  min={0}
                  value={formData.baths}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-[#D9D9D9] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Area</label>
                <input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-[#D9D9D9] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parking</label>
                <input
                  name="parking"
                  type="number"
                  min={0}
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-[#D9D9D9] focus:outline-none"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-3 border rounded-lg p-3 border-[#E6E3E3]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Images ({existingImages.length + newImageFiles.length})
                </label>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1 text-sm text-[#8B6B4E] hover:underline"
                >
                  <Plus size={16} /> Add images
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddImages}
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {existingImages.map((url) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt="property"
                      className="w-full h-[80px] object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      aria-label="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {newImagePreviews.map((preview, i) => (
                  <div key={preview} className="relative group">
                    <img
                      src={preview}
                      alt="new"
                      className="w-full h-[80px] object-cover rounded-lg ring-2 ring-[#8B6B4E]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNew(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      aria-label="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              {existingImages.length + newImageFiles.length === 0 && (
                <p className="text-sm text-red-500">At least one image is required</p>
              )}
            </div>

            <div className="space-y-3 border rounded-lg p-3 border-[#E6E3E3]">
              <label className="text-sm font-medium">Features</label>
              <p className="text-xs text-gray-500">
                Presets match the add-property form; other features from your
                listing are shown below and can be removed or you can add more.
              </p>
              <div className="flex flex-wrap gap-4">
                {PRESET_PROPERTY_FEATURES.map((feature) => (
                  <label key={feature} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => togglePreset(feature)}
                    />
                    {feature}
                  </label>
                ))}
              </div>

              {extraFeatures.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-600">
                    Other features (from your property)
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {extraFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                          aria-label={`Remove ${feature}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomFeature();
                    }
                  }}
                  placeholder="Add a feature"
                  className="flex-1 border rounded-lg p-2 border-[#D9D9D9] focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={addCustomFeature}
                  className="px-4 py-2 border border-[#8B6B4E] text-[#8B6B4E] rounded-lg text-sm hover:bg-[#1C1915] hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Contact phone</label>
                <input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Contact email</label>
                <input
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 border-[#D9D9D9] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#ECE8E3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[#1C1915] text-white rounded-lg hover:bg-[#3A332C] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : null;
}
