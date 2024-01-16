import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { addPlacement } from "../../../redux/reducers/UserPlacementDetail";
import PlacementPdf from "./PlacementPdf";
import toast from 'react-hot-toast';

export default function AddPlacementsPopup(props) {
  const { closeModal, name} = props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pdfSrc, setPdfSrc] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    placementType: "",
    joiningDate: "",
    appointmentLetter: "",
  });

  const[id,setId]=useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlepopup = async () => {
    

    if (!formData.companyName || !formData.placementType || !formData.joiningDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const response = await axios.post(
        "http://localhost:3001/ece/student/addplacement",
        {
          companyName: formData.companyName,
          placementType: formData.placementType,
          joiningDate: formData.joiningDate,
          roll: RollNo,
          ID: id,
        },
        {
          withCredentials: true,
        }
      );


      // Handle success, e.g., show a success message or update state
      const updateddata = {
        companyName: formData.companyName,
        placementType: formData.placementType,
        joiningDate: formData.joiningDate,
        RollNo: RollNo,      
        appointmentLetter:pdfSrc,
        ID:id,
      };
    //   {console.log(pdfSrc)}
      dispatch(addPlacement(updateddata));

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
            Placement Type<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="On-campus / Off-campus"
            value={formData.organisation}
            onChange={handleChange}
            name="placementType"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Company Name<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Name of the Company"
            value={formData.position}
            onChange={handleChange}
            name="companyName"
            className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Joining Date<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="YYYY-MM-DD"
            value={formData.eventname}
            onChange={handleChange}
            name="joiningDate"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Appointment Letter<p className="pl-1 text-red-600">*</p>
          </Typography>
          {/* <Input
            type="file"
            value={formData.date}
            onChange={handleChange}
            name="appointmentLetter"
            accept=".pdf"
            className="border-none pl-2 h-[40px]"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          /> */}
          <PlacementPdf id={id} setId={setId} setPdfSrc={setPdfSrc}/>
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


