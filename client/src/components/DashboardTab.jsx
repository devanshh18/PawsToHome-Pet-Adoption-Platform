import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaPaw, FaDog, FaCat, FaHome, FaDove } from 'react-icons/fa';
import { fetchShelterPets } from '../features/pets/petSlice';
import LoadingSpinner from './LoadingSpinner';

const COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'];

export default function DashboardTab() {
  const dispatch = useDispatch();
  const { pets, isLoading } = useSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchShelterPets());
  }, [dispatch]);

  const stats = {
    totalPets: pets.length,
    adoptedPets: pets.filter(pet => pet.status === 'Adopted').length,
    dogs: pets.filter(pet => pet.species === 'Dog').length,
    cats: pets.filter(pet => pet.species === 'Cat').length,
    others: pets.filter(pet => !['Dog', 'Cat'].includes(pet.species)).length,
  };

  const chartData = [
    { name: 'Dogs', value: stats.dogs },
    { name: 'Cats', value: stats.cats },
    { name: 'Others', value: stats.others },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={<FaPaw className="w-6 h-6" />} title="Total Pets" value={stats.totalPets} />
        <StatCard icon={<FaHome className="w-6 h-6" />} title="Adopted" value={stats.adoptedPets} />
        <StatCard icon={<FaDog className="w-6 h-6" />} title="Dogs" value={stats.dogs} />
        <StatCard icon={<FaCat className="w-6 h-6" />} title="Cats" value={stats.cats} />
        <StatCard icon={<FaDove className="w-6 h-6" />} title="Others" value={stats.others} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Pet Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Adoption Trends">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pets.slice(0, 6)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="age.years" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-xl">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}