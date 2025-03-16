import React, { useEffect, useState } from "react";
import HeroSection from "../DynamicComponents/HeroSection";
import FacultyHeader from "./FacultyHeader";
import { useThemeContext } from "../../context/ThemeContext";
import API from "../../utils/API.js";
import toast from "react-hot-toast";
import { Card, Typography, Input } from "@material-tailwind/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const FacultyOfficeOrders = () => {
  const user = useSelector((state) => state.auth.user);
  const { department_id, faculty_id } = user;
  const { darkMode } = useThemeContext();
  const [ordersData, setOrdersData] = useState([]); // State to store orders data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [facultySearchQuery, setFacultySearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]); // Status filter: all, ongoing, upcoming, completed
  const [facultyMapping, setFacultyMapping] = useState({});

  // Format date to "dd/mm/yyyy"
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  const fetchFacultyMapping = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/faculty-mapping?department_id=${department_id}` // Fixed the query parameter format
      );
      if (response.data) {
        const mapping = response.data.reduce((acc, faculty) => {
          acc[faculty.faculty_id] = faculty.faculty_name;
          return acc;
        }, {});
        setFacultyMapping(mapping);
      }
    } catch (error) {
      console.error("Error fetching faculty mapping:", error);
    }
  };
  // Fetch duty orders when the component mounts
  const fetchDutyOrders = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/duty-orders?user_id=${faculty_id}`
      );
      if (Array.isArray(response.data)) {
        const formattedData = response.data
          .map((order) => ({
            order_id: order.order_id,
            order_number: order.order_number,
            order_name: order.order_name,
            order_date: formatDate(order.order_date),
            start_date: formatDate(order.start_date),
            end_date: formatDate(order.end_date),
            subject: order.subject,
            order_path: order.order_path,
            undersigned: order.undersigned,
            is_seen: order.is_seen,
            notified_at: order.notified_at,
            faculties: order.faculty_ids,
          }))
          .sort((a, b) => a.is_seen - b.is_seen); // Sort by is_seen (0 first)
        setOrdersData(formattedData);
        setFilteredOrders(formattedData);
      }
    } catch (error) {
      console.error("Error fetching duty orders:", error);
      toast.error("Error while fetching duty orders");
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    { key: "order_number", label: "Order Number" },
    { key: "order_name", label: "Order Name" },
    { key: "subject", label: "Subject" },
    { key: "faculties", label: "Faculties" },

    { key: "order_date", label: "Order Date" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "undersigned", label: "Undersigned" },
    { key: "order_path", label: "Document" },
  ];
  // Mark duty order as seen when a document is viewed
  const markOrderAsSeen = async (orderNumber) => {
    console.log("Marking order as seen:", orderNumber); // Debugging
    try {
      const response = await API.put("/ece/faculty/duty-orders/mark_seen", {
        user_id: faculty_id, // Replace with the actual faculty user ID
        order_number: orderNumber,
      });
      if (response.data.message === "Duty order marked as seen!") {
        // Update the local state to reflect the change
        setOrdersData((prevData) =>
          prevData.map((order) =>
            order.order_number === orderNumber
              ? { ...order, is_seen: 1 }
              : order
          )
        );
        toast.success("Order marked as seen!");
        fetchDutyOrders(); // Refetch the data to update the UI
      }
    } catch (error) {
      console.error("Error marking order as seen:", error);
      toast.error("Error while marking order as seen");
    }
  };

  // Handle search by Order ID or Subject
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, facultySearchQuery, startDateFilter, endDateFilter);
  };

  // Handle search by Faculty Name
  const handleFacultySearch = (query) => {
    setFacultySearchQuery(query);
    applyFilters(searchQuery, query, startDateFilter, endDateFilter);
  };

  // Handle date range filter
  const handleDateFilter = () => {
    applyFilters(
      searchQuery,
      facultySearchQuery,
      startDateFilter,
      endDateFilter
    );
  };

  // Apply all filters
  const applyFilters = (searchQuery, facultyQuery, startDate, endDate) => {
    let filtered = ordersData;

    // Filter by search query (Order ID or Subject)
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.includes(searchQuery) ||
          order.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by faculty name (Undersigned)
    if (facultyQuery) {
      filtered = filtered.filter((order) =>
        order.undersigned.toLowerCase().includes(facultyQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.order_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return orderDate >= start && orderDate <= end;
      });
    }

    setFilteredOrders(filtered);
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // JS Date uses zero-based months
  };

  const handleStatusFilter = (status) => {
    let updatedFilters = [...statusFilter];

    // Toggle the status filter
    if (updatedFilters.includes(status)) {
      updatedFilters = updatedFilters.filter((s) => s !== status); // Remove the status if already selected
    } else {
      updatedFilters.push(status); // Add the status if not selected
    }

    setStatusFilter(updatedFilters);

    // Filter data based on selected statuses
    let filtered = ordersData.filter((order) => {
      const startDate = parseDate(order.start_date);
      const endDate = parseDate(order.end_date);
      const currentDate = new Date();

      return updatedFilters.some((status) => {
        if (status === "ongoing") {
          return startDate <= currentDate && endDate >= currentDate; // Ongoing orders
        }
        if (status === "upcoming") {
          return startDate > currentDate; // Upcoming orders
        }
        if (status === "completed") {
          return endDate < currentDate; // Completed orders
        }
        return false;
      });
    });
    // If no status filters are selected, show all data
    if (updatedFilters.length === 0) {
      setFilteredOrders(ordersData);
      return;
    }
    setFilteredOrders(filtered);
  };
  // Fetch data when the component mounts
  useEffect(() => {
    fetchDutyOrders();
    fetchFacultyMapping();
  }, [faculty_id]);

  // Toggle expanded state for a row
  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }} // Adjusted dark mode background
    >
      <FacultyHeader />
      <div className="flex min-h-screen">
        <div className="flex-1 pt-4 overflow-y-auto px-4">
          {/* Hero Section */}
          <HeroSection
            title="Faculty Office Orders"
            subtitle="View and manage all faculty office orders"
            darkMode={darkMode}
          />

          {/* Filters Section */}
          <Card
            className="rounded-lg p-4 mt-6 shadow-sm border"
            style={{
              backgroundColor: darkMode ? "#0D1117" : "#FFFFFF", // Updated dark mode color
              color: darkMode ? "#C9CCD1" : "#2D3A4A", // Softer text color
              border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB", // Subtle border
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by Order ID or Subject */}
              <Input
                type="text"
                placeholder="Search by Order ID or Subject"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 rounded-lg border transition-all duration-300"
                style={{
                  backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                  borderColor: darkMode ? "#22232B" : "#D1D5DB",
                  color: darkMode ? "#EAEAEA" : "#1F252E",
                }}
              />

              {/* Search by Faculty Name */}
              <Input
                type="text"
                placeholder="Search by Faculty Name"
                value={facultySearchQuery}
                onChange={(e) => handleFacultySearch(e.target.value)}
                className="w-full p-2 rounded-lg border transition-all duration-300"
                style={{
                  backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                  borderColor: darkMode ? "#22232B" : "#D1D5DB",
                  color: darkMode ? "#EAEAEA" : "#1F252E",
                }}
              />

              {/* Date Range Filter */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full p-2 rounded-lg border transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                    borderColor: darkMode ? "#22232B" : "#D1D5DB",
                    color: darkMode ? "#EAEAEA" : "#1F252E",
                  }}
                />
                <Input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="w-full p-2 rounded-lg border transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                    borderColor: darkMode ? "#22232B" : "#D1D5DB",
                    color: darkMode ? "#EAEAEA" : "#1F252E",
                  }}
                />
              </div>
            </div>

            {/* Apply and Reset Buttons */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-4">
              <button
                onClick={handleDateFilter}
                className="px-4 py-1.5 rounded-md border-2 font-medium text-sm transition-all duration-300"
                style={{
                  borderColor: darkMode ? "#569CD6" : "#007BFF",
                  color: darkMode ? "#569CD6" : "#007BFF",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = darkMode
                    ? "rgba(86, 156, 214, 0.1)"
                    : "rgba(0, 123, 255, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setStartDateFilter("");
                  setEndDateFilter("");
                  setSearchQuery("");
                  setFacultySearchQuery("");
                  setStatusFilter([]); // Reset status filter
                  setFilteredOrders(ordersData); // Show all data
                }}
                className="px-4 py-1.5 rounded-md border-2 font-medium text-sm transition-all duration-300"
                style={{
                  borderColor: darkMode ? "#D43F3F" : "#E63946",
                  color: darkMode ? "#D43F3F" : "#E63946",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = darkMode
                    ? "rgba(212, 63, 63, 0.1)"
                    : "rgba(230, 57, 70, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Reset
              </button>
            </div>
          </Card>

          {/* Status Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
            {[
              { label: "Ongoing", value: "ongoing" },
              { label: "Upcoming", value: "upcoming" },
              { label: "Completed", value: "completed" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleStatusFilter(value)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300
        ${
          statusFilter.includes(value)
            ? darkMode
              ? "bg-[#3C4A52] text-[#F1F4F8] border-2 border-[#B0C0C8]" // Muted greyish teal in dark mode
              : "bg-[#D4E4E8] text-[#1F252E] border-2 border-[#A5B5C5]" // Muted greyish teal in light mode
            : darkMode
              ? "bg-transparent text-white border-2 border-[#D1D5DB]" // Subtle border for inactive state
              : "bg-transparent text-[#1F252E] border-2 border-[#D1D5DB]" // Subtle border for inactive state"bg-transparent text-[#1F252E] border-2 border-[#D1D5DB]" // Subtle border for inactive state
        }
        focus:outline-none
      `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom Table */}
          <div className="pt-4 pb-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Card
                className="rounded-2xl p-4 w-full mx-auto"
                style={{
                  backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                  color: darkMode ? "#C9CCD1" : "#2D3A4A",
                  border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB",
                }}
              >
                {/* Table Header Section */}
                <div className="flex flex-row justify-between items-center mb-5">
                  <div>
                    <Typography
                      variant="h5"
                      className="font-poppins font-semibold text-xl"
                      style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
                    >
                      Orders
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-red-500 mt-1 font-poppins font-medium"
                    >
                      List of all faculty office orders
                    </Typography>
                  </div>
                </div>

                {/* Table Container */}
                <div className="w-full overflow-x-auto">
                  <table
                    className="w-full min-w-auto lg:min-w-max table-auto text-left"
                    style={{
                      backgroundColor: "transparent",
                      color: darkMode ? "#C9CCD1" : "#2D3A4A",
                    }}
                  >
                    {/* Table Head */}
                    <thead>
                      <tr
                        style={{
                          backgroundColor: darkMode ? "#161B22" : "#F0F2F5",
                          color: darkMode ? "#A0A4A8" : "#6B7280",
                        }}
                      >
                        <th
                          className="border-b p-4"
                          style={{
                            borderBottom: darkMode
                              ? "1px solid #21262D"
                              : "1px solid #DADDE1",
                          }}
                        >
                          Expand
                        </th>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            className="border-b p-4"
                            style={{
                              borderBottom: darkMode
                                ? "1px solid #21262D"
                                : "1px solid #DADDE1",
                            }}
                          >
                            <Typography
                              variant="small"
                              className="font-poppins font-medium leading-none"
                              style={{ opacity: 0.8, letterSpacing: "0.5px" }}
                            >
                              {col.label}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {currentItems.map((row, index) => {
                        const isLast = index === currentItems.length - 1;
                        const isExpanded =
                          expandedRow === (row.order_id || index);

                        return (
                          <React.Fragment key={row.order_id || index}>
                            {/* Main Row */}
                            <tr
                              className="hover:bg-opacity-10 transition-all"
                              style={{
                                backgroundColor:
                                  row.is_seen === 1
                                    ? "transparent"
                                    : darkMode
                                      ? "#2B2C3A"
                                      : "#E0E0E0",
                                borderBottom: isLast
                                  ? "none"
                                  : darkMode
                                    ? "1px solid #21262D"
                                    : "1px solid #DADDE1",
                              }}
                            >
                              {/* Expand/Collapse Button */}
                              <td className="p-4">
                                <button
                                  onClick={() =>
                                    toggleRow(row.order_id || index)
                                  }
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-transform"
                                >
                                  {isExpanded ? (
                                    <FaChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                  ) : (
                                    <FaChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                  )}
                                </button>
                              </td>

                              {/* Table Data */}
                              {columns.map((col) => (
                                <td key={col.key} className="p-4">
                                  <Typography
                                    variant="small"
                                    className="font-poppins font-normal"
                                    style={{
                                      color: darkMode ? "#C9CCD1" : "#2D3A4A",
                                      letterSpacing: "0.3px",
                                    }}
                                  >
                                    {col.key === "order_path" ? (
                                      row[col.key] ? (
                                        <a
                                          href={`${process.env.REACT_APP_BACKEND_URL}/public/${row[col.key]}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            markOrderAsSeen(row.order_number);
                                            window.open(
                                              `${process.env.REACT_APP_BACKEND_URL}/public/${row[col.key]}`,
                                              "_blank"
                                            );
                                          }}
                                          className="text-blue-500 hover:underline font-poppins font-medium"
                                        >
                                          View
                                        </a>
                                      ) : (
                                        "Not Uploaded"
                                      )
                                    ) : col.key === "faculties" ? (
                                      // Show only the length of the array in normal view
                                      row[col.key]?.length || "-"
                                    ) : (
                                      row[col.key] || "-"
                                    )}
                                  </Typography>
                                </td>
                              ))}
                            </tr>

                            {/* Expanded Row */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.tr
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <td
                                    colSpan={columns.length + 1}
                                    className="p-4"
                                  >
                                    <div className="flex flex-col gap-2">
                                      {columns.map((col) => (
                                        <div
                                          key={col.key}
                                          className="flex flex-col gap-1"
                                        >
                                          <Typography
                                            variant="small"
                                            className="font-poppins font-semibold"
                                            style={{
                                              color: darkMode
                                                ? "#C9CCD1"
                                                : "#2D3A4A",
                                            }}
                                          >
                                            {col.label}
                                          </Typography>
                                          <Typography
                                            variant="small"
                                            className="font-poppins font-normal"
                                            style={{
                                              color: darkMode
                                                ? "#C9CCD1"
                                                : "#2D3A4A",
                                            }}
                                          >
                                            {col.key === "order_path"
                                              ? row[col.key]
                                                ? "View"
                                                : "Not Uploaded"
                                              : col.key === "faculties"
                                                ? row[col.key]
                                                    ?.map(
                                                      (facultyId) =>
                                                        facultyMapping[
                                                          facultyId
                                                        ] || facultyId
                                                    )
                                                    .join(", ") || "-"
                                                : row[col.key] || "-"}
                                          </Typography>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                        ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : darkMode
                              ? "text-white hover:bg-gray-600"
                              : "text-black hover:bg-gray-100"
                        }`}
                    >
                      {"<"}
                    </button>
                    {Array.from(
                      {
                        length: Math.ceil(filteredOrders.length / itemsPerPage),
                      },
                      (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`px-4 py-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                            ${
                              currentPage === i + 1
                                ? darkMode
                                  ? "bg-[#F0F0F0] text-black shadow-sm transform scale-100"
                                  : "bg-[#333] text-white shadow-sm transform scale-100"
                                : darkMode
                                  ? "bg-gray-700 text-white hover:bg-gray-600 hover:scale-100"
                                  : "bg-white text-black hover:bg-gray-200 hover:scale-100"
                            }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredOrders.length / itemsPerPage)
                      }
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                        ${
                          currentPage ===
                          Math.ceil(filteredOrders.length / itemsPerPage)
                            ? "text-gray-400 cursor-not-allowed"
                            : darkMode
                              ? "text-white hover:bg-gray-600"
                              : "text-black hover:bg-gray-100"
                        }`}
                    >
                      {">"}
                    </button>
                  </nav>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyOfficeOrders;
