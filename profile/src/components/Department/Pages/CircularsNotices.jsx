import React, { useState, useEffect } from "react";
import CustomTable from "../../DynamicComponents/CustomTable.jsx";
import HeroSection from "../../DynamicComponents/HeroSection";
import DepartmentHeader from "../DepartmentHeader.jsx";
import API from "../../../utils/API.js";
import { Card, Input, Typography } from "@material-tailwind/react";
import { useThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import Popup from "reactjs-popup";
import CircularPopup from "../PopUp/CircularPopUp.jsx";
import toast from "react-hot-toast";

const DepartmentCirculars = () => {
  const user = useSelector((state) => state.auth.user);
  const { department_id } = user;
  const { darkMode } = useThemeContext();
  const [circulars, setCirculars] = useState([]); // State to store circulars
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false); // State to handle popup visibility
  const [editCircular, setEditCircular] = useState(null); // State to handle editing circular

  // Columns for the table
  const columns = [
    { key: "circular_number", label: "Circular Number" },
    { key: "circular_name", label: "Title" },
    { key: "subject", label: "Description" },
    { key: "circular_date", label: "Date" },
    { key: "circular_path", label: "Document" },
    { key: "actions", label: "Actions" },
  ];

  // Format date to "dd/mm/yyyy"
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };

  // Fetch circulars from the backend
  useEffect(() => {
    fetchCirculars();
  }, [department_id]);

  const fetchCirculars = async () => {
    try {
      const response = await API.get(
        `/ece/department/circulars?department_id=${department_id}`
      );
      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data
          .map((circular) => ({
            ...circular,
            circular_date: formatDateForInput(circular.circular_date),
            circular_file: circular.circular_path
              ? { name: circular.circular_path }
              : null, // Add circular_path as an object with a name property
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by created_at (latest first)

        setCirculars(formattedData);
        setFilteredCirculars(formattedData); // Initialize filtered circulars
      }
    } catch (error) {
      console.error("Error fetching circulars:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new circular
  const openPopup = (circular = null) => {
    setEditCircular(circular);
    setPopupOpen(true);
  };

  // Close the popup
  const closePopup = () => {
    setPopupOpen(false);
    setEditCircular(null);
  };

  // Handle adding or updating a circular
  const saveCircular = async (circular) => {
    const method = editCircular ? "PUT" : "POST";
    const url = editCircular
      ? `/ece/department/circulars/${editCircular.circular_id}`
      : "/ece/department/circulars";

    const formData = new FormData();
    formData.append("department_id", department_id);
    formData.append("circular_number", circular.circular_number);
    formData.append("circular_name", circular.circular_name);
    formData.append("circular_date", circular.circular_date);
    formData.append("subject", circular.subject);
    if (circular.circular_file) {
      formData.append("circular_file", circular.circular_file);
    }

    try {
      const response = await API({
        url,
        method,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });

      if (
        response.data.message &&
        response.data.message.includes("successfully")
      ) {
        fetchCirculars(); // Refresh the list
        closePopup();
      }
    } catch (error) {
      console.error("Error saving circular:", error);
      toast.error(
        editCircular
          ? (error, " Failed to edit circular. Please try again.")
          : (error, "Failed to add circular. Please try again.")
      );
    }
  };

  // Handle deleting a circular
  const deleteCircular = async (circularId) => {
    try {
      const response = await API.delete(
        `/ece/department/circulars/${circularId}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Circular deleted successfully!");
        fetchCirculars(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting circular:", error);
      toast.error("Failed to delete circular. Please try again.");
    }
  };

  // Handle search by Circular Number or Subject
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, startDateFilter, endDateFilter);
  };

  // Handle date range filter
  const handleDateFilter = () => {
    applyFilters(searchQuery, startDateFilter, endDateFilter);
  };

  // Apply all filters
  const applyFilters = (searchQuery, startDate, endDate) => {
    let filtered = circulars;

    // Filter by search query (Circular Number or Subject or Name)
    if (searchQuery) {
      filtered = filtered.filter(
        (circular) =>
          circular.circular_number.includes(searchQuery) ||
          circular.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          circular.circular_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((circular) => {
        const circularDate = new Date(circular.circular_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return circularDate >= start && circularDate <= end;
      });
    }

    setFilteredCirculars(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStartDateFilter("");
    setEndDateFilter("");
    setFilteredCirculars(circulars); // Reset to all data
  };

  return (
    <>
      <div style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }}>
        <DepartmentHeader />
        <div className="flex min-h-screen">
          <div className="flex-1 pt-4 overflow-y-auto px-4">
            {/* Hero Section */}
            <HeroSection
              title="Department Circulars"
              subtitle="Manage all circulars and notices here."
              darkMode={darkMode}
            />

            {/* Filters Section */}
            <Card
              className="rounded-lg p-6 mt-6 shadow-sm border"
              style={{
                backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                color: darkMode ? "#C9CCD1" : "#2D3A4A",
                border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search by Circular Number / Subject */}
                <div className="flex flex-col">
                  <label
                    className="text-sm font-medium mb-2"
                    style={{ color: darkMode ? "#B0B3B8" : "#4A5568" }}
                  >
                    Circular Number / Name / Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Circular Number or Name Subject"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full p-3 rounded-md border transition-all duration-300"
                    style={{
                      backgroundColor: darkMode ? "#161722" : "#FFFFFF",
                      borderColor: darkMode ? "#464667" : "#D1D5DB",
                      color: darkMode ? "#EAEAEA" : "#1F252E",
                    }}
                  />
                </div>

                {/* Start Date */}
                <div className="flex flex-col">
                  <label
                    className="text-sm font-medium mb-2"
                    style={{ color: darkMode ? "#B0B3B8" : "#4A5568" }}
                  >
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full p-3 rounded-md border transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: darkMode ? "#161722" : "#FFFFFF",
                      borderColor: darkMode ? "#464667" : "#D1D5DB",
                      color: darkMode ? "#EAEAEA" : "#1F252E",
                    }}
                  />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                  <label
                    className="text-sm font-medium mb-2"
                    style={{ color: darkMode ? "#B0B3B8" : "#4A5568" }}
                  >
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full p-3 rounded-md border transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: darkMode ? "#161722" : "#FFFFFF",
                      borderColor: darkMode ? "#464667" : "#D1D5DB",
                      color: darkMode ? "#EAEAEA" : "#1F252E",
                    }}
                  />
                </div>
              </div>

              {/* Apply and Reset Buttons */}
              <div className="flex justify-center md:justify-end gap-4 mt-6">
                <button
                  onClick={handleDateFilter}
                  className="px-5 py-2 rounded-md border-2 font-medium text-sm transition-all duration-300"
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
                  onClick={resetFilters}
                  className="px-5 py-2 rounded-md border-2 font-medium text-sm transition-all duration-300"
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

            <div className="mt-6">
              <CustomTable
                title="Department Circulars"
                subtitle="Manage all circulars and notices here."
                columns={[
                  { key: "circular_number", label: "Circular Number" },
                  { key: "circular_name", label: "Title" },
                  { key: "subject", label: "Description" },
                  { key: "circular_date", label: "Date" },
                  {
                    key: "circular_path",
                    label: "Document",
                    render: (item) =>
                      item.circular_path ? (
                        <a
                          href={`${process.env.REACT_APP_BACKEND_URL}/${item.circular_path.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline font-poppins font-medium"
                        >
                          View
                        </a>
                      ) : (
                        "Not Uploaded"
                      ),
                  },
                  { key: "actions", label: "Actions" },
                ]}
                data={circulars}
                actions={{
                  edit: (circular) => openPopup(circular),
                  delete: (row) => deleteCircular(row.circular_id),
                }}
                onAdd={() => openPopup()} // Opens popup when Add button is clicked
              />
            </div>
          </div>
        </div>
      </div>
      <Popup
        trigger={null}
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        {(close) => (
          <div>
            <CircularPopup
              closeModal={close}
              saveCircular={saveCircular}
              circular={editCircular} // Pass the circular to pre-fill the form for editing
            />
          </div>
        )}
      </Popup>
    </>
  );
};

export default DepartmentCirculars;
