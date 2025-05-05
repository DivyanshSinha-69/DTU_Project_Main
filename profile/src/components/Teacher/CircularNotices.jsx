import React, { useEffect, useState } from "react";
import HeroSection from "../DynamicComponents/HeroSection";
import FacultyHeader from "./FacultyHeader";
import { useThemeContext } from "../../context/ThemeContext";
import API from "../../utils/API.js";
import toast from "react-hot-toast";
import { Card, Typography, Input } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import CustomTable from "../DynamicComponents/CustomTable";

const FacultyCircularPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { department_id } = user;
  const { darkMode } = useThemeContext();
  const [circularsData, setCircularsData] = useState([]); // State to store circulars data
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [facultySearchQuery, setFacultySearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filteredCirculars, setFilteredCirculars] = useState([]);

  // Format date to "dd/mm/yyyy"
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };

  // Fetch circulars when the component mounts
  const fetchCirculars = async () => {
    try {
      const response = await API.get(
        `/ece/faculty/circulars/${department_id}`,
        {
          params: {
            faculty_id: user.faculty_id,
          },
        }
      );

      // Check if the response contains valid data
      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data
          .map((circular) => ({
            circular_id: circular.circular_id,
            circular_number: circular.circular_number,
            circular_name: circular.circular_name,
            circular_date: formatDateForInput(circular.circular_date),
            subject: circular.subject,
            circular_path: circular.circular_path,
            created_at: circular.created_at,
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by created_at (latest first)

        setCircularsData(formattedData);
        setFilteredCirculars(formattedData); // Initialize filtered circulars with all data
      } else {
        // No circulars found, but this is not an error
        setCircularsData([]);
        setFilteredCirculars([]);
      }
    } catch (error) {
      // Only show toast error for server errors (e.g., 500, network issues)
      if (error.response && error.response.status >= 500) {
        console.error("❌ Server error fetching circulars:", error);
        toast.error("⚠️ Failed to fetch circulars due to a server error.");
      } else {
        console.error("❌ Error fetching circulars:", error);
        // Do not show toast error for non-server errors (e.g., 404)
      }
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };
  // Handle search by Circular Number or Subject
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
    let filtered = circularsData;

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

    // Filter by faculty name (Undersigned)
    if (facultyQuery) {
      filtered = filtered.filter((circular) =>
        circular.subject.toLowerCase().includes(facultyQuery.toLowerCase())
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
    setStartDateFilter("");
    setEndDateFilter("");
    setSearchQuery("");
    setFacultySearchQuery("");
    setFilteredCirculars(circularsData); // Reset to all data
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchCirculars();
  }, [department_id]);

  return (
    <div
      style={{ backgroundColor: darkMode ? "#1E1E2E" : "#F4F5F7" }} // Adjusted dark mode background
    >
      <FacultyHeader />
      <div className="flex min-h-screen">
        <div className="flex-1 pt-4 overflow-y-auto px-4">
          {/* Hero Section */}
          <HeroSection
            title="Faculty Circulars"
            subtitle="View and manage all faculty circulars"
            darkMode={darkMode}
          />

          {/* Filters Section */}
          <Card
            className="rounded-lg p-6 mt-6 border"
            style={{
              backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
              color: darkMode ? "#C9CCD1" : "#2D3A4A",
              border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search Field - Full Width on Small, Spans Two Columns on Large */}
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
                >
                  Circular Number / Name / Subject
                </label>
                <Input
                  type="text"
                  placeholder="Enter Name Subject or Number"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-2 rounded-lg border transition-all duration-300"
                  style={{
                    backgroundColor: darkMode ? "#0D1117" : "#FFFFFF",
                    color: darkMode ? "#C9CCD1" : "#2D3A4A",
                    borderColor: darkMode ? "#22232B" : "#D1D5DB",
                  }}
                />
              </div>

              {/* Order Date Range Filters - Labeled Start Date & End Date */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
                  >
                    Start Date (Order Date)
                  </label>
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
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }}
                  >
                    End Date (Order Date)
                  </label>
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

              {/* Apply Button */}
              <div className="md:col-span-1 flex items-end">
                <button
                  onClick={handleDateFilter}
                  className="w-full px-4 py-2 rounded-md border-2 font-medium text-sm transition-all duration-300"
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
              </div>

              {/* Reset Button */}
              <div className="md:col-span-1 flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 rounded-md border-2 font-medium text-sm transition-all duration-300"
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
            </div>
          </Card>

          {/* Custom Table */}
          <div className="pt-4 pb-3">
            <CustomTable
              title="Faculty Circulars"
              subtitle="List of all faculty circulars"
              columns={[
                { key: "circular_number", label: "Circular Number" },
                { key: "circular_name", label: "Circular Name" },
                { key: "subject", label: "Subject" },

                { key: "circular_date", label: "Circular Date" },
                { key: "circular_path", label: "Document" }, // View Button for Documents
              ]}
              data={filteredCirculars}
              facultyMapping={{}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCircularPage;
