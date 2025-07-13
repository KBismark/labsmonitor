import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Plus, 
  BarChart3, 
  User, 
  LogOut,
  Activity,
  TrendingUp,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TestSummaryCards from '../components/TestSummaryCards';
import TestVisualization from '../components/TestVisualization';
import AddTestRecord from '../components/AddTestRecord';
import { Footer } from './LandingPage';
import { TestResultsVisualizationPage } from './TestResultsVisualizationPage';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tests', label: 'Test Records', icon: Activity },
    // { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'add', label: 'Add Record', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Labs Monitor</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 bg-white">
        {/* Welcome Section */}
        <div className="pb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Track and analyze your medical test results with comprehensive insights.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white sticky top-16 z-10">
         {/* Tab Navigation */}
         <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex lg:space-x-8 space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className='lg:block hidden'>{tab.label}</span>
                <span className='lg:hidden block'>{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <TestSummaryCards />
              <div className="bg-white rounded-lg shado">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Test Results</h2>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Export</span>
                    </button>
                  </div>
                </div>
                <div className="pr-6 pt-3 pb-6 bg-[#f0f8ff4d]">
                  <TestVisualization />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <TestResultsVisualizationPage />
          )}

          {activeTab === 'trends' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Health Trends</h2>
              </div>
              <div className="p-6">
                <TestVisualization showTrends={true} />
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Add New Test Record</h2>
              </div>
              <div className="p-6">
                <AddTestRecord />
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;