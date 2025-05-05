import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import "../../../styles/popup.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import PublicationPopUp from "../PopUp/PublicationDetailsPopUp";

const StudentPublicationDetails = ({ setBlurActive }) => {
  const [publicationDetails, setPublicationDetails] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [isAddPublication, setIsAddPublication] = useState(false);
  const user = useSelector((state) => state.auth.user) || {};
  const { roll_no } = user;
  const fetchPublicationDetails = async () => {
    try {
      const response = await API.get(
        `ece/student/publication?roll_no=${roll_no}`
      );
      const details = response?.data;
      if (details && details.length > 0) {
        setPublicationDetails(
          details.map((item) => ({
            id: item.research_id,
            title: item.title_of_paper,
            type: item.paper_type_name || item.paper_type,
            area: item.area_of_research_name || item.area_of_research,
            year: item.published_year,
            authors: item.authors,
            publication: item.name_of_publication,
            issn: item.ISSN_number,
            link: item.Link,
            ugc: item.UGC,
            citation: item.citation,
            document: item.document,
          }))
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };
  useEffect(() => {
    if (!roll_no) return;

    fetchPublicationDetails();
  }, [roll_no]);

  const openPopup = (publication) => {
    setSelectedPublication(publication);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddPublication(false);
    setBlurActive(false);
  };

  const handleAddPublicationDetails = async (newDetails, file) => {
    const {
      title,
      type,
      area,
      year,
      authors,
      publication,
      issn,
      link,
      ugc,
      citation,
    } = newDetails;

    const formData = new FormData();
    formData.append("roll_no", roll_no);
    formData.append("title_of_paper", title);
    formData.append("paper_type_name", type);
    formData.append("area_of_research_name", area);
    formData.append("published_year", year);
    formData.append("authors", authors);
    formData.append("name_of_publication", publication);
    formData.append("ISSN_number", issn);
    formData.append("Link", link);
    formData.append("UGC", ugc);
    formData.append("citation", citation);
    if (file) {
      formData.append("document", file);
    }

    try {
      let response;
      if (isAddPublication) {
        response = await API.post("ece/student/publication", formData, {
          params: { roll_no },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(
          `ece/student/publication/${selectedPublication.id}`,
          formData,
          {
            params: { roll_no },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response && response.data) {
        toast.success("Publication details successfully saved");
        closePopup();

        const newRecord = {
          id: response.data.research_id || selectedPublication.id,
          title: response.data.title_of_paper || title,
          type: response.data.paper_type_name || type,
          area: response.data.area_of_research_name || area,
          year: response.data.published_year || year,
          authors: response.data.authors || authors,
          publication: response.data.name_of_publication || publication,
          issn: response.data.ISSN_number || issn,
          link: response.data.Link || link,
          ugc: response.data.UGC || ugc,
          citation: response.data.citation || citation,
          document: response.data.document || selectedPublication?.document,
        };

        if (isAddPublication) {
          setPublicationDetails((prev) => [...prev, newRecord]);
        } else {
          setPublicationDetails((prev) =>
            prev.map((item) =>
              item.id === selectedPublication.id ? newRecord : item
            )
          );
        }
      } else {
        toast.error("Failed to save publication details.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  const handleDeletePublicationDetails = async (id) => {
    try {
      const response = await API.delete(
        `ece/student/publication/${id}?roll_no=${roll_no}`
      );
      if (response && response.data) {
        toast.success("Publication details deleted successfully");
        setPublicationDetails((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || "Error communicating with server"
      );
    }
  };

  return (
    <>
      <CustomTable
        title="Publication Details"
        subtitle="(Student's Research Publications)"
        columns={[
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "area", label: "Research Area" },
          { key: "year", label: "Year" },
          { key: "authors", label: "Authors" },
          { key: "publication", label: "Publication" },
          { key: "document", label: "Document" },
          { key: "actions", label: "Actions" },
        ]}
        data={publicationDetails}
        actions={{
          edit: (publication) => {
            setIsAddPublication(false);
            setPopupOpen(true);
            setBlurActive(true);
            setSelectedPublication(publication);
          },
          delete: (publication) => {
            if (publication?.id) {
              handleDeletePublicationDetails(publication.id);
            } else {
              console.error(
                "Publication ID is missing or undefined",
                publication
              );
              toast.error("Publication ID not found");
            }
          },
        }}
        onAdd={() => {
          setIsAddPublication(true);
          setPopupOpen(true);
          setBlurActive(true);
          setSelectedPublication(null);
        }}
      />

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddPublication ? (
            <PublicationPopUp
              title=""
              type=""
              area=""
              year=""
              authors=""
              publication=""
              issn=""
              link=""
              ugc=""
              citation=""
              document=""
              closeModal={closePopup}
              handleAddPublicationDetails={handleAddPublicationDetails}
            />
          ) : (
            selectedPublication && (
              <PublicationPopUp
                title={selectedPublication.title}
                type={selectedPublication.type}
                area={selectedPublication.area}
                year={selectedPublication.year}
                authors={selectedPublication.authors}
                publication={selectedPublication.publication}
                issn={selectedPublication.issn}
                link={selectedPublication.link}
                ugc={selectedPublication.ugc}
                citation={selectedPublication.citation}
                document={selectedPublication.document}
                closeModal={closePopup}
                handleAddPublicationDetails={handleAddPublicationDetails}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default StudentPublicationDetails;
