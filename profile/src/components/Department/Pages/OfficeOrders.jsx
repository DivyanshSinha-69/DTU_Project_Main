import React, { useState, useEffect } from "react";
import CustomTable from "../../components/CustomTable";
import HeroSection from "../../components/HeroSection";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { DatePicker } from "antd";
import { useThemeContext } from "../../../context/ThemeContext";

// Dummy Data for Office Orders
const dummyOrders = [
  {
    order_id: 1,
    order_number: "ORD001",
    department_id: "DEPT001",
    order_name: "Annual Report Submission",
    order_date: "2023-10-01",
    start_date: "2023-10-05",
    end_date: "2023-10-15",
    subject: "Submission of annual reports for the year 2023.",
    order_path: "orders/annual-report-2023.pdf",
  },
  {
    order_id: 2,
    order_number: "ORD002",
    department_id: "DEPT002",
    order_name: "Faculty Meeting Schedule",
    order_date: "2023-09-20",
    start_date: "2023-09-25",
    end_date: "2023-09-30",
    subject: "Schedule for the upcoming faculty meeting.",
    order_path: "orders/faculty-meeting-schedule.pdf",
  },
  // Add more dummy data as needed
];

const OfficeOrdersPage = () => {
  const { darkMode } = useThemeContext();
  const [orders, setOrders] = useState(dummyOrders);
  const [filteredOrders, setFilteredOrders] = useState(dummyOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [facultyId, setFacultyId] = useState("");

  // Columns for the Table
  const columns = [
    { key: "order_number", label: "Order Number" },
    { key: "order_name", label: "Order Name" },
    { key: "order_date", label: "Order Date" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "subject", label: "Subject" },
    { key: "order_path", label: "Document" },
    { key: "actions", label: "Actions" },
  ];

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order.order_name.toLowerCase().includes(query.toLowerCase()) ||
        order.subject.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  // Handle Date Range Filter
  const handleDateRangeFilter = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate >= start && orderDate <= end;
      });
      setFilteredOrders(filtered);
    } else {
      setStartDate(null);
      setEndDate(null);
      setFilteredOrders(orders);
    }
  };

  // Handle Faculty ID Filter
  const handleFacultyIdFilter = (id) => {
    setFacultyId(id);
    const filtered = orders.filter((order) =>
      order.department_id.toLowerCase().includes(id.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  // Dummy CRUD Operations
  const handleAdd = () => {
    alert("Add new order functionality will be implemented here.");
  };

  const handleEdit = (order) => {
    alert(`Edit order with ID: ${order.order_id}`);
  };

  const handleDelete = (order) => {
    const updatedOrders = orders.filter((o) => o.order_id !== order.order_id);
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    alert(`Deleted order with ID: ${order.order_id}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection
        title="Office Orders"
        subtitle="Manage and view all office orders"
        darkMode={darkMode}
      />

      {/* Filters Section */}
      <Card
        className="rounded-2xl p-6 mt-6 mx-4"
        style={{
          backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
          color: darkMode ? "#C9CCD1" : "#2D3A4A",
          border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <Input
            type="text"
            placeholder="Search by Order Name or Subject"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-1/3"
            color={darkMode ? "white" : "gray"}
          />

          {/* Date Range Picker */}
          <DatePicker.RangePicker
            onChange={handleDateRangeFilter}
            className="w-full md:w-1/3"
          />

          {/* Faculty ID Filter */}
          <Input
            type="text"
            placeholder="Filter by Faculty ID"
            value={facultyId}
            onChange={(e) => handleFacultyIdFilter(e.target.value)}
            className="w-full md:w-1/3"
            color={darkMode ? "white" : "gray"}
          />
        </div>
      </Card>

      {/* Table Section */}
      <CustomTable
        title="Office Orders"
        subtitle="List of all office orders"
        columns={columns}
        data={filteredOrders}
        actions={{ edit: handleEdit, delete: handleDelete }}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default OfficeOrdersPage;
