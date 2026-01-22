import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaStore,
  FaUserShield,
  FaEllipsisV,
  FaCheck,
  FaSpinner,
  FaFilter,
  FaBan,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { isLoggedIn } from "../../assets/auth";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  // --- MOCK DATA FETCHING (Replace with your actual API call) ---
  const user = isLoggedIn("admin");
  const API = import.meta.env.VITE_API;
  useEffect(() => {
    // setUsers(fetchUsers);
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}api/admin/fetch-users.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": user,
        },
      });

      const result = await response.json();

      console.log(result);
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch users");
      }

      console.log("Users:", result.users);

      return result.users; // ← SAME AS mockUsers
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };

    loadUsers();
  }, []);

  // --- HANDLERS ---

  // Handle Role Update
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);

    try {
      const response = await fetch(`${API}api/admin/update-role.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          user_id: userId,
          role: newRole,
          admin_id: user,
        }),
      });

      const result = await response.json();
      // console.log(result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      // ✅ Functional state update (SAFE)
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );

      toast.success(
        `User role updated to ${
          newRole.charAt(0).toUpperCase() + newRole.slice(1)
        }`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "All" || user.role === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // Helper: Get Icon based on role
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-red-500" />;
      case "shopkeeper":
        return <FaStore className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  // Helper: Get Badge Color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "shopkeeper":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  return (
    <div className="p-4  min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage users, assign shopkeeper roles, and monitor status.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Role Filter Dropdown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400 text-xs" />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-8 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none w-full sm:w-auto appearance-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="User">Users</option>
              <option value="Shopkeeper">Shopkeepers</option>
              <option value="Admin">Admins</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-3xl text-purple-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              Try adjusting your search terms or filter to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterRole("All");
              }}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* --- DESKTOP TABLE VIEW --- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${user.status === "Active" ? "text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : "text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === "Active" ? "bg-green-500" : "bg-gray-500"}`}
                          ></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {user.joined}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group">
                          {updatingId === user.id ? (
                            <FaSpinner className="animate-spin text-purple-600" />
                          ) : (
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded shadow-sm py-1.5 pl-2 pr-6 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer hover:border-purple-400 transition-colors"
                            >
                              <option value="user">User</option>
                              <option value="shopkeeper">Shopkeeper</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- MOBILE CARD VIEW --- */}
            <div className="md:hidden grid grid-cols-1 gap-4 p-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.status === "Active" ? "text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : "text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400"}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Joined
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {user.joined}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Current Role
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Change Role:
                    </span>
                    {updatingId === user.id ? (
                      <div className="flex items-center gap-2 text-purple-600 text-sm">
                        <FaSpinner className="animate-spin" /> Updating...
                      </div>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded shadow-sm py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-purple-500 outline-none w-40"
                      >
                        <option value="user">User</option>
                        <option value="shopkeeper">Shopkeeper</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
