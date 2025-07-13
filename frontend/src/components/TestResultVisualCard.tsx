
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

const data = [
  {
    name: "Jan",
    value: 0,
    range: [0, 0],
  },
  {
    name: "Feb",
    value: 106,
    range: [50, 300],
  },
  {
    name: "Mar",
    value: 423,
    range: [150, 423],
  },
  {
    name: "Apr",
    value: 312,
    range: [200, 400],
  },
  {
    name: "May",
    value: 451,
    range: [367, 678],
  },
  {
    name: "Jun",
    value: 623,
    range: [305, 821],
  },
];



export default function TestResultVisualCard() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
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
          <Tooltip />
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
  );
}







