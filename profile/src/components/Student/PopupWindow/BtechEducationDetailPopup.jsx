import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import MtechScoreCardPdf from "./MtechScoreCardPdf";
import { setMtechEducation } from "../../../redux/reducers/UserMtechEducationalDetails";
import toast from "react-hot-toast";
import { setBtechEducation } from "../../../redux/reducers/UserBtechEducationalDetails";

export default function BtechEducationDetailPopup(props) {
  const { closeModal, name, air, admittedThrough } =
    props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    admittedThrough: admittedThrough,
    air: air
  });

  const [admissionMethod, setAdmissionMethod] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setAdmissionMethod(e.target.value);
    formData.admittedThrough = e.target.value;
  };

  const handlepopup = async () => {
    try {
      if (formData.admittedThrough == "JEE") {
        if (
          !formData.admittedThrough ||
          !formData.air 
        ) {
          toast.error("Please fill in all required fields");
          return;
        } else {
          // Check if gateAir contains only digits
          if (!/^\d+$/.test(formData.air)) {
            toast.error(" Air field should only contain digits");
            return;
          }

          
        }

        const response = await axios.put(
          "http://eceportal.dtu.ac.in:3001/ece/student/updatebtecheducationdetails",
          {
            admittedThrough: formData.admittedThrough,
            air: formData.air,
            RollNo: RollNo,
          },
          {
            withCredentials: true,
          }
        );

        const updateddata = {
          admittedThrough: formData.admittedThrough,
          air: formData.air,
          RollNo: RollNo,
        };

        dispatch(setBtechEducation([{ ...updateddata }]));
        if (response.status === 201) {
          toast.success(response.data.message);
          closeModal();
        }
      } else {
        const response = await axios.put(
          "http://eceportal.dtu.ac.in:3001/ece/student/updatebtecheducationdetails",
          {
            admittedThrough: formData.admittedThrough,
            air:null,
            RollNo: RollNo,
          },
          {
            withCredentials: true,
          }
        );

        const updateddata = {
          admittedThrough: formData.admittedThrough,
          air:null,
          RollNo: RollNo,
        };

        dispatch(setBtechEducation([{ ...updateddata }]));
        if (response.status === 201) {
          toast.success(response.data.message);
          closeModal();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 text-white">
        <div className="w-96 mb-[20px]">
          <label
            htmlFor="admissionMethod"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Admitted Through :
          </label>
          <select
            id="admissionMethod"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={admissionMethod}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="JEE">JEE</option>
            <option value="Non-JEE">Non-JEE</option>
          </select>
        </div>

        {admissionMethod === "JEE" && (
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            All India Rank(General Rank)<p className="pl-1 text-red-600">*</p>
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your AIR"
              value={formData.air}
              onChange={handleChange}
              name="air"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        )}

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
