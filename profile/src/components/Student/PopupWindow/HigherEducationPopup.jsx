import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import OfferLetterPdf from "./OfferLetterPdf";
import { setHigherEducationDetails } from "../../../redux/reducers/UserHigherEducationDetails";

export default function HigherEducationPopup(props) {
  const { closeModal,name, examName, instituteName} = props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pdfSrc, setPdfSrc] = useState("");
  const [formData, setFormData] = useState({
    examName: examName,
    instituteName: instituteName,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlepopup = async () => {
    try {
      if (
        !formData.examName ||
        !formData.instituteName
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await axios.put(
        "http://localhost:3001/ece/student/updatehighereducationdetails",
        {
          examName: formData.examName,
          instituteName: formData.instituteName,
          RollNo: RollNo,
        },
        {
          withCredentials: true,
        }
      );

      const updateddata = {
        examName: formData.examName,
        instituteName: formData.instituteName,
        offerLetter: pdfSrc,
        RollNo: RollNo,
      };

      dispatch(setHigherEducationDetails([{ ...updateddata }]));
      if (response.status === 201) {
        alert(response.data.message);
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 text-white">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Name of The Exam<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the Exam Name"
            value={formData.examName}
            onChange={handleChange}
            name="examName"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Institute Name<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the Institute Name"
            value={formData.instituteName}
            onChange={handleChange}
            name="instituteName"
            className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Offer Letter<p className="pl-1 text-red-600">*</p>
          </Typography>
          
          <OfferLetterPdf setPdfSrc={setPdfSrc} />
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
