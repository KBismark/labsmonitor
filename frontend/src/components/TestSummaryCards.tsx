import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Droplets, 
  Brain,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const TestSummaryCards = () => {
  const summaryData = [
    {
      title: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      trend: 'stable',
      icon: Heart,
      bgGradient: 'from-red-500 to-pink-500',
      change: '+2.1%'
    },
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      trend: 'up',
      icon: Activity,
      bgGradient: 'from-blue-500 to-cyan-500',
      change: '+5.2%'
    },
    {
      title: 'Blood Sugar',
      value: '95',
      unit: 'mg/dL',
      status: 'normal',
      trend: 'down',
      icon: Droplets,
      bgGradient: 'from-green-500 to-emerald-500',
      change: '-3.1%'
    },
    {
      title: 'Cholesterol',
      value: '180',
      unit: 'mg/dL',
      status: 'normal',
      trend: 'stable',
      icon: Brain,
      bgGradient: 'from-purple-500 to-indigo-500',
      change: '+1.2%'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Header with gradient background */}
          <div className={`bg-gradient-to-r ${item.bgGradient} p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="h-6 w-6" />
                <h3 className="font-semibold">{item.title}</h3>
              </div>
              {getTrendIcon(item.trend)}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-3xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">{item.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Change</div>
                <div className={`text-sm font-medium ${
                  item.trend === 'up' ? 'text-green-600' : 
                  item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {item.change}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestSummaryCards;