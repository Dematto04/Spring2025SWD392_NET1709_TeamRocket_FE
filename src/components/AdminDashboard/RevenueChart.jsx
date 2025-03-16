import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Activity,
  Calendar1Icon
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetRevenueChartDataQuery } from "@/redux/api/adminApi";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [chartConfig, setChartConfig] = useState({
    type: "year",
    yearStart: new Date().getFullYear(),
    monthStart: new Date().getMonth() + 1,
    dayStart: new Date().getDate(),
    yearEnd: new Date().getFullYear(),
    monthEnd: new Date().getMonth() + 1,
    dayEnd: new Date().getDate(),
  });

  // Add state for date pickers
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

    // Add the revenue chart query
    const queryParams = {
      dayChart: chartConfig.type === "day",
      weekChart: chartConfig.type === "week",
      yearChart: chartConfig.type === "year",
      yearsChart: chartConfig.type === "years",
      yearStart: chartConfig.type === "day" ? startDate.getFullYear() : chartConfig.yearStart,
      monthStart: chartConfig.type === "day" ? startDate.getMonth() + 1 : chartConfig.monthStart,
      dayStart: chartConfig.type === "day" ? startDate.getDate() : chartConfig.dayStart,
      yearEnd: chartConfig.type === "day" ? endDate.getFullYear() : chartConfig.yearEnd,
      monthEnd: chartConfig.type === "day" ? endDate.getMonth() + 1 : chartConfig.monthEnd,
      dayEnd: chartConfig.type === "day" ? endDate.getDate() : chartConfig.dayEnd,
    };
  
    const { data: revenueChartData, isLoading: isChartLoading } = useGetRevenueChartDataQuery(queryParams);
  
    // Add handlers for chart controls
    const handleChartTypeChange = (value) => {
      setChartConfig(prev => ({
        ...prev,
        type: value
      }));
    };
  
    const handleYearChange = (value) => {
      setChartConfig(prev => ({
        ...prev,
        yearStart: parseInt(value)
      }));
    };

  return (
    <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription>Revenue trends over time</CardDescription>
                </div>
              </div>

              {/* Add Chart Controls */}
              <div className="flex flex-wrap gap-4">
                <div className="w-[200px]">
                  <Select
                    value={chartConfig.type}
                    onValueChange={handleChartTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Daily View</SelectItem>
                      <SelectItem value="week">Weekly View</SelectItem>
                      <SelectItem value="year">Yearly View</SelectItem>
                      <SelectItem value="years">Multi-Year View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {chartConfig.type === "day" ? (
                  // Date Range Pickers for Daily View
                  <>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[200px] justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar1Icon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date || new Date());
                              if (date && date > endDate) {
                                setEndDate(date);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <span className="text-muted-foreground">to</span>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[200px] justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar1Icon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>End date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => setEndDate(date || new Date())}
                            disabled={(date) =>
                              date < startDate || date > new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                ) : (
                  // Year Selector for other views
                  ["week", "year"].includes(chartConfig.type) && (
                    <div className="w-[150px]">
                      <Select
                        value={chartConfig.yearStart.toString()}
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: 5 },
                            (_, i) => new Date().getFullYear() - i
                          ).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              {isChartLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : revenueChartData?.data?.chartData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueChartData.data.chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#888888' }}
                      dy={10}
                      interval={chartConfig.type === "day" ? 2 : 0}
                      angle={chartConfig.type === "day" ? 45 : 0}
                      textAnchor={chartConfig.type === "day" ? "start" : "middle"}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#888888' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                      labelStyle={{ color: "#888888" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                      dot={{
                        stroke: '#0ea5e9',
                        strokeWidth: 2,
                        fill: 'white',
                        r: 4,
                      }}
                      activeDot={{
                        stroke: '#0ea5e9',
                        strokeWidth: 2,
                        fill: 'white',
                        r: 6,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>

            {/* Revenue Summary Stats */}
            {revenueChartData?.data?.chartData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ${calculateTotal(revenueChartData.data.chartData).toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    {chartConfig.type === "day" ? "Daily" : "Monthly"} Average
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    ${calculateAverage(revenueChartData.data.chartData).toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Highest Revenue</p>
                  <p className="text-2xl font-bold text-purple-700">
                    ${findHighest(revenueChartData.data.chartData).toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Active Periods</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {countActivePeriods(revenueChartData.data.chartData)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
  );
}

// Utility functions
const calculateTotal = (data) => {
  return data.reduce((sum, item) => sum + item.revenue, 0);
};

const calculateAverage = (data) => {
  const activePeriods = data.filter(item => item.revenue >= 0).length;
  const total = calculateTotal(data);
  return activePeriods ? Math.round(total / activePeriods) : 0;
};

const findHighest = (data) => {
  return Math.max(...data.map(item => item.revenue));
};

const countActivePeriods = (data) => {
  return data.filter(item => item.revenue >= 0).length;
};

export default RevenueChart;
