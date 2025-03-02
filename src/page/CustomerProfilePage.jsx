import React, { useState, useEffect } from "react";
import CusProfile from "@/components/CustomerProfile/CusProfile";
import Wallet from "@/components/CustomerProfile/Wallet";
import Profile from "@/components/CustomerProfile/Profile";
import Transactions from "@/components/CustomerProfile/Transactions";
import Address from "@/components/CustomerProfile/Address";
import { BookingList } from "@/components/CustomerProfile/BookingHistory";
import { useCustomerProfileQuery } from "@/redux/api/customerProfileApi";

export default function CustomerProfilePage() {
  // Retrieve the selected menu from localStorage or default to 'profile'
  const [selectedMenu, setSelectedMenu] = useState(
    localStorage.getItem("selectedMenu") || "profile"
  );

  // Fetch customer profile data
  const { data, isLoading } = useCustomerProfileQuery();

  // Save the selected menu to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  // Ensure hooks run before returning loading UI
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Function to render the main content based on the selected menu
  const renderMainContent = () => {
    switch (selectedMenu) {
      case "profile":
        return <Profile profileInfo={data} />;
      case "wallet":
        return <Wallet />;
      case "transactions":
        return <Transactions />;
      case "address":
        return <Address />;
      case "booking":
        return <BookingList />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-64 p-4 bg-gray-50 border-r border-gray-200 mt-20">
        <CusProfile selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 mt-20">{renderMainContent()}</div>
    </div>
  );
}
