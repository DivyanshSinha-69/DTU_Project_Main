import React, { useState } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function StudentDetailsPopUp({
  fullName,
  dateOfBirth,
  gender,
  email,
  phoneNumber,
  address,
  bloodGroup,
  closeModal,
  handleAddStudentDetails,
}) {
  const [formData, setFormData] = useState({
    fullName: fullName || "",
    dateOfBirth: dateOfBirth || "",
    gender: gender || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
    address: address || "",
    bloodGroup: bloodGroup || "",
  });

  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    const {
      fullName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      address,
      bloodGroup,
    } = formData;

    if (!fullName || !dateOfBirth || !gender || !email || !phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Basic phone number validation (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (handleAddStudentDetails) {
      handleAddStudentDetails(formData);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 overflow-y-auto p-4">
      <Card
        color="transparent"
        shadow={false}
        className="w-[90%] max-w-[700px] h-auto max-h-[90vh] p-8 bg-gray-900 rounded-[20px] overflow-y-auto"
      >
        <form
          className="text-white flex flex-col space-y-6"
          onSubmit={handlePopupSubmit}
        >
          {/* Full Name */}
          <div className="relative z-0 w-full group">
            <label htmlFor="fullName" className="block text-sm">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.fullName}
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="relative z-0 w-full group">
            <label htmlFor="dateOfBirth" className="block text-sm">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.dateOfBirth}
              required
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
            />
          </div>

          {/* Gender Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="gender" className="block text-sm">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              id="gender"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSelectChange}
              value={formData.gender}
              required
            >
              <option value="">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div className="relative z-0 w-full group">
            <label htmlFor="email" className="block text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="relative z-0 w-full group">
            <label htmlFor="phoneNumber" className="block text-sm">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.phoneNumber}
              required
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          {/* Address */}
          <div className="relative z-0 w-full group">
            <label htmlFor="address" className="block text-sm">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows="3"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          {/* Blood Group Dropdown */}
          <div className="relative z-0 w-full group">
            <label htmlFor="bloodGroup" className="block text-sm">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              id="bloodGroup"
              className="block py-3 px-4 w-full text-sm bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSelectChange}
              value={formData.bloodGroup}
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Red Star Explanation */}
          <p className="text-sm text-gray-400">
            <span className="text-red-500">*</span> compulsory fields
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-5 space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {fullName ? "Update Details" : "Add Details"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
