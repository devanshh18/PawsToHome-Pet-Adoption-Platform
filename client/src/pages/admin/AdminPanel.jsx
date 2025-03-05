// client/src/pages/admin/AdminLayout.jsx

import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  FiLogOut,
  FiHome,
  FiUsers,
  FiActivity,
  FiBarChart2,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import DashboardTab from "../../components/admin-facing/DashboardTab";
import UserManagementTab from "../../components/admin-facing/UserManagementTab";
import SystemHealthTab from "../../components/admin-facing/SystemHealthTab";
import InsightsTab from "../../components/admin-facing/InsightsTab";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { name: "Dashboard", icon: FiHome },
    { name: "User Management", icon: FiUsers },
    { name: "System Health", icon: FiActivity },
    { name: "Insights & Exports", icon: FiBarChart2 },
  ];

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear Redux state
      dispatch(logout());

      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    setIsLoading(false);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50/95">
      {isLoading && <LoadingSpinner />}

      <Tab.Group vertical>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isSidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Sidebar */}
        <aside
          className={`
    fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-100 z-40
    transition-all duration-300 transform
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:w-64 w-72
  `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
              <span className="text-3xl font-bold text-blue-600">
                PawsToHome
              </span>
            </div>

            {/* Navigation */}
            <Tab.List className="flex-1 space-y-2 p-4">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className="focus:outline-none w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {({ selected }) => (
                    <div
                      className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all
                ${
                  selected
                    ? "bg-white text-blue-600 shadow-lg shadow-blue-100/50"
                    : "text-gray-500 hover:bg-white/50 hover:text-blue-500"
                }
              `}
                    >
                      <tab.icon
                        className={`w-5 h-5 ${
                          selected ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      {tab.name}
                    </div>
                  )}
                </Tab>
              ))}
            </Tab.List>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-lg font-bold ring-2 ring-white shadow">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-all text-lg font-medium ring-1 ring-red-100 shadow-sm hover:ring-red-200"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - Update header gradient */}
        <main className="lg:ml-64 flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-800 max-w-6xl mx-auto rounded-xl overflow-hidden mb-6">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-white p-0.5">
                  <div className="w-full h-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{user?.name}</h1>
                  <p className="text-lg text-blue-100 mt-0.5">
                    Administration Panel
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tab.Panels className="max-w-6xl mx-auto">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={tab.name}
                className="bg-white rounded-xl lg:rounded-2xl transition-opacity duration-300"
              >
                <div className="opacity-100">
                  {idx === 0 && <DashboardTab />}
                  {idx === 1 && <UserManagementTab />}
                  {idx === 2 && <SystemHealthTab />}
                  {idx === 3 && <InsightsTab />}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </main>
      </Tab.Group>
    </div>
  );
}
