import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import editImg from "../../assets/edit.svg";
import deleteImg from "../../assets/delete.svg";
import addImg from "../../assets/add.svg"; // Import Add Icon
import { useThemeContext } from "../../context/ThemeContext";

const formatDateForInput = (date) => {
  if (!date) return "-";
  const [date1] = date?.split("T");
  const [year, month, day] = date1?.split("-");
  return `${day}-${month}-${year}`;
};

const CustomTable = ({ title, subtitle, columns, data, actions, onAdd }) => {
  const { darkMode } = useThemeContext();

  return (
    <Card
      className="shadow-2xl rounded-2xl p-6 max-w-7xl w-full mx-auto"
      style={{
        backgroundColor: darkMode ? "#0D1117" : "#FFFFFF", // Updated dark mode color
        color: darkMode ? "#C9CCD1" : "#2D3A4A", // Softer text color
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
        <button
          onClick={onAdd}
          className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all ease-in" // Improved hover effect
        >
          <img src={addImg} alt="add" className="h-5 w-5" />
        </button>
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
            {data?.map((row, index) => {
              const isLast = index === data?.length - 1;
              return (
                <tr
                  key={index}
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
                  {columns.map((col) => {
                    let cellValue = row[col.key];
                    if (col.key === "Document") {
                      return (
                        <td key={col.key} className="p-4">
                          {cellValue ? (
                            <a
                              href={`${process.env.REACT_APP_BACKEND_URL}/public/${cellValue.name}`}
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
                    }
                    return col.key === "actions" ? (
                      <td key={col.key} className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              actions.edit(row);
                              console.log(row);
                            }}
                            className="p-2 rounded-full transition-transform hover:scale-105"
                            style={{
                              backgroundColor: darkMode ? "#238636" : "#2D9C4A",
                              color: "#FFFFFF",
                            }}
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => actions.delete(row)}
                            className="p-2 rounded-full transition-transform hover:scale-105"
                            style={{
                              backgroundColor: darkMode ? "#D32F2F" : "#E53935",
                              color: "#FFFFFF",
                            }}
                          >
                            <img
                              src={deleteImg}
                              alt="delete"
                              className="h-5 w-5 filter brightness-0 invert"
                            />
                          </button>
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
                        >
                          {cellValue ? cellValue : "-"}
                        </Typography>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CustomTable;
