import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import toast from "react-hot-toast";

const AssociationPopUp = ({ currentDetails, onUpdate, closeModal }) => {
    const [formData, setFormData] = useState(currentDetails);

    useEffect(() => {
        setFormData(currentDetails);
    }, [currentDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.highestDesignation || !formData.highestDesignationDate) {
            toast.error("Please fill in all required fields.");
            return;
        }
        onUpdate(formData);
    };

    return (
        <Card color="transparent" shadow={false}>
            <form className="max-w-md mx-auto text-white" onSubmit={handleSubmit}>
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="highestDesignation" className="block text-sm">
                        Highest Designation
                    </label>
                    <select
                        name="highestDesignation"
                        id="highestDesignation"
                        className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
                        onChange={handleChange}
                        value={formData.highestDesignation}
                        required
                    >
                        <option value="">Select Designation</option>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                    </select>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="highestDesignationDate" className="block text-sm">
                        Date Attained
                    </label>
                    <input
                        type="date"
                        name="highestDesignationDate"
                        id="highestDesignationDate"
                        className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
                        onChange={handleChange}
                        value={formData.highestDesignationDate}
                        required
                    />
                </div>

                {formData.highestDesignation === "Professor" && (
                    <>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="associateProfessorStartDate" className="block text-sm">
                                Start Date of Associate Professor
                            </label>
                            <input
                                type="date"
                                name="associateProfessorStartDate"
                                id="associateProfessorStartDate"
                                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
                                onChange={handleChange}
                                value={formData.associateProfessorStartDate}
                                required
                            />
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="associateProfessorEndDate" className="block text-sm">
                                End Date of Associate Professor
                            </label>
                            <input
                                type="date"
                                name="associateProfessorEndDate"
                                id="associateProfessorEndDate"
                                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
                                onChange={handleChange}
                                value={formData.associateProfessorEndDate}
                                required
                            />
                        </div>
                    </>
                )}

                {(formData.highestDesignation === "Professor" || formData.highestDesignation === "Associate Professor") && (
                    <>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="assistantProfessorStartDate" className="block text-sm">
                                Start Date of Assistant Professor
                            </label>
                            <input
                                type="date"
                                name="assistantProfessorStartDate"
                                id="assistantProfessorStartDate"
                                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
                                onChange={handleChange}
                                value={formData.assistantProfessorStartDate}
                                required
                            />
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="assistantProfessorEndDate" className="block text-sm">
                                End Date of Assistant Professor
                            </label>
                            <input
                                type="date"
                                name="assistantProfessorEndDate"
                                id="assistantProfessorEndDate"
                                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300"
                                onChange={handleChange}
                                value={formData.assistantProfessorEndDate}
                                required
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded mt-5"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded mt-2"
                >
                    Cancel
                </button>
            </form>
        </Card>
    );
};

export default AssociationPopUp;
