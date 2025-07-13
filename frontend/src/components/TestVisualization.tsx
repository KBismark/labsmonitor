import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';

interface TestVisualizationProps {
  showFilters?: boolean;
  showTrends?: boolean;
}

const TestVisualization: React.FC<TestVisualizationProps> = ({ showFilters = false, showTrends = false }) => {
  const [timeRange, setTimeRange] = useState('3months');
  const [selectedTest, setSelectedTest] = useState('all');
  const [chartType, setChartType] = useState('line');

  // Sample data for different test types
  const testData = [
    { date: '2024-01', glucose: 95, cholesterol: 180, hb: 14.2, creatinine: 1.1 },
    { date: '2024-02', glucose: 98, cholesterol: 175, hb: 14.0, creatinine: 1.0 },
    { date: '2024-03', glucose: 92, cholesterol: 170, hb: 14.5, creatinine: 1.2 },
    { date: '2024-04', glucose: 89, cholesterol: 165, hb: 14.1, creatinine: 1.1 },
    { date: '2024-05', glucose: 94, cholesterol: 172, hb: 14.3, creatinine: 1.0 },
    { date: '2024-06', glucose: 91, cholesterol: 168, hb: 14.4, creatinine: 1.1 }
  ];

  const pieData = [
    { name: 'Normal', value: 85, color: '#10B981' },
    { name: 'High', value: 10, color: '#EF4444' },
    { name: 'Low', value: 5, color: '#F59E0B' }
  ];

  const testTypes = [
    { value: 'all', label: 'All Tests' },
    { value: 'glucose', label: 'Glucose' },
    { value: 'cholesterol', label: 'Cholesterol' },
    { value: 'hb', label: 'Hemoglobin' },
    { value: 'creatinine', label: 'Creatinine' }
  ];

  const timeRanges = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getUnit = (testType: string) => {
    switch (testType) {
      case 'glucose':
        return 'mg/dL';
      case 'cholesterol':
        return 'mg/dL';
      case 'hb':
        return 'g/dL';
      case 'creatinine':
        return 'mg/dL';
      default:
        return '';
    }
  };

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={testData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(selectedTest === 'all' || selectedTest === 'glucose') && (
              <Line 
                type="monotone" 
                dataKey="glucose" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Glucose"
              />
            )}
            {(selectedTest === 'all' || selectedTest === 'cholesterol') && (
              <Line 
                type="monotone" 
                dataKey="cholesterol" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Cholesterol"
              />
            )}
            {(selectedTest === 'all' || selectedTest === 'hb') && (
              <Line 
                type="monotone" 
                dataKey="hb" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                name="Hemoglobin"
              />
            )}
            {(selectedTest === 'all' || selectedTest === 'creatinine') && (
              <Line 
                type="monotone" 
                dataKey="creatinine" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                name="Creatinine"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={testData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(selectedTest === 'all' || selectedTest === 'glucose') && (
              <Bar dataKey="glucose" fill="#10B981" name="Glucose" />
            )}
            {(selectedTest === 'all' || selectedTest === 'cholesterol') && (
              <Bar dataKey="cholesterol" fill="#3B82F6" name="Cholesterol" />
            )}
            {(selectedTest === 'all' || selectedTest === 'hb') && (
              <Bar dataKey="hb" fill="#EF4444" name="Hemoglobin" />
            )}
            {(selectedTest === 'all' || selectedTest === 'creatinine') && (
              <Bar dataKey="creatinine" fill="#F59E0B" name="Creatinine" />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {testTypes.map((test) => (
                <option key={test.value} value={test.value}>
                  {test.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              {chartTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setChartType(type.value)}
                  className={`px-3 py-2 text-sm flex items-center space-x-2 ${
                    chartType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-transparent rounded-lg">
        {renderChart()}
      </div>

      {/* Trends Summary */}
      {showTrends && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Glucose levels trending downward (Good)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Cholesterol within normal range</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Hemoglobin levels stable</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Creatinine needs monitoring</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestVisualization;