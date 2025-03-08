import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import MtechScoreCardPdf from "./MtechScoreCardPdf";
import { setMtechEducation } from "../../../redux/reducers/student/UserMtechEducationalDetails";
import toast from "react-hot-toast";

export default function MtechEducationDetailPopup(props) {
  const { closeModal, name, gateRollNo, gateAir, gateMarks, admittedThrough } =
    props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pdfSrc, setPdfSrc] = useState("");
  const [formData, setFormData] = useState({
    admittedThrough: admittedThrough,
    gateRollNo: gateRollNo,
    gateAir: gateAir,
    gateMarks: gateMarks,
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
      if (formData.admittedThrough == "GATE") {
        if (
          !formData.admittedThrough ||
          !formData.gateRollNo ||
          !formData.gateAir ||
          !formData.gateMarks
        ) {
          toast.error("Please fill in all required fields");
          return;
        } else {
          // Check if gateAir contains only digits
          if (!/^\d+$/.test(formData.gateAir)) {
            toast.error("Gate Air field should only contain digits");
            return;
          }

          // Check if gateMarks contains only digits and is less than or equal to 100
          if (
            !/^\d+(\.\d+)?$/.test(formData.gateMarks) ||
            parseFloat(formData.gateMarks) > 100
          ) {
            toast.error(
              "Gate Marks should only contain digits and be less than or equal to 100"
            );
            return;
          }

          // Continue with the rest of your code if all checks pass
          // ...
        }

        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/ece/student/updatemtecheducationdetails`,
          {
            admittedThrough: formData.admittedThrough,
            gateRollNo: formData.gateRollNo,
            gateAir: formData.gateAir,
            gateMarks: formData.gateMarks,
            RollNo: RollNo,
          },
          {
            withCredentials: true,
          }
        );

        const updateddata = {
          admittedThrough: formData.admittedThrough,
          gateRollNo: formData.gateRollNo,
          gateAir: formData.gateAir,
          gateMarks: formData.gateMarks,
          gateScoreCard: pdfSrc,
          RollNo: RollNo,
        };

        dispatch(setMtechEducation([{ ...updateddata }]));
        if (response.status === 201) {
          toast.success(response.data.message);
          closeModal();
        }
      } else {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/ece/student/updatemtecheducationdetails`,
          {
            admittedThrough: formData.admittedThrough,
            gateRollNo: null,
            gateAir: null,
            gateMarks: null,
            RollNo: RollNo,
          },
          {
            withCredentials: true,
          }
        );

        const updateddata = {
          admittedThrough: formData.admittedThrough,
          gateRollNo: null,
          gateAir: null,
          gateMarks: null,
          gateScoreCard: null,
          RollNo: RollNo,
        };

        dispatch(setMtechEducation([{ ...updateddata }]));
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
            <option value="GATE">GATE</option>
            <option value="Non-GATE">Non-GATE</option>
          </select>
        </div>

        {admissionMethod === "GATE" && (
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
              GATE RollNo.<p className="pl-1 text-red-600">*</p>
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your GATE Roll No "
              value={formData.gateRollNo}
              onChange={handleChange}
              name="gateRollNo"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
              GATE AIR<p className="pl-1 text-red-600">*</p>
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your AIR"
              value={formData.gateAir}
              onChange={handleChange}
              name="gateAir"
              className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
              GATE MARKS<p className="pl-1 text-red-600">*</p>
            </Typography>
            <Input
              size="lg"
              placeholder="Enter Your Marks"
              value={formData.gateMarks}
              onChange={handleChange}
              name="gateMarks"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 !h-[40px]"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
              SCORE CARD<p className="pl-1 text-red-600">*</p>
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
            <MtechScoreCardPdf setPdfSrc={setPdfSrc} />
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
