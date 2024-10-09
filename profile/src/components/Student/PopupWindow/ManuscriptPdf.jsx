// Install axios if not already installed: npm install axios

import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Input } from "@material-tailwind/react";
import toast from "react-hot-toast";

const ManuscriptPdf = ({ setPdfSrc,setId }) => {
  const { RollNo } = useSelector((state) => state.auth.user);
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

//   useEffect(() => {

//     axios
//       .post(
//         `http://eceportal.dtu.ac.in:3001/ece/student/getpdf`,
//         { id: id },
//         { responseType: "arraybuffer" }
//       )
//       .then((response) => {
//         const base64PDF = arrayBufferToBase64(response.data);
//         // setImgSrc(`data:application/pdf;base64,${base64PDF}`);
//       })
//       .catch((error) => {
//         console.error("Error fetching PDF: ", error);
//       });
//   }, [RollNo]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsFileSelected(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const modifiedRollNo=RollNo.replace(/\//g,'-');
    const id = `${modifiedRollNo}-${Date.now()}`;
    setId(id);
    if (file && id) {

      if (file.size > 500 * 1024) {
        toast.error("file size should be 500KB or below");
        return;
      }

      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("id", id);
      formData.append("rollNo", RollNo);

      try {
        const response = await axios.post(
          "http://eceportal.dtu.ac.in:3001/ece/student/uploadmanuscript",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (error) {
        console.error("Error uploading PDF: ", error);
      }

      setFile(null);
      setIsFileSelected(false);

      

      axios
        .post(
          `http://eceportal.dtu.ac.in:3001/ece/student/getmanuscript`,
          { id: id },
        
        )
        .then((response) => {
          
          setPdfSrc(response.data.manuscript);
        })
        .catch((error) => {
          console.error("Error fetching PDF: ", error);
        });
    } else {
      console.warn("Please select a PDF and provide a rollNo to upload");
    }
  };

  return (
    <div>
      <Input
        id="pdf"
        accept=".pdf"
        onChange={handleFileChange}
        type="file"
        className="w-[100px] border-none"
      />
      {isFileSelected && (
        <>
          <p className="text-sm font-bold w-[150px] text-red-700 translate-y-[10px]">
            max-size: 500KB
          </p>
          <button
            onClick={handleUpload}
            className="bg-green-600 rounded-lg text-white hover:invert p-2 font1 hover:scale-[110%] transition-transform ease-in translate-y-[10px]"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
};

export default ManuscriptPdf;
