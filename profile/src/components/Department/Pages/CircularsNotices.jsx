import CustomTable from "../../DynamicComponents/CustomTable.jsx";
import { useState, useEffect } from "react";
import API from "../../../utils/API.js";

const CircularsNotices = () => {
  const [circulars, setCirculars] = useState([]); // State to store circulars

  // Columns for the table
  const columns = [
    { key: "circular_number", label: "Circular Number" },
    { key: "circular_name", label: "Title" },
    { key: "subject", label: "Description" },
    { key: "circular_date", label: "Date" },
    { key: "actions", label: "Actions" },
  ];

  // Fetch circulars from the backend
  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const response = await API.get("/ece/department/circulars");
      setCirculars(response.data.data);
    } catch (error) {
      console.error("Error fetching circulars:", error);
    }
  };

  // Handle adding a new circular
  const handleAddCircular = async (newCircular) => {
    try {
      const response = await API.post("/ece/department/circulars", newCircular);
      if (response.status === 201) {
        fetchCirculars(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding circular:", error);
    }
  };

  // Handle editing a circular
  const handleEditCircular = async (circular) => {
    try {
      const response = await API.put(
        `/ece/department/circulars/${circular.circular_id}`,
        circular
      );
      if (response.status === 200) {
        fetchCirculars(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating circular:", error);
    }
  };

  // Handle deleting a circular
  const handleDeleteCircular = async (circularId) => {
    try {
      const response = await API.delete(
        `/ece/department/circulars/${circularId}`
      );
      if (response.status === 200) {
        fetchCirculars(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting circular:", error);
    }
  };

  return (
    <div className="mt-4">
      <CustomTable
        title="Circulars/Notices"
        subtitle="Manage all circulars and notices here."
        columns={columns}
        data={circulars}
        actions={{
          edit: handleEditCircular,
          delete: handleDeleteCircular,
        }}
        onAdd={handleAddCircular}
      />
    </div>
  );
};

export default CircularsNotices;
