import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/api";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Spinner from "../components/Spinner";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

const PAGE_SIZE = 8;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const handleToggleStatus = async (user: User) => {
    setTogglingId(user._id);
    try {
      await api.patch(`/user/${user._id}/status`);
      const updated = { ...user, isActive: !user.isActive };
      setUsers((prev) => prev.map((u) => (u._id === user._id ? updated : u)));
      if (selectedUser?._id === user._id) setSelectedUser(updated);
      toast.success(`${user.fullName} ${user.isActive ? "deactivated" : "activated"}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = users
    .filter((u) => {
      if (statusFilter === "active") return u.isActive;
      if (statusFilter === "inactive") return !u.isActive;
      return true;
    })
    .filter((u) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortBy === "oldest" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="mx-3">
        <h1 className="text-2xl font-bold text-[#1C1915] mb-6">User Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E6E3E3] px-5 py-4 mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between shadow-sm">
          <div className="flex flex-col gap-1 w-full sm:max-w-[400px]">
            <label className="text-[13px] text-[#555]">Search</label>
            <div className="flex items-center gap-2 border border-[#D9D9D9] rounded-lg px-3 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-[14px] focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#555]">Status</label>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none border border-[#D9D9D9] rounded-lg px-3 py-2 pr-8 text-[14px] focus:outline-none bg-white cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-[#555]">Sort By</label>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-[#D9D9D9] rounded-lg px-3 py-2 pr-8 text-[14px] focus:outline-none bg-white cursor-pointer">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E6E3E3] p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No users found.</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E1E1E1]">
              <table className="w-full bg-white text-sm border-collapse">
                <thead className="bg-[#FEFAFA] border-b border-[#E1E1E1]">
                  <tr>
                    <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Full Name</th>
                    <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Date Joined</th>
                    <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 border-b border-[#E1E1E1]">
                      <td className="p-[24px] text-gray-900">{user.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`capitalize font-semibold py-1 px-3 rounded-xl text-sm ${user.isActive ? "text-green-600 bg-[#DCFCE7]" : "text-red-500 bg-[#FFEDED]"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E1E1E1] bg-white">
                <p className="text-[13px] text-[#555]">
                  Showing {Math.min(paginated.length, PAGE_SIZE)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1 text-[13px] text-[#555]">
                  <span className="mr-2">Page {page} of {totalPages}</span>
                  <PaginationBtn onClick={() => setPage(1)} disabled={page === 1}>«</PaginationBtn>
                  <PaginationBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PaginationBtn>
                  <PaginationBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PaginationBtn>
                  <PaginationBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PaginationBtn>
                </div>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {paginated.map((user) => (
                <div key={user._id} className="bg-white border border-[#E6E3E3] rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-[15px] text-[#1C1915] mb-1">{user.fullName}</p>
                  <p className="text-[13px] text-[#555] mb-1">{user.email}</p>
                  <p className="text-[13px] text-[#555] mb-3">Joined {formatDate(user.createdAt)}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${user.isActive ? "bg-[#DCFCE7] text-[#048120]" : "bg-[#FFEDED] text-[#E60E0E]"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                    <button onClick={() => setSelectedUser(user)}
                      className="text-[#8B6B4E] text-sm font-medium hover:underline">
                      View
                    </button>
                  </div>
                </div>
              ))}
              {/* Mobile pagination */}
              <div className="flex items-center justify-between pt-2 text-[13px] text-[#555]">
                <span>Showing {paginated.length} of {filtered.length}</span>
                <div className="flex items-center gap-1">
                  <PaginationBtn onClick={() => setPage(1)} disabled={page === 1}>«</PaginationBtn>
                  <PaginationBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PaginationBtn>
                  <span className="px-2">Page {page}/{totalPages}</span>
                  <PaginationBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PaginationBtn>
                  <PaginationBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PaginationBtn>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#F0F0F0]">
              <h2 className="text-[17px] font-semibold">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6">
              {/* Avatar + name */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={selectedUser.avatar || "/images/UserProfile.png"}
                  alt={selectedUser.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E6E3E3] mb-3"
                />
                <h3 className="text-[17px] font-semibold text-[#1C1915]">{selectedUser.fullName}</h3>
                <span className={`mt-2 px-3 py-1 rounded-full text-[12px] font-medium ${selectedUser.isActive ? "bg-[#DCFCE7] text-[#048120]" : "bg-[#FFEDED] text-[#E60E0E]"}`}>
                  {selectedUser.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Info rows */}
              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between py-2 border-b border-[#F5F5F5]">
                  <span className="text-[#888]">Email</span>
                  <span className="text-[#1C1915] font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F5F5F5]">
                  <span className="text-[#888]">Phone</span>
                  <span className="text-[#1C1915] font-medium">{selectedUser.phoneNumber || "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#888]">Date Joined</span>
                  <span className="text-[#1C1915] font-medium">{formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>

              {/* Toggle button */}
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                disabled={togglingId === selectedUser._id}
                className={`w-full py-3 rounded-xl text-white font-medium text-[15px] transition-colors disabled:opacity-50 ${
                  selectedUser.isActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-[#1C1915] hover:bg-[#3A332C]"
                }`}
              >
                {togglingId === selectedUser._id
                  ? "Updating..."
                  : selectedUser.isActive
                  ? "Deactivate User"
                  : "Activate User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const PaginationBtn = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-7 h-7 flex items-center justify-center rounded border border-[#E6E3E3] text-[13px] text-[#555] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    {children}
  </button>
);

export default UserManagement;
