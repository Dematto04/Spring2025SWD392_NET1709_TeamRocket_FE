import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Star,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar1Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import RevenueChart from "@/components/AdminDashboard/RevenueChart";
import React from "react";
import ServiceDistribution from "@/components/AdminDashboard/ServiceDistribution";
const DatePickerTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[150px] cursor-pointer"
  >
    {children}
  </div>
));
DatePickerTrigger.displayName = "DatePickerTrigger";

export function DashboardAdmin() {
  

  // Example data - replace with actual API data
  const stats = {
    totalUsers: {
      value: 1234,
      trend: 12.5,
      isPositive: true
    },
    activeServices: {
      value: 89,
      trend: 8.2,
      isPositive: true
    },
    monthlyRevenue: {
      value: 45600,
      trend: -2.4,
      isPositive: false
    },
    averageRating: {
      value: 4.5,
      trend: 0.3,
      isPositive: true
    }
  };


  const renderTrendIndicator = (trend, isPositive) => (
    <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      {Math.abs(trend)}%
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50/50">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Revenue Chart */}
        <RevenueChart/>

        {/* Service Distribution */}
        <ServiceDistribution/>
      </div>
    </div>
  );
}

export default DashboardAdmin;
