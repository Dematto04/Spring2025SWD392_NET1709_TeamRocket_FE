import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Button } from '../ui/button'
import { 
    ArrowUp,
    ArrowDown,
    Clock,
    Calendar1Icon
  } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import {  useGetServiceCategoryChartQuery } from "@/redux/api/adminApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
export default function ServiceDistribution() {

  // Add state for date pickers
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Add states for chart type and dates
  const [chartType, setChartType] = useState("day"); // "day", "year", "years"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearRange, setYearRange] = useState({
    start: new Date().getFullYear(),
    end: new Date().getFullYear()
  });

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Create query parameters based on chart type
  const queryParams = {
    dayChart: chartType === "day",
    yearChart: chartType === "year",
    yearsChart: chartType === "years",
    ...(chartType === "day" && {
      dayStart: startDate.getDate(),
      monthStart: startDate.getMonth() + 1,
      yearStart: startDate.getFullYear(),
      dayEnd: endDate.getDate(),
      monthEnd: endDate.getMonth() + 1,
      yearEnd: endDate.getFullYear()
    }),
    ...(chartType === "year" && {
      yearStart: selectedYear,
      yearEnd: selectedYear
    }),
    ...(chartType === "years" && {
      yearStart: yearRange.start,
      yearEnd: yearRange.end
    })
  };

  // Fetch category data
  const { data: categoryResponse, isLoading: isCategoryLoading } = useGetServiceCategoryChartQuery(queryParams);
  // Define colors for each category
  const CATEGORY_COLORS = {
    Residential: '#0ea5e9',
    Gardening: '#10b981',
    Pool: '#f59e0b',
    Vehicle: '#ef4444',
    Electrical: '#8b5cf6',
    Removal: '#ec4899',
    Plumbing: '#14b8a6',
    Furniture: '#f97316'
  };

  // Filter out categories with zero bookings
  const categoryData = categoryResponse?.data?.chartData.filter(
    item => item.numberOfBookings >= 0
  ) || [];

  // Calculate total bookings
  const totalBookings = categoryData.reduce(
    (sum, item) => sum + item.numberOfBookings, 
    0
  );

  const renderTrendIndicator = (trend, isPositive) => (
    <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      {Math.abs(trend)}%
    </div>
  );
  return (
    <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Service Distribution
                  </CardTitle>
                  <CardDescription>Bookings by service category</CardDescription>
                </div>
              </div>

              {/* Chart Controls */}
              <div className="flex flex-wrap gap-4">
                <div className="w-[200px]">
                  <Select
                    value={chartType}
                    onValueChange={handleChartTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Daily View</SelectItem>
                      <SelectItem value="year">Yearly View</SelectItem>
                      <SelectItem value="years">Multi-Year View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {chartType === "day" ? (
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
                ) : chartType === "year" ? (
                  <div className="w-[150px]">
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(Number(value))}
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
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-[150px]">
                      <Select
                        value={yearRange.start.toString()}
                        onValueChange={(value) => 
                          setYearRange(prev => ({
                            ...prev,
                            start: Number(value)
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Start year" />
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

                    <span className="text-muted-foreground">to</span>

                    <div className="w-[150px]">
                      <Select
                        value={yearRange.end.toString()}
                        onValueChange={(value) => 
                          setYearRange(prev => ({
                            ...prev,
                            end: Number(value)
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="End year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: 5 },
                            (_, i) => yearRange.start + i
                          ).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-[400px] w-full">
              {isCategoryLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : categoryData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Category Legend - Now in a horizontal layout */}
                  <div className="flex flex-wrap gap-6 mb-8">
                    {categoryData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CATEGORY_COLORS[item.name] }}
                        />
                        <span className="text-sm">
                          {item.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({item.numberOfBookings})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pie Chart */}
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="numberOfBookings"
                          nameKey="name"
                        >
                          {categoryData.map((entry) => (
                            <Cell 
                              key={entry.name}
                              fill={CATEGORY_COLORS[entry.name]}
                              stroke="white"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #f0f0f0",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value, name) => [
                            `${value} bookings (${((value / totalBookings) * 100).toFixed(1)}%)`,
                            name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
  )
}
