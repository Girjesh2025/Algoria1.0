import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartDataPoint } from '../../models/types';

interface LineChartProps {
  data: ChartDataPoint[];
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  stroke?: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendName?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisDataKey = 'x',
  yAxisDataKey = 'y',
  stroke = '#8884d8',
  title,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  legendName = 'Value'
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
            width={40}
          />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey={yAxisDataKey}
            stroke={stroke}
            activeDot={{ r: 6 }}
            name={legendName}
            strokeWidth={2}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
