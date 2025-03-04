import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FiUsers,
  FiHome,
  FiHeart,
  FiArchive,
  FiAlertCircle,
  FiActivity,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  fetchAdminStats,
  resetAdminState,
} from "../../features/admin/adminSlice";
import adminService from "../../features/admin/adminService";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

// Updated color palette with blue focus
const COLORS = ["#3b82f6", "#0ea5e9", "#2563eb", "#60a5fa", "#93c5fd"];

export default function DashboardTab() {
  const dispatch = useDispatch();
  const { adminStats, isLoading, isError } = useSelector(
    (state) => state.admin
  );
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());

    return () => {
      dispatch(resetAdminState());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminStats());
    toast.info("Refreshing dashboard data...");
  };

  const generateDashboardReport = async () => {
    if (isGeneratingReport) return;

    setIsGeneratingReport(true);
    toast.info("Generating dashboard report, please wait...");

    try {
      // Make API request to generate the report
      const response = await adminService.generateReport("dashboard", {
        includeAdoptions: true,
        includePetDistribution: true,
        includeUserStats: true,
      });

      // Process blob data for download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      // Create download link and trigger click
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `dashboard-statistics-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Dashboard report downloaded successfully");
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error(
        `Failed to generate report: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !adminStats) {
    return (
      <ErrorAlert
        message="Failed to load dashboard data"
        retryAction={handleRefresh}
      />
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Platform Overview</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FiUsers className="w-6 h-6 text-blue-500" />}
          title="Total Users"
          value={adminStats.totalUsers?.toLocaleString() || "0"}
          colorClass="bg-blue-100"
        />
        <StatCard
          icon={<FiHome className="w-6 h-6 text-sky-500" />}
          title="Total Shelters"
          value={adminStats.totalShelters?.toLocaleString() || "0"}
          colorClass="bg-sky-100"
        />
        <StatCard
          icon={<FiHeart className="w-6 h-6 text-blue-500" />}
          title="Adoptable Pets"
          value={adminStats.totalPets?.toLocaleString() || "0"}
          colorClass="bg-blue-100"
        />
        <StatCard
          icon={<FiArchive className="w-6 h-6 text-green-500" />}
          title="Total Adoptions"
          value={adminStats.totalAdoptions?.toLocaleString() || "0"}
          colorClass="bg-green-100"
        />

        <StatCard
          icon={<FiAlertCircle className="w-6 h-6 text-amber-500" />}
          title="Pending Registrations"
          value={adminStats.pendingRegistrations?.toLocaleString() || "0"}
          colorClass="bg-amber-100"
        />
        <StatCard
          icon={<FiActivity className="w-6 h-6 text-blue-500" />}
          title="Recent Activity"
          value={adminStats.recentActivity?.toLocaleString() || "0"}
          colorClass="bg-blue-100"
          subtitle="past 24 hours"
        />
        <div className="flex items-center justify-center sm:col-span-2 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4">
          <button
            onClick={generateDashboardReport}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 disabled:opacity-70"
          >
            {isGeneratingReport ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="font-medium">Generating...</span>
              </>
            ) : (
              <>
                <FiDownload className="w-5 h-5" />
                <span className="font-medium">Export Statistics Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Pet Distribution */}
        <ChartCard title="Pet Distribution">
          <div className="h-80">
            {adminStats.petDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adminStats.petDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {adminStats.petDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pets`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  No pet distribution data available
                </p>
              </div>
            )}
          </div>
        </ChartCard>

        {/* Adoption Trends */}
        <ChartCard title="Adoption Trends">
          <div className="h-80">
            {adminStats.adoptionTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adminStats.adoptionTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="adoptions"
                    name="Completed Adoptions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    name="Adoption Requests"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  No adoption trend data available
                </p>
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
        <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Pets per Shelter</span>
              <span className="font-medium text-lg">
                {adminStats.totalShelters
                  ? (adminStats.totalPets / adminStats.totalShelters).toFixed(1)
                  : "0"}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (adminStats.totalPets / (adminStats.totalShelters || 1)) *
                      10
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adoption Success Rate</span>
              <span className="font-medium text-lg">
                {adminStats.totalPets
                  ? Math.round(
                      (adminStats.totalAdoptions / adminStats.totalPets) * 100
                    )
                  : "0"}
                %
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (adminStats.totalAdoptions / (adminStats.totalPets || 1)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Engagement</span>
              <span className="font-medium text-lg">
                {adminStats.totalUsers
                  ? Math.round(
                      (adminStats.recentActivity / adminStats.totalUsers) * 100
                    )
                  : "0"}
                %
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (adminStats.recentActivity / (adminStats.totalUsers || 1)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, colorClass, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );
}