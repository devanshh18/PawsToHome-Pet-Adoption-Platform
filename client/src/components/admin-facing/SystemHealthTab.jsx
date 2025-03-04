import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FiCpu, FiDatabase, FiServer, FiAlertTriangle, 
  FiClock, FiRefreshCw, FiCheckCircle, FiXCircle, FiActivity 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';
import { fetchSystemHealth, fetchSystemHistory, resetAdminState } from '../../features/admin/adminSlice';

// Blue color palette
const COLORS = ['#3b82f6', '#0ea5e9', '#ef4444', '#10b981', '#f59e0b'];
const STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown'
};

export default function SystemHealthTab() {
  const dispatch = useDispatch();
  const { systemHealth, systemHistory, isLoading, isError, errorMessage } = useSelector((state) => state.admin);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');
  
  useEffect(() => {
    // Initial data fetch
    dispatch(fetchSystemHealth());
    dispatch(fetchSystemHistory(timeframe));
    
    // Set up polling interval for health data refresh (every 30 seconds)
    const interval = setInterval(() => {
      silentRefresh();
    }, 30000);
    
    return () => {
      clearInterval(interval);
      dispatch(resetAdminState());
    };
  }, [dispatch]);
  
  const silentRefresh = () => {
    setRefreshing(true);
    dispatch(fetchSystemHealth())
      .unwrap()
      .catch(() => {
        // Silent refresh fails silently
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  
  const refreshData = () => {
    setRefreshing(true);
    toast.info('Refreshing system health data...');
    
    dispatch(fetchSystemHealth())
      .unwrap()
      .then(() => {
        dispatch(fetchSystemHistory(timeframe));
      })
      .catch((error) => {
        toast.error(error || 'Failed to refresh system health data');
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  
  const fetchHistoryData = (period) => {
    setTimeframe(period);
    dispatch(fetchSystemHistory(period))
      .unwrap()
      .catch((error) => {
        toast.error(error || `Failed to fetch ${period} history data`);
      });
  };
  
  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case STATUS.HEALTHY: return 'text-green-500';
      case STATUS.WARNING: return 'text-amber-500';
      case STATUS.CRITICAL: return 'text-red-500';
      default: return 'text-gray-400';
    }
  };
  
  const getStatusBgColor = (status) => {
    switch (status) {
      case STATUS.HEALTHY: return 'bg-green-100';
      case STATUS.WARNING: return 'bg-amber-100';
      case STATUS.CRITICAL: return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case STATUS.HEALTHY: return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case STATUS.WARNING: return <FiAlertTriangle className="w-5 h-5 text-amber-500" />;
      case STATUS.CRITICAL: return <FiXCircle className="w-5 h-5 text-red-500" />;
      default: return <FiActivity className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const getSystemStatusIndicator = () => {
    if (!systemHealth) return null;
    
    const hasWarnings = systemHealth.services.some(s => s.status === STATUS.WARNING);
    const hasCritical = systemHealth.services.some(s => s.status === STATUS.CRITICAL);
    
    let status = STATUS.HEALTHY;
    if (hasWarnings) status = STATUS.WARNING;
    if (hasCritical) status = STATUS.CRITICAL;
    
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          status === STATUS.HEALTHY ? 'bg-green-500' : 
          status === STATUS.WARNING ? 'bg-amber-500' : 
          'bg-red-500'
        }`}></div>
        <span className="font-medium">
          {status === STATUS.HEALTHY ? 'All Systems Operational' : 
           status === STATUS.WARNING ? 'Some Issues Detected' : 
           'Critical Issues Detected'}
        </span>
      </div>
    );
  };
  
  if (isLoading && !refreshing) {
    return <LoadingSpinner />;
  }
  
  if (isError || !systemHealth) {
    return (
      <ErrorAlert
        title="System Health Data Unavailable"
        message={errorMessage || "We couldn't load the system health data. Please try again."}
        retryAction={refreshData}
        retryText="Retry"
      />
    );
  }
  
  return (
    <div className="p-6 space-y-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">System Health</h2>
          <div className="mt-1">
            {getSystemStatusIndicator()}
          </div>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          disabled={refreshing}
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Server Uptime" 
          value={systemHealth.uptime}
          icon={<FiServer className="w-5 h-5 text-blue-500" />}
          subtitle={`Last restart: ${new Date(systemHealth.lastRestart).toLocaleString()}`}
          colorClass="bg-blue-100"
        />
        <StatCard 
          title="API Response Time" 
          value={systemHealth.apiHealth.avgResponseTime}
          icon={<FiClock className="w-5 h-5 text-blue-500" />}
          subtitle={`${systemHealth.apiHealth.requests.total.toLocaleString()} requests processed`}
          colorClass="bg-blue-100"
        />
        <StatCard 
          title="Database" 
          value={`${systemHealth.databaseHealth.connections} connections`}
          icon={<FiDatabase className="w-5 h-5 text-emerald-500" />}
          subtitle={`${systemHealth.databaseHealth.slowQueries} slow queries detected`}
          colorClass="bg-emerald-100"
        />
        <StatCard 
          title="Cache Hit Rate" 
          value={`${systemHealth.cacheHealth.hitRate}%`}
          icon={<FiCpu className="w-5 h-5 text-amber-500" />}
          subtitle={`${systemHealth.cacheHealth.missRate}% cache miss rate`}
          colorClass="bg-amber-100"
        />
      </div>
      
      {/* Resource Utilization */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Resource Utilization</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <ResourceMeter 
              label="CPU Usage" 
              value={systemHealth.serverLoad.cpu} 
              color={COLORS[0]}
              warningThreshold={70}
              criticalThreshold={90}
            />
            <ResourceMeter 
              label="Memory Usage" 
              value={systemHealth.serverLoad.memory} 
              color={COLORS[0]}
              warningThreshold={70}
              criticalThreshold={90}
            />
            <ResourceMeter 
              label="Disk Usage" 
              value={systemHealth.serverLoad.disk} 
              color={COLORS[3]}
              warningThreshold={80}
              criticalThreshold={90}
            />
            <ResourceMeter 
              label="Network" 
              value={systemHealth.serverLoad.network} 
              color={COLORS[4]}
              warningThreshold={70}
              criticalThreshold={90}
            />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'CPU', value: systemHealth.serverLoad.cpu },
                    { name: 'Memory', value: systemHealth.serverLoad.memory },
                    { name: 'Disk', value: systemHealth.serverLoad.disk },
                    { name: 'Network', value: systemHealth.serverLoad.network }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                  <Cell fill={COLORS[3]} />
                  <Cell fill={COLORS[4]} />
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Historical Data */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold">Performance History</h3>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button 
              onClick={() => fetchHistoryData('24h')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === '24h' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              24 Hours
            </button>
            <button 
              onClick={() => fetchHistoryData('7d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === '7d' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button 
              onClick={() => fetchHistoryData('30d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeframe === '30d' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
        
        {systemHistory && systemHistory.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={systemHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke={COLORS[0]} strokeWidth={2} dot={false} />
                  <Line yAxisId="left" type="monotone" dataKey="memory" name="Memory Usage (%)" stroke={COLORS[1]} strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="responseTime" name="Avg. Response Time (ms)" stroke={COLORS[3]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={systemHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="requests" name="Requests" fill={COLORS[0]} />
                  <Bar yAxisId="right" dataKey="errors" name="Errors" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No historical data available for the selected time period.</p>
          </div>
        )}
      </div>
      
      {/* Services Status */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Services Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemHealth.services.length > 0 ? (
            systemHealth.services.map((service) => (
              <div key={service.name} className="border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(service.status)}
                  <div className="ml-3">
                    <p className="font-medium">{service.name}</p>
                    {service.message && (
                      <p className="text-sm text-gray-500">{service.message}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBgColor(service.status)} ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No services information available.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Errors */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
        {systemHealth.errors && systemHealth.errors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Message</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {systemHealth.errors.map((error, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(error.timestamp).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{error.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{error.count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        error.severity === 'high' ? 'bg-red-100 text-red-800' :
                        error.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {error.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-green-50 rounded-lg">
            <FiCheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-green-800 mb-1">No errors detected</h4>
            <p className="text-green-600">The system is running smoothly with no recorded errors</p>
          </div>
        )}
      </div>

      {/* Maintenance Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MaintenanceCard 
            title="Clear Cache" 
            description="Clear application cache to free up memory"
            icon={<FiRefreshCw className="h-5 w-5 text-blue-500" />}
            buttonText="Clear Cache"
            buttonAction={() => {
              // In a real app, this would call an API to clear the cache
              toast.success('Cache cleared successfully');
            }}
          />
          <MaintenanceCard 
            title="Database Backup" 
            description="Create a backup of the current database"
            icon={<FiDatabase className="h-5 w-5 text-blue-500" />}
            buttonText="Create Backup"
            buttonAction={() => {
              // In a real app, this would call an API to create a backup
              toast.success('Database backup initiated');
            }}
          />
          <MaintenanceCard 
            title="Error Logs" 
            description="Download detailed error logs for debugging"
            icon={<FiAlertTriangle className="h-5 w-5 text-amber-500" />}
            buttonText="Download Logs"
            buttonAction={() => {
              // In a real app, this would download log files
              toast.info('Preparing logs for download...');
              setTimeout(() => {
                toast.success('Logs ready for download');
                // Code to trigger download would go here
              }, 1500);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, colorClass }) {
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

function ResourceMeter({ label, value, color, warningThreshold = 70, criticalThreshold = 90 }) {
  const getBarColor = (val) => {
    if (val >= criticalThreshold) return COLORS[2]; // Red
    if (val >= warningThreshold) return COLORS[4]; // Amber
    return color;
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${
          value >= criticalThreshold ? 'text-red-600' :
          value >= warningThreshold ? 'text-amber-600' : 'text-gray-700'
        }`}>{value}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full" 
          style={{ 
            width: `${value}%`, 
            backgroundColor: getBarColor(value)
          }}
        ></div>
      </div>
    </div>
  );
}

function MaintenanceCard({ title, description, icon, buttonText, buttonAction }) {
  return (
    <div className="border rounded-xl p-5">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <h4 className="ml-3 font-medium text-gray-800">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button 
        onClick={buttonAction}
        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {buttonText}
      </button>
    </div>
  );
}