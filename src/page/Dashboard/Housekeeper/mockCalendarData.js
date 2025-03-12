export const mockBookings = [
  // Week 1
  {
    id: 1,
    serviceName: "Apartment Cleaning Service",
    date: "2024-03-01",
    timeStart: "09:00",
    timeEnd: "11:00",
    status: "pending",
    customer: {
      name: "John Doe",
      phone: "+1234567890",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    location: "123 Main St, District 1, Ho Chi Minh City",
    price: 75.00,
    note: "Please bring cleaning supplies"
  },
  {
    id: 2,
    serviceName: "Deep House Cleaning",
    date: "2024-03-01",
    timeStart: "14:00",
    timeEnd: "17:00",
    status: "completed",
    customer: {
      name: "Jane Smith",
      phone: "+1987654321",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
    },
    location: "456 Oak St, District 2, Ho Chi Minh City",
    price: 150.00,
    note: "Focus on kitchen and bathrooms"
  },
  // Week 2
  {
    id: 3,
    serviceName: "Window Cleaning",
    date: "2024-03-08",
    timeStart: "10:00",
    timeEnd: "12:00",
    status: "cancelled",
    customer: {
      name: "Alice Johnson",
      phone: "+1122334455",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
    },
    location: "789 Pine St, District 3, Ho Chi Minh City",
    price: 60.00,
    note: "Cancelled due to weather"
  },
  {
    id: 4,
    serviceName: "Office Cleaning",
    date: "2024-03-09",
    timeStart: "08:00",
    timeEnd: "16:00",
    status: "in_progress",
    customer: {
      name: "Bob Wilson",
      phone: "+1567890123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
    },
    location: "101 Business Ave, District 1, Ho Chi Minh City",
    price: 200.00,
    note: "Large office space, 3 floors"
  },
  // Week 3
  {
    id: 5,
    serviceName: "Move-out Cleaning",
    date: "2024-03-15",
    timeStart: "13:00",
    timeEnd: "17:00",
    status: "pending",
    customer: {
      name: "Carol Brown",
      phone: "+1345678901",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol"
    },
    location: "202 Maple St, District 2, Ho Chi Minh City",
    price: 180.00,
    note: "Full apartment cleanup"
  },
  {
    id: 6,
    serviceName: "Regular House Cleaning",
    date: "2024-03-15",
    timeStart: "09:30",
    timeEnd: "11:30",
    status: "pending",
    customer: {
      name: "David Lee",
      phone: "+1789012345",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    },
    location: "303 Cedar St, District 3, Ho Chi Minh City",
    price: 85.00,
    note: "Weekly scheduled cleaning"
  },
  {
    id: 7,
    serviceName: "Post-construction Cleaning",
    date: "2024-03-15",
    timeStart: "13:00",
    timeEnd: "18:00",
    status: "pending",
    customer: {
      name: "Eva Garcia",
      phone: "+1901234567",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eva"
    },
    location: "404 Birch St, District 1, Ho Chi Minh City",
    price: 250.00,
    note: "Heavy duty cleaning required"
  },
  // Week 4
  {
    id: 8,
    serviceName: "Carpet Cleaning",
    date: "2024-03-22",
    timeStart: "10:00",
    timeEnd: "12:00",
    status: "completed",
    customer: {
      name: "Frank Miller",
      phone: "+1234567890",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank"
    },
    location: "505 Elm St, District 2, Ho Chi Minh City",
    price: 120.00,
    note: "Three rooms with carpets"
  },
  {
    id: 9,
    serviceName: "Kitchen Deep Clean",
    date: "2024-03-22",
    timeStart: "14:00",
    timeEnd: "16:00",
    status: "pending",
    customer: {
      name: "Grace Kim",
      phone: "+1567890123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace"
    },
    location: "606 Walnut St, District 3, Ho Chi Minh City",
    price: 100.00,
    note: "Include oven and refrigerator cleaning"
  },
  // Recurring Weekly Bookings
  {
    id: 10,
    serviceName: "Regular Maintenance",
    date: "2024-03-07",
    timeStart: "11:00",
    timeEnd: "13:00",
    status: "completed",
    customer: {
      name: "Henry Wang",
      phone: "+1890123456",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry"
    },
    location: "707 Pine St, District 1, Ho Chi Minh City",
    price: 90.00,
    note: "Weekly maintenance service"
  },
  {
    id: 11,
    serviceName: "Regular Maintenance",
    date: "2024-03-14",
    timeStart: "11:00",
    timeEnd: "13:00",
    status: "completed",
    customer: {
      name: "Henry Wang",
      phone: "+1890123456",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry"
    },
    location: "707 Pine St, District 1, Ho Chi Minh City",
    price: 90.00,
    note: "Weekly maintenance service"
  },
  {
    id: 12,
    serviceName: "Regular Maintenance",
    date: "2024-03-21",
    timeStart: "11:00",
    timeEnd: "13:00",
    status: "pending",
    customer: {
      name: "Henry Wang",
      phone: "+1890123456",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry"
    },
    location: "707 Pine St, District 1, Ho Chi Minh City",
    price: 90.00,
    note: "Weekly maintenance service"
  },
  // Special Events
  {
    id: 13,
    serviceName: "Hotel Room Deep Clean",
    date: "2024-03-20",
    timeStart: "09:00",
    timeEnd: "18:00",
    status: "pending",
    customer: {
      name: "Luxury Hotel",
      phone: "+1999888777",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hotel"
    },
    location: "888 Hotel Ave, District 1, Ho Chi Minh City",
    price: 500.00,
    note: "Full hotel floor cleaning - 10 rooms"
  },
  // Multiple Services Same Day
  {
    id: 14,
    serviceName: "Basic House Cleaning",
    date: "2024-03-28",
    timeStart: "09:00",
    timeEnd: "11:00",
    status: "pending",
    customer: {
      name: "Ian Cooper",
      phone: "+1112223333",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ian"
    },
    location: "909 Beach St, District 4, Ho Chi Minh City",
    price: 80.00,
    note: "Regular cleaning service"
  },
  {
    id: 15,
    serviceName: "Office Cleaning",
    date: "2024-03-28",
    timeStart: "13:00",
    timeEnd: "15:00",
    status: "pending",
    customer: {
      name: "Tech Corp",
      phone: "+1444555666",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech"
    },
    location: "111 Tech Park, District 7, Ho Chi Minh City",
    price: 150.00,
    note: "Startup office cleaning"
  },
  {
    id: 16,
    serviceName: "Evening Cleaning",
    date: "2024-03-28",
    timeStart: "16:00",
    timeEnd: "18:00",
    status: "pending",
    customer: {
      name: "Julia Smith",
      phone: "+1777888999",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia"
    },
    location: "222 Night St, District 5, Ho Chi Minh City",
    price: 100.00,
    note: "After-hours cleaning service"
  }
]; 