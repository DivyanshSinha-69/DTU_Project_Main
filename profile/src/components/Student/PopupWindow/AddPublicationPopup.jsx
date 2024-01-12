import axios from "axios";
import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { addPlacement } from "../../../redux/reducers/UserPlacementDetail";
import ManuscriptPdf from "./ManuscriptPdf";
import { addPublicationDetails } from "../../../redux/reducers/UserPublicationDetails";

export default function AddPlacementsPopup(props) {
  const { closeModal, name} = props;
  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pdfSrc, setPdfSrc] = useState("");
  const [formData, setFormData] = useState({
    publishedIn: "",
    articleTitle: "",
    publicationDoi: "",
    publishedArticleLink: "",
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
    

    if (!formData.publishedIn || !formData.publicationDoi || !formData.publishedArticleLink || !formData.articleTitle) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/ece/student/addpublication",
        {
          publishedIn: formData.publishedIn,
          articleTitle: formData.articleTitle,
          publishedArticleLink: formData.publishedArticleLink,
          publicationDoi:formData.publicationDoi,
          roll: RollNo,
          ID: id,
        },
        {
          withCredentials: true,
        }
      );


      // Handle success, e.g., show a success message or update state
      const updateddata = {
        publishedIn: formData.publishedIn,
        articleTitle: formData.articleTitle,
        publishedArticleLink: formData.publishedArticleLink,
        publicationDoi:formData.publicationDoi,
        RollNo: RollNo,      
        manuscript:pdfSrc,
        ID:id,
      };
    //   {console.log(pdfSrc)}
      dispatch(addPublicationDetails(updateddata));

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
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 text-white">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Published In<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter The Publication"
            value={formData.publishedIn}
            onChange={handleChange}
            name="publishedIn"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Article Title<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the article title"
            value={formData.articleTitle}
            onChange={handleChange}
            name="articleTitle"
            className=" !border-t-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Publication DOI<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the DOI of the article"
            value={formData.publicationDoi}
            onChange={handleChange}
            name="publicationDoi"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Published Article Link<p className="pl-1 text-red-600">*</p>
          </Typography>
          <Input
            size="lg"
            placeholder="Enter the article link"
            value={formData.publishedArticleLink}
            onChange={handleChange}
            name="publishedArticleLink"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pl-2 h-10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3 flex">
            Manuscript<p className="pl-1 text-red-600">*</p>
          </Typography>
          <ManuscriptPdf setId={setId} setPdfSrc={setPdfSrc}/>
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


