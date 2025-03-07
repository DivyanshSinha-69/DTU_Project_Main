import { useThemeContext } from "../../../context/ThemeContext.jsx";
import CustomTable from "../../DynamicComponents/CustomTable.jsx";
import { useState } from "react";

const Duties = () => {
  const [duties, setDuties] = useState([]); // State to store duties

  // Columns for the table
  const columns = [
    { key: "duty", label: "Duty" },
    { key: "upload", label: "Upload" },
    { key: "teachers", label: "Teachers" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "actions", label: "Actions" },
  ];

  // Sample data (replace with API data)
  const data = [
    {
      id: 1,
      duty: "Exam Duty",
      upload: "exam_duty.pdf",
      teachers: ["Teacher 1", "Teacher 2"],
      startDate: "2023-10-10",
      endDate: "2023-10-15",
    },
    {
      id: 2,
      duty: "Lab Duty",
      upload: "lab_duty.pdf",
      teachers: ["Teacher 3"],
      startDate: "2023-10-20",
      endDate: "2023-10-25",
    },
  ];

  // Handle adding a new duty
  const handleAddDuty = () => {
    // Logic to add a new duty
  };

  // Handle editing a duty
  const handleEditDuty = (row) => {
    // Logic to edit a duty
  };

  // Handle deleting a duty
  const handleDeleteDuty = (row) => {
    // Logic to delete a duty
  };

  return (
    <div className="mt-4">
      <CustomTable
        title="Duties"
        subtitle="Assign and manage duties for faculty members."
        columns={columns}
        data={data}
        actions={{
          edit: handleEditDuty,
          delete: handleDeleteDuty,
        }}
        onAdd={handleAddDuty}
      />
    </div>
  );
};

export default Duties;
