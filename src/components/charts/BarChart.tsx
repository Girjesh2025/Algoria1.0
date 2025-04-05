import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartDataPoint } from '../../models/types';

interface BarChartProps {
  data: ChartDataPoint[];
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  fill?: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendName?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisDataKey = 'x',
  yAxisDataKey = 'y',
  fill = '#8884d8',
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
        <RechartsBarChart
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
          <Bar
            dataKey={yAxisDataKey}
            fill={fill}
            name={legendName}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
