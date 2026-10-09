import { useContext, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

const AccountSettings = () => {
  const { user, logout, login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Personal Info State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Avatar State
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setAvatarLoading(true);
    try {
      const response = await api.put("/user/update-avatar", formData);
      const updatedUser = response.data.user;
      if (updatedUser && token) {
        login({ token, user: updatedUser });
      }
      toast.success("Profile photo updated!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to upload photo. Please try again.",
      );
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const response = await api.put("/user/update-details", {
        fullName,
        email,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
        const updated = response.data?.user;
        if (updated && token) {
          login({ token, user: updated });
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await api.put("/user/update-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update password. Please try again.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteMessage("Enter your password to confirm account deletion.");
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await api.delete("/user/delete-account", {
        data: { password: deletePassword },
      });

      if (response.status === 200 || response.status === 201) {
        setDeletePassword("");
        setDeleteMessage("");
        setIsDeleteModalOpen(false);
        toast.success("Your account has been deleted.");
        logout();
        navigate("/");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to delete account. Please try again.";
      setDeleteMessage(message);
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FBFBFB] w-full px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <h1 className="text-2xl sm:text-[28px] font-semibold sm:ml-[100px] pt-[40px] sm:pt-[64px]">
          My Account
        </h1>
        <p className="text-base sm:text-[18px] sm:ml-[100px] text-[#605E5E]">
          Manage your account settings and preferences
        </p>

        {/* Main container */}
        <div className="max-w-[804px] w-full mx-auto py-8 lg:py-[80px]">
          {/* Profile Section */}
          <section className="bg-white p-4 sm:p-8 rounded-[6px]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h1 className="text-[18px] font-semibold">Profile Information</h1>

              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[#E60E0E] w-fit bg-[#FFF2F2] py-2 px-4 flex items-center gap-2 rounded-[15px]"
              >
                <img className="w-[14px]" src="/images/redPen.png" alt="" />
                {isEditingProfile ? "Cancel" : "Edit"}
              </button>
            </div>

            {/* Profile Image */}
            <div className="relative my-6 w-fit">
              <img
                className="w-[100px] sm:w-[130px] rounded-full object-cover aspect-square"
                src={user?.avatar || "/images/UserProfile.png"}
                alt="Profile"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="bg-[#1C1915] w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded-full absolute bottom-0 right-0 disabled:opacity-60"
              >
                {avatarLoading ? (
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <img src="/images/camera.png" alt="Upload photo" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <form onSubmit={handleProfileSubmit}>
              {/* Full Name */}
              <h1 className="mb-2">Full Name</h1>
              <input
                className={`w-full h-[52px] rounded-[8px] border-[#D9D9D9] p-3 ${
                  isEditingProfile
                    ? "bg-white border-2 border-[#8B6B4E]"
                    : "bg-[#FBFBFB]"
                }`}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditingProfile}
              />

              {/* Email */}
              <div className="mt-6">
                <h1 className="mb-2">Email Address</h1>
                <input
                  className="w-full h-[52px] rounded-[8px] border-[#D9D9D9] p-3 bg-[#F3F3F3] text-gray-400 cursor-not-allowed"
                  type="email"
                  value={email}
                  disabled
                />
              </div>

              {isEditingProfile && (
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="mt-6 w-full sm:w-[196px] h-[51px] bg-[#1C1915] text-white rounded-[8px] hover:bg-[#3A332C] transition-colors disabled:opacity-50"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </form>
          </section>
          {/* Security Section */}
          <section className="bg-white mt-5 p-4 sm:p-8 rounded-[8px]">
            <h1 className="text-[20px] mb-6">Security Settings</h1>
            <h1 className="text-[18px] mb-4 text-[#5C5A5A]">Change Password</h1>

            <form onSubmit={handlePasswordUpdate}>
              {/* Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="mb-3">Current Password</h3>
                  <div className="relative">
                    <input
                      className="w-full h-[52px] bg-[#FBFBFB] rounded-[8px] border-[#D9D9D9] p-4 border-2"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* grid 2 */}
                <div>
                  <h3 className="mb-3">New Password</h3>
                  <div className="relative">
                    <input
                      className="w-full h-[52px] bg-[#FBFBFB] rounded-[8px] border-[#D9D9D9] p-4 border-2"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* grid 3 */}
                <div>
                  <h3 className="mb-3">Confirm Password</h3>
                  <div className="relative">
                    <input
                      className="w-full h-[52px] bg-[#FBFBFB] rounded-[8px] border-[#D9D9D9] p-4 border-2"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="mt-6 w-full sm:w-[196px]">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full h-[51px] bg-[#1C1915] text-white rounded-[8px] hover:bg-[#3A332C] transition-colors disabled:opacity-50 font-medium"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>

          </section>
          {/* notification section */}{" "}
          <div className="mt-5 bg-white rounded-[8px]">
            {" "}
            <h1 className="text-[20px] p-8">Notifications Preferences</h1>
            <div className="flex gap-2 items-center ml-8">
              <input type="checkbox" className="w-4 h-4 accent-blue-500" />
              <p className="text-[#494747]">Receive Email Notifications</p>
            </div>
            <div className="flex gap-2 items-center  ml-8 ">
              <input type="checkbox" className="w-4 h-4 accent-blue-500" />
              <p className="text-[#494747] my-8">Receive SMS Alerts</p>
            </div>
          </div>
          {/* Danger Zone */}
          <div className="mt-5 bg-white p-4 sm:p-6 rounded-[8px]">
            <h1 className="text-[20px] text-red-500">Danger Zone</h1>

            <div className="bg-[#FFEDED] p-4 mt-4 rounded-[8px]">
              <h2 className="text-[14px] mb-4">
                Once you delete your account, there is no going back.
              </h2>

              <button
                type="button"
                onClick={() => {
                  setDeleteMessage("");
                  setIsDeleteModalOpen(true);
                }}
                disabled={deleteLoading}
                className="w-full sm:w-[180px] h-[51px] bg-red-500 text-white rounded-[8px] hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[10px] bg-white p-6">
            <h2 className="text-[20px] font-semibold text-[#202020]">
              Confirm Account Deletion
            </h2>
            <p className="mt-2 text-sm text-[#605E5E]">
              This action is permanent. Enter your password to continue.
            </p>

            <div className="mt-5">
              <h3 className="mb-2 text-[14px] font-medium text-[#5C5A5A]">
                Password
              </h3>
              <div className="relative">
                <input
                  className="w-full h-[52px] bg-white rounded-[8px] border-[#D9D9D9] p-4 border-2"
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your account password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showDeletePassword ? "Hide password" : "Show password"}
                >
                  {showDeletePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {deleteMessage && (
              <p className="mt-3 text-sm text-red-600">{deleteMessage}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteMessage("");
                }}
                className="h-[44px] rounded-[8px] border border-[#D9D9D9] px-4 text-[#5C5A5A]"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="h-[44px] rounded-[8px] bg-red-500 px-4 text-white hover:bg-red-600 disabled:opacity-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AccountSettings;
