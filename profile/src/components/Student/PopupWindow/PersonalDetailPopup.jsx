import axios from "axios";
import React, { useState } from "react";
import { Card,} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { updatePersonalDetails } from "../../../redux/reducers/UserPersonalDetails";
import toast from 'react-hot-toast';
export default function PersonalDetailPopup(props) {
  const {
    closeModal,
    rollNo,
    motherName,
    fatherName,
    personalContactNo,
    parentContactNo,
    personalEmail,
    dtuEmail,
    studentimage,
  } = props;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    motherName: motherName,
    fatherName: fatherName,
    personalContactNo: personalContactNo,
    parentContactNo: parentContactNo,
    personalEmail: personalEmail,
    dtuEmail: dtuEmail,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlepopup = async (e) => {
    e.preventDefault();
    if (
      !formData.motherName ||
      !formData.fatherName ||
      !formData.personalContactNo ||
      !formData.parentContactNo ||
      !formData.personalEmail ||
      !formData.dtuEmail
    ) {
      toast.error("Please fill in all required fields");
      return;
    } else {
      // Check if personalContactNo and parentContactNo have exactly 10 digits
      const phoneRegex = /^\d+$/;
    
      if (!phoneRegex.test(formData.personalContactNo) || !phoneRegex.test(formData.parentContactNo)) {
        toast.error("Please enter valid 10-digit phone numbers for Personal and Parent contacts");
        return;
      }
    
      // Check if personalEmail and dtuEmail are valid email addresses
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!emailRegex.test(formData.personalEmail) || !emailRegex.test(formData.dtuEmail)) {
        toast.error("Please enter valid email addresses for Personal and DTU emails");
        return;
      }
    
      // Your code for further processing when all conditions are met
    }
    try {
      const response = await axios.put(
        "http://localhost:3001/ece/student/updatepersonaldetails",
        {
          id: rollNo,
          motherName: formData.motherName,
          fatherName: formData.fatherName,
          personalContactNo: formData.personalContactNo,
          parentContactNo: formData.parentContactNo,
          personalEmail: formData.personalEmail,
          dtuEmail: formData.dtuEmail,
        },
        {
          withCredentials: true,
        }
      );

      // Handle success, e.g., show a success message or update state
      const updateddata = {
        RollNo: rollNo,
        motherName: formData.motherName,
        fatherName: formData.fatherName,
        personalContactNo: formData.personalContactNo,
        parentContactNo: formData.parentContactNo,
        personalEmail: formData.personalEmail,
        dtuEmail: formData.dtuEmail,
      };

      dispatch(updatePersonalDetails([{ ...updateddata }]));

      if (response.status === 200) {
        toast.success(response.data.message);
        closeModal();
      }
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error(error);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <form class="max-w-md mx-auto text-white">
        <div class="grid md:grid-cols-2 md:gap-6">
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="motherName"
              id="floating_first_name"
              class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.motherName}
            />
            <label
              for="floating_first_name"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Mother's Name
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="fatherName"
              id="floating_last_name"
              class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.fatherName}
            />
            <label
              for="floating_last_name"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Father's Name
            </label>
          </div>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="personalContactNo"
            id="floating_personalNo"
            class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.personalContactNo}
          />
          <label
            for="floating_personalNo"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Contact Number
          </label>
        </div>
        <div class="grid md:grid-cols-2 md:gap-6">
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="personalEmail"
              id="floating_personalEmail"
              class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.personalEmail}
            />
            <label
              for="floating_personalEmail"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Personal Email id
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="dtuEmail"
              id="floating_dtuEmail"
              class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              onChange={handleChange}
              value={formData.dtuEmail}
            />
            <label
              for="floating_dtuEmail"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              College Email id
            </label>
          </div>
        </div>
        <div class="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            name="parentContactNo"
            id="floating_parentsNo"
            class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={handleChange}
            value={formData.parentContactNo}
          />
          <label
            for="floating_parentsNo"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Parent's Contact No.
          </label>
        </div>
        <button
          onClick={handlepopup}
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </Card>
  );
}
