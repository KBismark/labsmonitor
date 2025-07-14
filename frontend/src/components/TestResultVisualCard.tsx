
import { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../config/axios';

interface TestRecord {
  id: string;
  userId: string;
  testCategory: string;
  testType: string;
  testValue: number;
  unit: string;
  minRange?: number;
  maxRange?: number;
  testDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type SelectedTest = {
  category: string;
  test: {
      name: string;
      unit: string;
      id: string;
  }
}

export default function TestResultVisualCard({ testData }: { testData: SelectedTest }) {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('6 months ago');

  // Calculate date range based on filter
  const getDateRange = (filter: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (filter) {
      case 'Last 30 days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'Last 3 months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'Last 6 months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'Last 1 year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'Last 2 years':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate.setMonth(now.getMonth() - 6); // Default to 6 months
    }
    
    return { startDate, endDate: now };
  };

  useEffect(() => {
    const fetchTestRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch records for the specific test type within the category
        const response = await api.get(`/api/test-records/category/${testData.category}`);
        const allRecords = response.data;
        
        // Get date range for filtering
        const { startDate, endDate } = getDateRange(dateFilter);
        
        // Filter by test type and date range
        const filteredRecords = allRecords
          .filter((record: TestRecord) => {
            const recordDate = new Date(record.testDate);
            return record.testType === testData.test.name && 
                   recordDate >= startDate && 
                   recordDate <= endDate;
          })
          .sort((a: TestRecord, b: TestRecord) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
        
        setRecords(filteredRecords);
      } catch (err) {
        console.error('Error fetching test records:', err);
        setError('Failed to load test records');
      } finally {
        setLoading(false);
      }
    };

    if (testData.category && testData.test.name) {
      fetchTestRecords();
    }
  }, [testData.category, testData.test.name, dateFilter]);

  // Transform records for the chart
  const chartData = records.map(record => ({
    name: new Date(record.testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: record.testValue,
    range: record.minRange && record.maxRange ? [record.minRange, record.maxRange] : [0, 0],
    date: record.testDate,
  }));

  return (
    <section className="bg-[#111827] mb-12">
      <div className='px-2 lg:px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-end flex-wrap gap-3'>
        <div className="">
            <h2 className="text-lg font-semibold text-gray-900">{testData.test.name}</h2>
            <p className="text-xs text-gray-500">{testData.category}</p>
        </div>
        {/* Filter by date (1 month ago, 3 months ago, 6 months ago, 1 year ago, 2 years ago, 5 years ago) selection */}
        <div className="flex items-center gap-2">
          <select 
            title="Filter by date" 
            className="border border-gray-300 rounded-md p-1"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 3 months">Last 3 months</option>
            <option value="Last 6 months">Last 6 months</option>
            <option value="Last 1 year">Last 1 year</option>  
            <option value="Last 2 years">Last 2 years</option>
          </select>
        </div>
      </div>
      <div className="pb-6 pt-3">
        {
          loading ? (
            <div className="w-full h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading test records...</div>
          </div>
          ) : error ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          ) : records.length === 0 ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-gray-500">No test records found for {testData.test.name}</div>
            </div>
          ) : (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  {/* <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-gray-600">
                              Value: {data.value} {testData.test.unit}
                            </p>
                            {data.range[0] !== 0 && data.range[1] !== 0 && (
                              <p className="text-sm text-gray-600">
                                Range: {data.range[0]} - {data.range[1]} {testData.test.unit}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="range"
                    stroke="none"
                    fill="#023745"
                    connectNulls
                    dot={false}
                    activeDot={false}
                  />
                  <Line type="natural" dataKey="value" stroke="#3b82f6" connectNulls />
                  <Legend />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )
        }
      </div>
    </section>
  );
}







