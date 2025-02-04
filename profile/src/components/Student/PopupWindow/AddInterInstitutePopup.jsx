import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { addInterInstitute } from "../../../redux/reducers/UserInterInstituteDetails";
import toast from "react-hot-toast";
import InterInstituteCertificates from "./InterInstitutecertificates";

export default function AddInterInstitutePopup(props) {
  const { closeModal, name } = props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pdfSrc, setPdfSrc] = useState("");
  const [formData, setFormData] = useState({
    collegeName: "",
    eventName: "",
    eventDate: "",
    position: "",
  });

  const [id, setId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlepopup = async () => {
    if (
      !formData.collegeName ||
      !formData.eventName ||
      !formData.eventDate ||
      !formData.position
    ) {
      toast.error("Please fill in all required fields");
    } else {
      // Check if the joiningDate is in the format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(formData.eventDate)) {
        toast.error("Please enter the event date in the format YYYY-MM-DD");
        return;
      }

      // Your code for further processing when all conditions are met
    }

    try {
      const response = await axios.post(
        "https://64.227.135.99:3001/ece/student/addinterinstituteactivity",
        {
          collegeName: formData.collegeName,
          eventName: formData.eventName,
          eventDate: formData.eventDate,
          position: formData.position,
          roll: RollNo,
          ID: id,
        },
        {
          withCredentials: true,
        },
      );

      // Handle success, e.g., show a success message or update state
      const updateddata = {
        collegeName: formData.collegeName,
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        position: formData.position,
        RollNo: RollNo,
        certificate: pdfSrc,
        ID: id,
      };
      //   {console.log(pdfSrc)}
      dispatch(addInterInstitute(updateddata));

      if (response.status == 201) {
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
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 text-white">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            College Name<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the college name"
            value={formData.collegeName}
            onChange={handleChange}
            name="collegeName"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Event Name<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the event name"
            value={formData.eventName}
            onChange={handleChange}
            name="eventName"
            className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Event Date<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="YYYY-MM-DD"
            value={formData.eventDate}
            onChange={handleChange}
            oninput={() => validateInput(this)}
            name="eventDate"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />

          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Position<p className="pl-1 text-red-600">*</p>
          </Typography>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.position}
            name="position"
            onChange={handleChange}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
            <option value="Participation">Participation</option>
          </select>

          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Certificate<p className="pl-1 text-red-600">*</p>
          </Typography>
          {/* <Input
            type="file"
            value={formData.date}
            onChange={handleChange}
            name="appointmentLetter"
            accept=".pdf"
            className="border-none pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          /> */}
          <InterInstituteCertificates
            id={id}
            setId={setId}
            setPdfSrc={setPdfSrc}
          />
        </div>

        <Button
          className="mt-6 bg-gray-700 w-auto ml-auto mr-auto p-2 font1 text-gray-200 pl-2 pr-2"
          fullWidth
          onClick={handlepopup}
        >
          {name}
        </Button>
      </form>
    </Card>
  );
}

function validateInput(inputElement) {
  const errorMessageElement = document.getElementById("errorMessage");
  const inputValue = inputElement.value;

  // Check if the input matches the pattern (only numbers)
  if (!/^[0-9]*$/.test(inputValue)) {
    errorMessageElement.textContent = "Please enter numbers only.";
  } else {
    errorMessageElement.textContent = "";
  }
}
