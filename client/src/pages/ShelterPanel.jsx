import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FiLogOut, FiHome, FiPlusCircle, FiList, FiUsers, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import DashboardTab from '../components/DashboardTab';
import PetCreate from '../components/PetCreate';
import PetList from '../components/PetList';
import AdoptionRequestsTab from '../components/AdoptionRequestsTab';
import ShelterProfile from '../components/ShelterProfile';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from '../assets/logo.jpg';

export default function ShelterPanel() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { name: 'Dashboard', icon: FiHome },
    { name: 'List Pet', icon: FiPlusCircle },
    { name: 'My Pets', icon: FiList },
    { name: 'Adoption Requests', icon: FiUsers },
    { name: 'Profile', icon: FiUser }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (user) setIsLoading(false);
  }, [user]);

  // if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 relative">
      {isLoading && <LoadingSpinner />}
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="PawsToHome" className="h-10 w-auto rounded-lg shadow-sm" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PawsToHome
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-sm font-medium text-gray-900">{user?.shelterName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <Tab.Group>
        <Tab.List className="flex space-x-2 pb-4 overflow-x-auto scrollbar-hide sticky top-20 bg-gradient-to-br from-gray-50 to-indigo-50 z-30">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `flex items-center gap-2 w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all ${
                    selected
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6 relative min-h-[600px]">
            {tabs.map((tab, idx) => (
              <Tab.Panel key={tab} className="animate-fade-in relative">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  {idx === 0 && <DashboardTab />}
                  {idx === 1 && <PetCreate />}
                  {idx === 2 && <PetList />}
                  {idx === 3 && <AdoptionRequestsTab />}
                  {idx === 4 && <ShelterProfile />}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </main>
      </div>
  );
}