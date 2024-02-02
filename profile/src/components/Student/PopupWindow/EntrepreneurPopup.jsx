import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setEntrepreneurDetails } from "../../../redux/reducers/UserEntrepreneurDetails";
import CompanyRegCertPdf from "./CompanyRegCertPdf";
import toast from 'react-hot-toast';

export default function EntrepreneurPopup(props) {
  const { closeModal,name, companyName, cinNumber, companyLink } = props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pdfSrc, setPdfSrc] = useState("");
  const [formData, setFormData] = useState({
    companyName: companyName,
    cinNumber: cinNumber,
    companyLink: companyLink,
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
      if (!formData.companyName || !formData.companyLink || !formData.cinNumber) {
        toast.error("Please fill in all required fields");
        return;
      } else {
        // Check if the companyLink is a valid URL
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      
        if (!urlRegex.test(formData.companyLink)) {
          toast.error("Please enter a valid website link for the company");
          return;
        }
      
        // Your code for further processing when all conditions are met
      }
      

      const response = await axios.put(
        "http://18.212.137.222/ece/student/updateentrepreneurdetails",
        {
          companyName: formData.companyName,
          cinNumber: formData.cinNumber,
          companyLink: formData.companyLink,
          RollNo: RollNo,
        },
        {
          withCredentials: true,
        }
      );
     
      const updateddata = {
        companyName: formData.companyName,
        cinNumber: formData.cinNumber,
        companyLink: formData.companyLink,
        companyRegCertificate: pdfSrc,
        RollNo: RollNo,
      };

      dispatch(setEntrepreneurDetails([{ ...updateddata }]));
      if (response.status === 201) {
        toast.success(response.data.message);
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
            Company Name<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the Company Name "
            value={formData.companyName}
            onChange={handleChange}
            name="companyName"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            CIN Number<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the CIN Number"
            value={formData.cinNumber}
            onChange={handleChange}
            name="cinNumber"
            className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Website/LinkedIn<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the Link"
            value={formData.companyLink}
            onChange={handleChange}
            name="companyLink"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Registration Certificate<p className="pl-1 text-red-600">*</p>
          </Typography>
          
          <CompanyRegCertPdf setPdfSrc={setPdfSrc} />
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
