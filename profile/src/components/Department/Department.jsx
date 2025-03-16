import React, { useState, useEffect } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { useThemeContext } from "../../context/ThemeContext";
import DepartmentHeader from "./DepartmentHeader";
import Loader from "../Loader";
import editImg from "../../assets/edit.svg";
import deleteImg from "../../assets/delete.svg";
import addImg from "../../assets/add.svg";
import { useSelector } from "react-redux";
import API from "../../utils/API";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import HeroSection from "../DynamicComponents/HeroSection";
import { FaRegCalendarAlt } from "react-icons/fa";
import DepartmentOfficeOrdersPopUp from "./PopUp/OfficeOrdersPopUp";
import toast from "react-hot-toast";

const Department = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const wordLimit = 3; // Set your desired word limit here

  const [selectedOrder, setSelectedOrder] = useState(null);
  const { darkMode } = useThemeContext();
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [facultySearchQuery, setFacultySearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [facultyMapping, setFacultyMapping] = useState({});
  const itemsPerPage = 5;
  const user = useSelector((state) => state.auth.user) || {};
  const { department_id } = user || {};
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await API.get(`ece/department/orders/${department_id}`);
      if (response.data && response.data.data) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      }
      console.log("Orders fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoader(false);
    }
  };

  // Fetch faculty name mapping
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

  useEffect(() => {
    fetchOrders();
    fetchFacultyMapping();
  }, [department_id]);

  const columns = [
    { key: "order_number", label: "Order Number" },
    { key: "order_name", label: "Order Name" },
    { key: "subject", label: "Subject" },
    { key: "faculties", label: "Faculties" },
    { key: "undersigned", label: "Undersigned" },
    { key: "order_date", label: "Order Date" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "order_path", label: "Document" },
    { key: "actions", label: "Actions" },
  ];
  // Handle search by subject and order ID
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order.order_number.includes(query) || order.subject.includes(query)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Handle search by faculty name
  const handleFacultySearch = (query) => {
    setFacultySearchQuery(query);
    const filtered = orders.filter((order) =>
      order.faculty_ids.some((id) =>
        facultyMapping[id]?.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Handle date range filter
  const handleDateFilter = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      const startDate = startDateFilter ? new Date(startDateFilter) : null;
      const endDate = endDateFilter ? new Date(endDateFilter) : null;

      return (
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Handle edit action
  const handleEdit = (row) => {
    setSelectedOrder(row); // Reset selected order for adding

    setIsPopupOpen(true);
    // Open pop-up for editing (to be implemented)
  };

  // Handle delete action
  const handleDelete = async (row) => {
    try {
      const response = await API.delete(
        `ece/department/orders/${row.order_id}`
      );
      if (response.status === 200) {
        toast.success("Order deleted successfully!");
        fetchOrders(); // Refresh the orders list
      } else {
        toast.error("Failed to delete order. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again.");
    }
  };

  const handleAdd = () => {
    setSelectedOrder(null); // Reset selected order for adding
    setIsPopupOpen(true);
  };

  // Handle add action
  const handleAddOrUpdateOrder = async (orderData) => {
    try {
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(orderData).forEach((key) => {
        if (key === "faculty_ids") {
          // Append each faculty ID individually
          orderData[key].forEach((facultyId) => {
            formData.append("faculty_ids[]", facultyId);
          });
        } else if (key === "document" && orderData[key]) {
          // Append the file if it exists
          formData.append("order_file", orderData[key]);
        } else {
          // Append other fields
          formData.append(key, orderData[key]);
        }
      });
      console.log("formData", formData);
      let response;
      if (selectedOrder) {
        // Update order
        response = await API.put(
          `/ece/department/orders/${selectedOrder.order_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Required for file uploads
            },
          }
        );
        toast.success("Order updated successfully!");
      } else {
        // Add new order
        response = await API.post("ece/department/orders", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        });
        toast.success("Order added successfully!");
      }

      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error adding/updating order:", error);
      toast.error("Failed to add/update order. Please try again.");
    }
  };

  // Toggle expanded row
  const toggleRow = (orderId) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  const truncateText = (text, wordLimit) => {
    if (!text) return { truncated: "-", full: "-" };
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return {
        truncated: words.slice(0, wordLimit).join(" ") + "...",
        full: text,
      };
    }
    return { truncated: text, full: text };
  };

  return (
    <div
      className="pb-4"
      style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
    >
      {loader ? (
        <Loader />
      ) : (
        <>
          <DepartmentHeader />
          <div className="flex mt-4 min-h-screen">
            <div
              className="flex-1 overflow-y-auto px-4"
              style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}
            >
              <HeroSection
                title="Office Orders"
                subtitle="Manage and view all office orders"
                darkMode={darkMode}
              />

              {/* Filters Section */}
              <Card
                className="rounded-lg p-4 mt-6  shadow-sm border"
                style={{
                  backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                  borderColor: darkMode ? "#22232B" : "#D1D5DB",
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
                    {/* Start Date Field */}
                    <div className="relative w-full">
                      <label className="w-full block">
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
                      </label>
                    </div>

                    {/* End Date Field */}
                    <div className="relative w-full">
                      <label className="w-full block">
                        <Input
                          type="date"
                          value={endDateFilter}
                          onChange={(e) => setEndDateFilter(e.target.value)}
                          className="w-full p-2  rounded-lg border transition-all duration-300 cursor-pointer"
                          style={{
                            backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                            borderColor: darkMode ? "#22232B" : "#D1D5DB",
                            color: darkMode ? "#EAEAEA" : "#1F252E",
                          }}
                        />
                        {/* Datepicker Icon */}
                      </label>
                    </div>
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
                    onMouseEnter={
                      (e) =>
                        (e.target.style.backgroundColor = darkMode
                          ? "rgba(86, 156, 214, 0.1)" // Light hover color for dark mode
                          : "rgba(0, 123, 255, 0.1)") // Light hover color for light mode
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
                      setFilteredOrders(orders);
                    }}
                    className="px-4 py-1.5 rounded-md border-2 font-medium text-sm transition-all duration-300"
                    style={{
                      borderColor: darkMode ? "#D43F3F" : "#E63946",
                      color: darkMode ? "#D43F3F" : "#E63946",
                    }}
                    onMouseEnter={
                      (e) =>
                        (e.target.style.backgroundColor = darkMode
                          ? "rgba(212, 63, 63, 0.1)" // Light hover color for dark mode
                          : "rgba(230, 57, 70, 0.1)") // Light hover color for light mode
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    Reset
                  </button>
                </div>
              </Card>

              {/* Table Section */}
              <Card
                className="rounded-2xl p-4 w-full mx-auto mt-6"
                style={{
                  backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                  color: darkMode ? "#C9CCD1" : "#2D3A4A",
                  border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB",
                }}
              >
                <div className="flex flex-row justify-between items-center mb-5">
                  <div>
                    <Typography
                      variant="h5"
                      className="font-poppins font-semibold text-xl"
                      style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
                    >
                      Office Orders
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-red-500 mt-1 font-poppins font-medium"
                    >
                      List of all office orders
                    </Typography>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all ease-in"
                  >
                    <img src={addImg} alt="add" className="h-5 w-5" />
                  </button>
                </div>

                <div className="w-full overflow-x-auto">
                  <table
                    className="w-full min-w-auto lg:min-w-max table-auto text-left"
                    style={{
                      backgroundColor: "transparent",
                      color: darkMode ? "#C9CCD1" : "#2D3A4A",
                    }}
                  >
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
                            className={`border-b p-4 ${
                              col.key === "actions" ? "text-right" : ""
                            }`}
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

                    <tbody>
                      {currentItems.map((row, index) => (
                        <React.Fragment key={row.order_id}>
                          <tr
                            className="hover:bg-opacity-10 transition-all"
                            style={{
                              backgroundColor: "transparent",
                              borderBottom:
                                index === currentItems.length - 1
                                  ? "none"
                                  : darkMode
                                    ? "1px solid #21262D"
                                    : "1px solid #DADDE1",
                            }}
                          >
                            <td className="p-4">
                              <button
                                onClick={() => toggleRow(row.order_id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-transform"
                              >
                                {expandedRow === row.order_id ? (
                                  <FaChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                ) : (
                                  <FaChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                )}
                              </button>
                            </td>
                            {columns.map((col) => {
                              const cellValue = row[col.key];
                              if (col.key === "faculties") {
                                return (
                                  <td key={col.key} className="p-4">
                                    <Typography
                                      variant="small"
                                      className="font-poppins font-normal"
                                      style={{
                                        color: darkMode ? "#C9CCD1" : "#2D3A4A",
                                        letterSpacing: "0.3px",
                                      }}
                                    >
                                      {expandedRow === row.order_id
                                        ? row.faculty_ids
                                            .map(
                                              (id) =>
                                                facultyMapping[id] || "Unknown"
                                            )
                                            .join(", ")
                                        : `${row.faculty_ids.length}`}
                                    </Typography>
                                  </td>
                                );
                              }
                              if (
                                col.key === "order_date" ||
                                col.key === "start_date" ||
                                col.key === "end_date"
                              ) {
                                return (
                                  <td key={col.key} className="p-4">
                                    <Typography
                                      variant="small"
                                      className="font-poppins font-normal"
                                      style={{
                                        color: darkMode ? "#C9CCD1" : "#2D3A4A",
                                        letterSpacing: "0.3px",
                                      }}
                                    >
                                      {formatDate(cellValue)}
                                    </Typography>
                                  </td>
                                );
                              }
                              if (col.key === "order_path") {
                                return (
                                  <td key={col.key} className="p-4">
                                    {cellValue ? (
                                      <a
                                        href={`${process.env.REACT_APP_BACKEND_URL}/public/Department/Orders/${cellValue}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline font-poppins font-medium"
                                      >
                                        View
                                      </a>
                                    ) : (
                                      <Typography
                                        variant="small"
                                        className="font-poppins font-medium"
                                      >
                                        Not Uploaded
                                      </Typography>
                                    )}
                                  </td>
                                );
                              }
                              if (col.key === "actions") {
                                return (
                                  <td key={col.key} className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => handleEdit(row)}
                                        className="p-2 rounded-lg border-2 transition-all duration-300 ease-in-out"
                                        style={{
                                          borderColor: darkMode
                                            ? "#4C9A2A"
                                            : "#48BB78",
                                          color: darkMode
                                            ? "#4C9A2A"
                                            : "#48BB78",
                                          width: "36px",
                                          height: "36px",
                                        }}
                                      >
                                        <img
                                          src={editImg}
                                          alt="edit"
                                          className="h-4 w-4"
                                          style={{
                                            filter: darkMode
                                              ? "invert(0.3)"
                                              : "invert(1)",
                                          }}
                                        />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(row)}
                                        className="p-2 rounded-lg border-2 transition-all duration-300 ease-in-out"
                                        style={{
                                          borderColor: darkMode
                                            ? "#D45D5D"
                                            : "#F56565",
                                          color: darkMode
                                            ? "#D45D5D"
                                            : "#F56565",
                                          width: "36px",
                                          height: "36px",
                                        }}
                                      >
                                        <img
                                          src={deleteImg}
                                          alt="delete"
                                          className="h-4 w-4"
                                        />
                                      </button>
                                    </div>
                                  </td>
                                );
                              }
                              return (
                                <td key={col.key} className="p-4">
                                  <Typography
                                    variant="small"
                                    className="font-poppins font-normal"
                                    style={{
                                      color: darkMode ? "#C9CCD1" : "#2D3A4A",
                                      letterSpacing: "0.3px",
                                    }}
                                    title={
                                      typeof cellValue === "string"
                                        ? cellValue
                                        : cellValue
                                          ? cellValue
                                          : "-"
                                    }
                                  >
                                    {typeof cellValue === "string"
                                      ? truncateText(cellValue, wordLimit)
                                          .truncated // Truncate all string values
                                      : cellValue
                                        ? cellValue
                                        : "-"}
                                  </Typography>
                                </td>
                              );
                            })}
                          </tr>

                          {/* Expanded Row */}
                          {expandedRow === row.order_id && (
                            <tr>
                              <td colSpan={columns.length + 1} className="p-4">
                                <div className="flex flex-col gap-2">
                                  {columns
                                    .filter((col) => col.key !== "actions") // Exclude actions column
                                    .map((col) => (
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
                                        {col.key === "faculties" ? (
                                          <Typography
                                            variant="small"
                                            className="font-poppins font-normal"
                                            style={{
                                              color: darkMode
                                                ? "#C9CCD1"
                                                : "#2D3A4A",
                                            }}
                                          >
                                            {row.faculty_ids
                                              .map(
                                                (id) =>
                                                  facultyMapping[id] ||
                                                  "Unknown"
                                              )
                                              .join(", ")}
                                          </Typography>
                                        ) : col.key === "order_date" ||
                                          col.key === "start_date" ||
                                          col.key === "end_date" ? (
                                          <Typography
                                            variant="small"
                                            className="font-poppins font-normal"
                                            style={{
                                              color: darkMode
                                                ? "#C9CCD1"
                                                : "#2D3A4A",
                                            }}
                                          >
                                            {formatDate(row[col.key])}
                                          </Typography>
                                        ) : col.key === "order_path" ? (
                                          row[col.key] ? (
                                            <a
                                              href={`${process.env.REACT_APP_BACKEND_URL}/public/Department/Orders/${row[col.key].name}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:underline font-poppins font-medium"
                                            >
                                              View
                                            </a>
                                          ) : (
                                            <Typography
                                              variant="small"
                                              className="font-poppins font-medium"
                                            >
                                              Not Uploaded
                                            </Typography>
                                          )
                                        ) : (
                                          <Typography
                                            variant="small"
                                            className="font-poppins font-normal"
                                            style={{
                                              color: darkMode
                                                ? "#C9CCD1"
                                                : "#2D3A4A",
                                            }}
                                          >
                                            {row[col.key] || "-"}
                                          </Typography>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
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
          currentPage === Math.ceil(filteredOrders.length / itemsPerPage)
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
            </div>
          </div>
        </>
      )}
      {/* Add/Edit Order Popup */}
      {isPopupOpen && (
        <DepartmentOfficeOrdersPopUp
          order={selectedOrder}
          closeModal={() => setIsPopupOpen(false)}
          handleAddOrUpdateOrder={handleAddOrUpdateOrder}
          facultyMapping={facultyMapping}
        />
      )}
    </div>
  );
};

export default Department;
