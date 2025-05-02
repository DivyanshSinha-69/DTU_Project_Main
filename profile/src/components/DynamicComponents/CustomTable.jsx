import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import editImg from "../../assets/edit.svg";
import deleteImg from "../../assets/delete.svg";
import addImg from "../../assets/add.svg"; // Import Add Icon
import { useThemeContext } from "../../context/ThemeContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Utility function to truncate text
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

const formatDateForInput = (date) => {
  if (!date) return "-";
  const [date1] = date?.split("T");
  const [year, month, day] = date1?.split("-");
  return `${day}-${month}-${year}`;
};

const CustomTable = ({
  title,
  subtitle,
  columns,
  data,
  actions,
  onAdd,
  facultyMapping,
}) => {
  const { darkMode } = useThemeContext();
  const wordLimit = 4; // Set your desired word limit here
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Toggle expanded state for a row
  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card
      className="rounded-2xl p-4 w-full mx-auto"
      style={{
        backgroundColor: darkMode ? "#0D1117" : "#FFFFFF", // Updated dark mode color
        color: darkMode ? "#C9CCD1" : "#2D3A4A", // Softer text color
        border: darkMode ? "1px solid #22232B" : "1px solid #D1D5DB", // Subtle border
      }}
    >
      {/* Table Header Section */}
      <div className="flex flex-row justify-between items-center mb-5">
        {/* Title & Subtitle */}
        <div>
          <Typography
            variant="h5"
            className="font-poppins font-semibold text-xl" // Adjusted font size
            style={{ color: darkMode ? "#C9CCD1" : "#2D3A4A" }} // Softer text color
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="small"
              className="text-red-500 mt-1 font-poppins font-medium" // Updated font style
            >
              {subtitle}
            </Typography>
          )}
        </div>

        {/* Add Button (Aligned to Right) */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all ease-in" // Improved hover effect
          >
            <img src={addImg} alt="add" className="h-5 w-5" />
          </button>
        )}
      </div>
      {/* Table Container - Seamless Design */}
      <div className="w-full overflow-x-auto">
        <table
          className="w-full min-w-auto lg:min-w-max table-auto text-left"
          style={{
            backgroundColor: "transparent", // No background, seamless look
            color: darkMode ? "#C9CCD1" : "#2D3A4A", // Softer text color
          }}
        >
          {/* Table Head */}
          <thead>
            <tr
              style={{
                backgroundColor: darkMode ? "#161B22" : "#F0F2F5",
                color: darkMode ? "#A0A4A8" : "#6B7280", // Softer text color
              }}
            >
              {/* Expand/Collapse Column */}
              <th
                className="border-b p-4"
                style={{
                  borderBottom: darkMode
                    ? "1px solid #21262D"
                    : "1px solid #DADDE1",
                }}
              >
                Expand{/* Empty header for the expand/collapse button */}
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-b p-4 ${col.key === "actions" ? "text-right" : ""}`}
                  style={{
                    borderBottom: darkMode
                      ? "1px solid #21262D"
                      : "1px solid #DADDE1",
                  }}
                >
                  <Typography
                    variant="small"
                    className="font-poppins font-medium leading-none"
                    style={{ opacity: 0.8, letterSpacing: "0.5px" }} // Improved typography
                  >
                    {col.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentItems?.map((row, index) => {
              const isLast = index === currentItems.length - 1;
              const isExpanded = expandedRow === (row.id || index);

              return (
                <React.Fragment key={row.id || `row-${index}`}>
                  {/* Main Row */}
                  <tr
                    className="hover:bg-opacity-10 transition-all" // Subtle hover effect
                    style={{
                      backgroundColor: "transparent",
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
                        onClick={() => toggleRow(row.id || index)}
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
                    {columns.map((col) => {
                      let cellValue = row[col.key];
                      if (
                        col.key === "Document" ||
                        col.key === "order_path" ||
                        col.key === "circular_path" ||
                        col.key === "document"
                      ) {
                        return (
                          <td key={col.key} className="p-4">
                            {cellValue ? (
                              <a
                                href={`${process.env.REACT_APP_BACKEND_URL}/${cellValue}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline font-poppins font-medium" // Updated font style
                              >
                                View
                              </a>
                            ) : (
                              <Typography
                                variant="small"
                                className="font-poppins font-medium" // Updated font style
                              >
                                Not Uploaded
                              </Typography>
                            )}
                          </td>
                        );
                      } else if (col.key === "faculties") {
                        // Display the length of the faculties array in normal view
                        return (
                          <td key={col.key} className="p-4">
                            <Typography
                              variant="small"
                              className="font-poppins font-normal"
                              style={{
                                color: darkMode ? "#C9CCD1" : "#2D3A4A", // Softer text color
                                letterSpacing: "0.3px", // Improved typography
                              }}
                            >
                              {cellValue ? cellValue.length : 0} Faculty
                            </Typography>
                          </td>
                        );
                      }
                      return col.key === "actions" ? (
                        <td key={col.key} className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <div className="flex justify-end gap-2">
                              {/* Edit Button */}
                              <button
                                onClick={() => actions.edit(row)}
                                className="p-2 rounded-lg border-2 transition-all duration-300 ease-in-out"
                                style={{
                                  borderColor: darkMode ? "#4C9A2A" : "#48BB78", // Soft green border for dark mode and light mode
                                  color: darkMode ? "#4C9A2A" : "#48BB78", // Soft green icon color to match the border
                                  width: "36px", // Fixed width for button
                                  height: "36px", // Fixed height for button
                                }}
                                onMouseEnter={
                                  (e) =>
                                    (e.target.style.borderColor = darkMode
                                      ? "#68D391"
                                      : "#38A169") // Hover effect for border
                                }
                                onMouseLeave={
                                  (e) =>
                                    (e.target.style.borderColor = darkMode
                                      ? "#4C9A2A"
                                      : "#48BB78") // Reset border on mouse leave
                                }
                              >
                                <img
                                  src={editImg}
                                  alt="edit"
                                  className="h-4 w-4" // Fixed size for icon (will stay consistent)
                                  style={{
                                    filter: darkMode
                                      ? "invert(0.3)"
                                      : "invert(1)", // Invert the icon color for dark mode, keep original for light mode
                                  }}
                                />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => actions.delete(row)}
                                className="p-2 rounded-lg border-2 transition-all duration-300 ease-in-out"
                                style={{
                                  borderColor: darkMode ? "#D45D5D" : "#F56565", // Soft muted red border for dark mode and light mode
                                  color: darkMode ? "#D45D5D" : "#F56565", // Red icon color to match the border
                                  width: "36px", // Fixed width for button
                                  height: "36px", // Fixed height for button
                                }}
                                onMouseEnter={
                                  (e) =>
                                    (e.target.style.borderColor = darkMode
                                      ? "#FC8181"
                                      : "#E53E3E") // Hover effect for border
                                }
                                onMouseLeave={
                                  (e) =>
                                    (e.target.style.borderColor = darkMode
                                      ? "#D45D5D"
                                      : "#F56565") // Reset border on mouse leave
                                }
                              >
                                <img
                                  src={deleteImg}
                                  alt="delete"
                                  className="h-4 w-4" // Fixed size for icon
                                  style={{
                                    filter: "none", // Neutral icon color for delete button
                                  }}
                                />
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <td key={col.key} className="p-4">
                          <Typography
                            variant="small"
                            className="font-poppins font-normal"
                            style={{
                              color: darkMode ? "#C9CCD1" : "#2D3A4A", // Softer text color
                              letterSpacing: "0.3px", // Improved typography
                            }}
                            title={
                              typeof cellValue === "string"
                                ? cellValue
                                : cellValue
                                  ? cellValue
                                  : "-"
                            } // Add title attribute for tooltip
                          >
                            {typeof cellValue === "string"
                              ? truncateText(cellValue, wordLimit).truncated // Truncate all string values
                              : cellValue
                                ? cellValue
                                : "-"}
                          </Typography>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Expanded Row */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }} // Smooth and subtle animation
                      >
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
                                      color: darkMode ? "#C9CCD1" : "#2D3A4A",
                                    }}
                                  >
                                    {col.label}
                                  </Typography>
                                  {col.key === "Document" ||
                                  col.key === "order_path" ||
                                  col.key === "circular_path" ? (
                                    row[col.key] ? (
                                      <a
                                        href={`${process.env.REACT_APP_BACKEND_URL}/public/${row[col.key]}`}
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
                                  ) : col.key === "faculties" ? (
                                    // Display faculty names in expanded view
                                    <div className="flex flex-col gap-1">
                                      // Replace the faculty mapping section
                                      with:
                                      {row[col.key]?.map(
                                        (facultyId, facultyIndex) => (
                                          <Typography
                                            key={`faculty-${facultyId}-${facultyIndex}`} // Combined key
                                            variant="small"
                                            className="font-poppins font-normal"
                                            style={{
                                              color: darkMode
                                                ? "#C9CCD1"
                                                : "#2D3A4A",
                                            }}
                                          >
                                            {facultyMapping[facultyId] ||
                                              "Unknown Faculty"}
                                          </Typography>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <Typography
                                      variant="small"
                                      className="font-poppins font-normal"
                                      style={{
                                        color: darkMode ? "#C9CCD1" : "#2D3A4A",
                                      }}
                                    >
                                      {row[col.key] || "-"}
                                    </Typography>
                                  )}
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
      <div className="flex justify-center mt-4">
        <nav className="flex items-center gap-2">
          {/* Previous Button */}
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
          {/* Page Numbers */}
          {Array?.from(
            { length: Math.ceil(data?.length / itemsPerPage) },
            (_, i) => (
              <button
                key={`page-${i + 1}`} // Add explicit key
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
          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(data?.length / itemsPerPage)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
        ${
          currentPage === Math.ceil(data?.length / itemsPerPage)
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
  );
};

export default CustomTable;
