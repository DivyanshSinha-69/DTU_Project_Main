import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import AssociationPopUp from "../PopUp/AssociationPopUp";
import '../../../styles/popup.css';
import editImg from "../../../assets/edit.svg";

const Association = ({ setBlurActive }) => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [associationDetails, setAssociationDetails] = useState({
        highestDesignation: "",
        highestDesignationDate: "",
        associateProfessorStartDate: "",
        associateProfessorEndDate: "",
        assistantProfessorStartDate: "",
        assistantProfessorEndDate: "",
    });

    // Load data from localStorage on mount or set dummy data
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("associationDetails"));
        
        // If no saved data, initialize with dummy data
        if (savedData) {
            setAssociationDetails(savedData);
        } else {
            const dummyData = {
                highestDesignation: "Professor",
                highestDesignationDate: "2020-01-15",
                associateProfessorStartDate: "2016-08-01",
                associateProfessorEndDate: "2019-12-31",
                assistantProfessorStartDate: "2010-09-10",
                assistantProfessorEndDate: "2016-07-31",
            };
            setAssociationDetails(dummyData);
            localStorage.setItem("associationDetails", JSON.stringify(dummyData));
        }
    }, []);

    // Function to open popup
    const openPopup = () => {
        setPopupOpen(true);
        setBlurActive(true);
    };

    // Function to close popup
    const closePopup = () => {
        setPopupOpen(false);
        setBlurActive(false);
    };

    // Function to update data and save to localStorage
    const updateAssociationDetails = (data) => {
        setAssociationDetails(data);
        localStorage.setItem("associationDetails", JSON.stringify(data));
        closePopup();
    };

    // Prepare table data based on designation logic
    const TABLE_HEAD = ["Designation", "Date Attained", "Start Date", "Last Date"];
    const TABLE_ROWS = [];

    const { highestDesignation, highestDesignationDate, associateProfessorStartDate, associateProfessorEndDate, assistantProfessorStartDate, assistantProfessorEndDate } = associationDetails;

    if (highestDesignation === "Professor") {
        TABLE_ROWS.push(
            { designation: "Professor", date: highestDesignationDate },
            { designation: "Associate Professor", startDate: associateProfessorStartDate, endDate: associateProfessorEndDate },
            { designation: "Assistant Professor", startDate: assistantProfessorStartDate, endDate: assistantProfessorEndDate }
        );
    } else if (highestDesignation === "Associate Professor") {
        TABLE_ROWS.push(
            { designation: "Associate Professor", date: highestDesignationDate },
            { designation: "Assistant Professor", startDate: assistantProfessorStartDate, endDate: assistantProfessorEndDate }
        );
    } else if (highestDesignation === "Assistant Professor") {
        TABLE_ROWS.push(
            { designation: "Assistant Professor", date: highestDesignationDate }
        );
    }

    return (
        <div>
            <div className="h-auto p-10">
                <div className="flex flex-row justify-between pr-5 pl-5">
                    <p className="p-3 text-2xl font1 border-top my-auto">
                        Teacher Designation Details <br /><span className="text-lg text-red-600">(As per official records)</span>
                    </p>

                    <button onClick={openPopup} className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in">
                        <img src={editImg} alt="Edit" className="h-5 w-5"/>
                    </button>

                    <Popup open={isPopupOpen} onClose={closePopup} className="mx-auto my-auto p-2" closeOnDocumentClick>
                        <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
                            <AssociationPopUp
                                currentDetails={associationDetails}
                                onUpdate={updateAssociationDetails}
                                closeModal={closePopup}
                            />
                        </div>
                    </Popup>
                </div>
                <hr className="mb-7"></hr>

                {/* Table */}
                <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
                    <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map(({ designation, date, startDate, endDate }, index) => {
                                const isLast = index === TABLE_ROWS.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={designation}>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {designation}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {date || "-"}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {startDate || "-"}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {endDate || "-"}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
};

export default Association;
