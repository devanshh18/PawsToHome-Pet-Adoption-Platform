import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  FiCheckSquare, FiUsers, FiHome, FiPieChart, FiActivity, 
  FiBarChart2, FiFileText, FiDownload, FiDatabase 
} from 'react-icons/fi';
import adminService from '../../features/admin/adminService';
import { fetchInsights } from '../../features/admin/adminSlice';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';

// Changed from purple to blue color palette to match the other tabs
const COLORS = ['#3b82f6', '#0ea5e9', '#60a5fa', '#10b981', '#f59e0b', '#ef4444'];

export default function InsightsTab() {
  const dispatch = useDispatch();
  const { insights: insightsData, isLoading, isError, errorMessage } = useSelector((state) => state.admin);
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('adoptions');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  useEffect(() => {
    // Fetch insights data whenever timeRange changes
    dispatch(fetchInsights(timeRange));
  }, [timeRange, dispatch]);
  
  const generateReport = async (type) => {
    if (isGeneratingReport) return;
    
    setReportType(type);
    setIsGeneratingReport(true);
    
    try {
      // Use adminService instead of direct fetch
      const response = await adminService.generateReport(type, { timeRange });
      
      // Create a download from the blob response
      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Set filename based on report type
      let filename = '';
      switch (type) {
        case 'adoptions':
          filename = `adoption-report-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'users':
          filename = `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'shelters':
          filename = `shelter-performance-report-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        default:
          filename = `pet-adoption-data-export-${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded successfully`);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error(`Failed to generate ${type} report: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  
  const handleRefresh = () => {
    toast.info('Refreshing insights data...');
    dispatch(fetchInsights(timeRange));
  };
  
  if (isLoading && !insightsData) {
    return <LoadingSpinner />;
  }
  
  if (isError || !insightsData) {
    return (
      <ErrorAlert
        title="Insights Data Unavailable"
        message={errorMessage || "We couldn't load the insights data. Please try again."}
        retryAction={handleRefresh}
        retryText="Retry"
      />
    );
  }
  
  return (
    <div className="p-6 space-y-8">
      {/* Header with time range selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Insights</h2>
          <p className="text-gray-500 mt-1">Discover adoption trends and platform metrics</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Time Range:</span>
            <select 
              className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none text-gray-700 font-medium"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Adoptions"
          value={insightsData.totalAdoptions}
          icon={<FiCheckSquare className="w-5 h-5 text-blue-500" />}
          change={"+18%"}
        />
        <SummaryCard
          title="Active Users"
          value={insightsData.totalUsers}
          icon={<FiUsers className="w-5 h-5 text-blue-500" />}
          change={"+24%"}
        />
        <SummaryCard
          title="Partner Shelters"
          value={insightsData.totalShelters}
          icon={<FiHome className="w-5 h-5 text-blue-500" />}
          change={"+7%"}
        />
        <SummaryCard
          title="Available Pets"
          value={insightsData.totalPets}
          icon={<FiActivity className="w-5 h-5 text-green-500" />}
          change={"-3%"}
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Adoption Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Adoption Trend</h3>
          <div className="h-80">
            {insightsData.adoptionsByMonth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={insightsData.adoptionsByMonth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No adoption trend data available for the selected period</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Pet Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Pet Category Distribution</h3>
          <div className="h-80">
            {insightsData.petCategoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insightsData.petCategoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {insightsData.petCategoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} adoptions`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No pet category data available for the selected period</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Age Group Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Age Group Distribution</h3>
          <div className="h-80">
            {insightsData.ageGroupDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insightsData.ageGroupDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} adoptions`, 'Count']} />
                  <Bar 
                    dataKey="value" 
                    name="Adoptions" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No age group data available for the selected period</p>
              </div>
            )}
          </div>
        </div>
        
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-80">
            {insightsData.userGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={insightsData.userGrowth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    name="Users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="shelters" 
                    name="Shelters" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No user growth data available for the selected period</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Charts & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Shelters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Shelters</h3>
          <div className="h-80">
            {insightsData.topSheltersByAdoption?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insightsData.topSheltersByAdoption}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} adoptions`, 'Count']} />
                  <Bar 
                    dataKey="count" 
                    fill="#10b981" 
                    radius={[0, 4, 4, 0]}
                    name="Adoptions"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No shelter data available for the selected period</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Time Till Adoption */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Time Till Adoption</h3>
          <div className="h-80">
            {insightsData.timeTillAdoption?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insightsData.timeTillAdoption}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} adoptions`, 'Count']} />
                  <Bar 
                    dataKey="count" 
                    name="Adoptions" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No adoption time data available for the selected period</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reports */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics Reports</h3>
        <p className="text-gray-500 mb-6">Generate detailed reports of platform activity and adoption metrics</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportCard
            title="Adoption Report"
            description="Detailed adoption metrics and success rates"
            icon={<FiBarChart2 className="w-5 h-5 text-blue-500" />}
            buttonAction={() => generateReport('adoptions')}
            isLoading={isGeneratingReport && reportType === 'adoptions'}
          />
          
          <ReportCard
            title="User Activity"
            description="User engagement and interaction metrics"
            icon={<FiUsers className="w-5 h-5 text-blue-500" />}
            buttonAction={() => generateReport('users')}
            isLoading={isGeneratingReport && reportType === 'users'}
          />
          
          <ReportCard
            title="Shelter Performance"
            description="Metrics on shelter performance and response times"
            icon={<FiDatabase className="w-5 h-5 text-blue-500" />}
            buttonAction={() => generateReport('shelters')}
            isLoading={isGeneratingReport && reportType === 'shelters'}
          />
          
          <ReportCard
            title="Full Data Export"
            description="Complete data export (CSV) for offline analysis"
            icon={<FiDownload className="w-5 h-5 text-green-500" />}
            buttonAction={() => generateReport('full')}
            isLoading={isGeneratingReport && reportType === 'full'}
          />
        </div>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Engagement Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Login Frequency</span>
                <span className="font-medium text-gray-800">
                  {Math.round((insightsData.totalUsers * 0.7))} weekly active users
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Application Completion</span>
                <span className="font-medium text-gray-800">85% completion rate</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mobile Usage</span>
                <span className="font-medium text-gray-800">62% of platform traffic</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Session Duration</span>
                <span className="font-medium text-gray-800">9.5 min avg. session</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Platform Highlights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Highlights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-blue-100">
                  <FiCheckSquare className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800">Adoption Rate</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((insightsData.totalAdoptions / (insightsData.totalPets || 1)) * 100)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">of listed pets find homes</p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-blue-100">
                  <FiPieChart className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800">Processing Time</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900">8.2</p>
              <p className="text-sm text-gray-500 mt-1">days avg. to adoption</p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-blue-100">
                  <FiFileText className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800">Return Rate</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900">3.8%</p>
              <p className="text-sm text-gray-500 mt-1">pets returned after adoption</p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-blue-100">
                  <FiHome className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800">Shelter Growth</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900">+{Math.round(insightsData.totalShelters * 0.05)}</p>
              <p className="text-sm text-gray-500 mt-1">new shelters this {timeRange}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, change }) {
  const isPositive = change && change.includes('+');
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value?.toLocaleString() || 0}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg h-fit">{icon}</div>
      </div>
      {change && (
        <div className="mt-3">
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change} {isPositive ? 'increase' : 'decrease'}
          </span>
          <span className="text-xs text-gray-500 ml-1">since last period</span>
        </div>
      )}
    </div>
  );
}

function ReportCard({ title, description, icon, buttonAction, isLoading }) {
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <h4 className="ml-3 font-medium text-gray-800">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-4 h-12">{description}</p>
      <button 
        onClick={buttonAction}
        disabled={isLoading}
        className="w-full py-2.5 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 text-sm font-medium shadow-sm transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating</span>
          </>
        ) : (
          <>
            <FiDownload className="w-4 h-4" />
            <span>Generate</span>
          </>
        )}
      </button>
    </div>
  );
}