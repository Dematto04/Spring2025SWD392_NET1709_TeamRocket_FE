// src/components/HouseKeeperCalendar.js
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { useGetBookingCalendarQuery } from "@/redux/api/bookingApi";
import MonthView from "@/components/Housekeeper/Calendar/MonthView";
import WeekView from "@/components/Housekeeper/Calendar/WeekView";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const HouseKeeperCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const referenceDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss");
  const { data, isLoading, error } = useGetBookingCalendarQuery({
    referenceDate,
    viewMode,
  });

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date) => {
    if (date) {
      setCurrentDate(date);
      setCalendarOpen(false);
    }
  };

  const displayRange = data ? data.displayRange : "";

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrev} aria-label="Previous">
            Prev
          </Button>
          <Button variant="outline" onClick={handleNext} aria-label="Next">
            Next
          </Button>
          <Button variant="outline" onClick={handleToday} aria-label="Today">
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {displayRange}
          </span>
          
          <Select value={viewMode} onValueChange={handleViewModeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === "day" && (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !currentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentDate ? format(currentDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[600px] text-center p-4">
            <div className="text-red-600 dark:text-red-400 text-xl mb-2">Error</div>
            <div className="text-gray-600 dark:text-gray-400">
              {error.message || "Failed to load calendar data"}
            </div>
          </div>
        ) : data ? (
          <>
            {viewMode === "month" && (
              <MonthView bookingData={data} currentDate={currentDate} />
            )}
            {viewMode === "week" && <WeekView days={data.days} />}
           
          </>
        ) : (
          <div className="flex items-center justify-center h-[600px] text-gray-600 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseKeeperCalendar;
