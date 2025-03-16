import React, { useState } from 'react';
import { useGetTopServicesQuery } from '@/redux/api/serviceApi';
import { Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription } from "@/components/ui/card";
import { Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, 
  PopoverContent, 
  PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Activity, Calendar as Calendar1Icon, Trophy, Medal, Award, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TopService() {
  const [chartConfig, setChartConfig] = useState({
    type: "day",
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

  // Prepare query parameters
  const queryParams = {
    pageSize: 10,
    pageIndex: 1,
    dayTop: chartConfig.type === "day",
    weekTop: chartConfig.type === "week",
    yearTop: chartConfig.type === "year",
    yearStart: chartConfig.type === "day" ? startDate.getFullYear() : chartConfig.yearStart,
    monthStart: chartConfig.type === "day" ? startDate.getMonth() + 1 : chartConfig.monthStart,
    dayStart: chartConfig.type === "day" ? startDate.getDate() : chartConfig.dayStart,
    yearEnd: chartConfig.type === "day" ? endDate.getFullYear() : chartConfig.yearEnd,
    monthEnd: chartConfig.type === "day" ? endDate.getMonth() + 1 : chartConfig.monthEnd,
    dayEnd: chartConfig.type === "day" ? endDate.getDate() : chartConfig.dayEnd,
  };

  const { data: topServices, isLoading } = useGetTopServicesQuery(queryParams);

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

  // Function to get rank styling
  const getRankStyle = (index) => {
    switch(index) {
      case 0:
        return {
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          background: 'bg-yellow-50',
          border: 'border-yellow-200',
          hover: 'hover:bg-yellow-100',
          text: 'text-yellow-700'
        };
      case 1:
        return {
          icon: <Medal className="h-5 w-5 text-gray-400" />,
          background: 'bg-gray-50',
          border: 'border-gray-200',
          hover: 'hover:bg-gray-100',
          text: 'text-gray-700'
        };
      case 2:
        return {
          icon: <Award className="h-5 w-5 text-amber-600" />,
          background: 'bg-amber-50',
          border: 'border-amber-200',
          hover: 'hover:bg-amber-100',
          text: 'text-amber-700'
        };
      default:
        return {
          icon: <Star className="h-4 w-4 text-blue-400" />,
          background: 'bg-white',
          border: 'border-gray-100',
          hover: 'hover:bg-gray-50',
          text: 'text-gray-600'
        };
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Service Rankings
          </CardTitle>
          <CardDescription>Top performing services by revenue</CardDescription>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Top Services
          </CardTitle>
          <CardDescription>Most popular services by period</CardDescription>
        </div>
        {/* Chart Controls */}
        <div className="flex flex-col gap-2 mt-2">
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
            </SelectContent>
          </Select>

          {chartConfig.type === "day" ? (
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
          ) : (
            ["week", "year"].includes(chartConfig.type) && (
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
            )
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {topServices?.data?.items.map((service, index) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold w-6">{index + 1}</span>
                  <div>
                    <h3 className="text-sm font-medium">{service.name}</h3>
                    <p className="text-xs text-muted-foreground">{service.categoryName}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">${service.revenue.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {service.numberOfBooking} bookings
                  </div>
                </div>
              </div>
            ))}

            {(!topServices?.data?.items || topServices.data.items.length === 0) && (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No services found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
