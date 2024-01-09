// Install axios if not already installed: npm install axios

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserImage } from "../../redux/reducers/UserImage";
import uploadImg from "../../assets/upload.svg";
const Test = ({ setImgSrc }) => {

  const { RollNo } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  // const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    // Replace 'YOUR_IMAGE_ID' with the actual image ID
    const imageId = RollNo;

    // Send a POST request with 'id' in the request body
    axios
      .post(
        `http://localhost:3001/ece/student/getImage`,
        { rollNo: imageId },
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        // Convert the array buffer to base64
        const base64Image = arrayBufferToBase64(response.data);
        setImgSrc(`data:image/*;base64,${base64Image}`);
        dispatch(setUserImage(`data:image/*;base64,${base64Image}`));
      })
      .catch((error) => {
        console.error("Error fetching image: ", error);
      });
  }, []);

  // Function to convert ArrayBuffer to base64
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

  const handleUpload = async () => {
    if (file && RollNo) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("rollNo", RollNo);

      try {
        const response = await axios.post(
          "http://localhost:3001/ece/student/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the content type
            },
          }
        );
      } catch (error) {
        console.error("Error uploading image: ", error);
      }

      setFile(null);
      setIsFileSelected(false);

      const imageId = RollNo;

      // Send a POST request with 'id' in the request body
      axios
        .post(
          `http://localhost:3001/ece/student/getImage`,
          { rollNo: imageId },
          { responseType: "arraybuffer" }
        )
        .then((response) => {
          // Convert the array buffer to base64
          const base64Image = arrayBufferToBase64(response.data);
          setImgSrc(`data:image/*;base64,${base64Image}`);
          dispatch(setUserImage(`data:image/*;base64,${base64Image}`));
        })
        .catch((error) => {
          console.error("Error fetching image: ", error);
        });
    } else {
      console.warn("Please select an image and provide a rollNo to upload");
    }
  };

  return (
    <div>
      <label for="files" class="btn"> 
                <img
                  src={uploadImg}
                  alt="+"
                  className="p-2 h-10 w-10 bg-gray-800 rounded-full cursor-pointer hover:invert hover:scale-[130%] transition-transform ease-in "
                />
              </label>
               <input
                id="files"
                accept="image/*"
                style={{ visibility: "hidden" }}
                onChange={handleFileChange}
                type="file"
                className="w-[100px]"
              />
              {isFileSelected && 
              <>
              <p className="text-sm font-bold w-[150px] text-red-700 translate-x-[-115px] translate-y-[-35px]">max-size : 20Kb</p>
              <button onClick={handleUpload} className="bg-gray-600 rounded-lg text-white hover:invert p-2 font1 hover:scale-[110%] transition-transform ease-in translate-x-[-95px] translate-y-[-30px]">Upload</button>
              </>
              }
    </div>
  );
};

export default Test;
