import axios from "axios";
import React, { useState } from "react";
import { Alert } from "@material-tailwind/react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { addProfessionalSkill, updateProfessionalSkill } from "../../../redux/reducers/UserProfessionalSkills";

export default function AddPopupProfessionalSkills(props) {
  const { closeModal ,name} =props;
  const{RollNo} = useSelector(state=>state.auth.user)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    organisation: "",
    position: "",
    eventname: "",
    date: "",
    roll: ""
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
      const response = await axios.post(
        "http://localhost:3001/ece/student/addprofessionalskills",
        {
          organisation: formData.organisation,
          position: formData.position,
          eventname: formData.eventname,
          date: formData.date,
          roll: RollNo,
        },
        {
          withCredentials: true,
        }
      );

      // Handle success, e.g., show a success message or update state
      const updateddata = {
        Organisation: formData.organisation,
        Position: formData.position,
        EventName: formData.eventname,
        EventDate: formData.date,
        RollNo: formData.roll,
      };
      dispatch(addProfessionalSkill(updateddata));
      if (response.status == 201) {
        alert(response.data.message);
        closeModal();
      }
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error(error);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Organisation Name
          </Typography>
          <Input
            size="lg"
            placeholder="Organisation Name"
            value={formData.organisation}
            onChange={handleChange}
            name="organisation"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Role
          </Typography>
          <Input
            size="lg"
            placeholder="Role"
            value={formData.position}
            onChange={handleChange}
            name="position"
            className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Event
          </Typography>
          <Input
            size="lg"
            placeholder="Event"
            value={formData.eventname}
            onChange={handleChange}
            name="eventname"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Date
          </Typography>
          <Input
            size="lg"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChange={handleChange}
            name="date"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
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
