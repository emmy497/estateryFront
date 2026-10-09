import { useContext, useRef, useState, type FormEvent } from "react";
import { Camera, Mail } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { apiErrorMessage } from "../../utils/apiError";
import EmailChangeModal from "./EmailChangeModal";
import SectionCard, {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./SectionCard";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const ProfileSection = () => {
  const { user, token, login } = useContext(AuthContext);
  const savedName = user?.fullName ?? "";

  // Reset the field whenever the saved name changes (React's "adjust state
  // on prop change" pattern, instead of syncing in an effect)
  const [fullName, setFullName] = useState(savedName);
  const [nameFor, setNameFor] = useState(savedName);
  if (nameFor !== savedName) {
    setNameFor(savedName);
    setFullName(savedName);
  }

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trimmedName = fullName.trim();
  const nameChanged = trimmedName !== savedName.trim();
  const nameValid = trimmedName.length > 0 && trimmedName.length <= 80;

  const updateUser = (updated: Parameters<typeof login>[0]["user"]) => {
    if (token) login({ token, user: updated });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameChanged || !nameValid) return;

    setSaving(true);
    try {
      const response = await api.put("/user/update-details", {
        fullName: trimmedName,
        email: user?.email,
      });
      if (response.data?.user) updateUser(response.data.user);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Couldn't update your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Please choose an image under 5 MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const response = await api.put("/user/update-avatar", formData);
      if (response.data?.user) updateUser(response.data.user);
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Couldn't upload your photo. Please try again."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <SectionCard
          id="profile"
          title="Profile"
          description="Your name and photo appear on tour requests and messages from our team."
          footer={
            <>
              <button
                type="button"
                onClick={() => setFullName(savedName)}
                disabled={!nameChanged || saving}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!nameChanged || !nameValid || saving}
                className={primaryButtonClass}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </>
          }
        >
          {/* Photo */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Change profile photo"
              className="group relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full ring-1 ring-[#ECE8E3] ring-offset-4"
            >
              <img
                src={user?.avatar || "/images/UserProfile.png"}
                alt=""
                className="h-full w-full object-cover"
              />
              <span
                className={`absolute inset-0 flex items-center justify-center bg-[#1C1915]/55 text-white transition-opacity ${
                  uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {uploading ? (
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Camera size={22} />
                )}
              </span>
            </button>

            <div>
              <p className="text-[16px] font-medium text-[#111418]">{savedName || "Your name"}</p>
              <p className="text-[14px] text-[#6B6F76]">{user?.email}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-9 rounded-full border border-[#E2DDD6] px-4 text-[14px] hover:border-[#C9C1B7] disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : "Upload new photo"}
                </button>
                <span className="text-[13px] text-[#9A9DA3]">JPG or PNG, up to 5 MB</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="my-7 h-px bg-[#ECE8E3]" />

          {/* Fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className={labelClass}>
                Full name
              </label>
              <input
                id="profile-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                maxLength={80}
                aria-invalid={!nameValid || undefined}
                className={inputClass}
              />
              {!nameValid && (
                <p className="mt-2 text-[13px] text-[#B42318]">Please enter your name.</p>
              )}
            </div>

            <div>
              <span className={labelClass}>Email address</span>
              <div className="flex h-12 items-center justify-between gap-3 rounded-xl border border-[#ECE8E3] bg-[#FAFAF9] pl-4 pr-1.5">
                <span className="flex min-w-0 items-center gap-2 text-[15px] text-[#4A4D55]">
                  <Mail size={16} className="shrink-0 text-[#9A9DA3]" />
                  <span className="truncate">{user?.email}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(true)}
                  className="h-9 shrink-0 rounded-full bg-white px-4 text-[14px] font-medium text-[#111418] shadow-[0_1px_2px_rgba(17,20,24,0.08)] ring-1 ring-[#E2DDD6] hover:ring-[#C9C1B7]"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      </form>

      {emailModalOpen && user && (
        <EmailChangeModal
          currentEmail={user.email}
          onClose={() => setEmailModalOpen(false)}
          onChanged={updateUser}
        />
      )}
    </>
  );
};

export default ProfileSection;
