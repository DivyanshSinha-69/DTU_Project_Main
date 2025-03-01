import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import BookPopUp from "../PopUp/BookRecordsPopUp"; // Assuming you have a popup component for books
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";

const BookRecordsPublished = ({ setBlurActive }) => {
  const [bookDetails, setBookDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBook, setIsAddBook] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;

  // Fetch book records from the backend
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined cases
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };
  const fetchBookRecords = async () => {
    try {
      const response = await API.get(`ece/faculty/books/${facultyId}`);
      setBookDetails(
        response.data?.map((book) => ({
          isbn: book.ISBN,
          faculty_id: book.faculty_id,
          title: book.book_title,
          publication_name: book.publication_name,
          published_date: formatDateForInput(book.published_date),
          Book_id: book.Book_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching book records:", error);
      setBookDetails([]); // Fallback to empty array
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    fetchBookRecords();
  }, [facultyId]);

  const handleAddBook = async (newBook) => {
    const bookData = {
      ISBN: newBook.isbn,
      faculty_id: facultyId,
      book_title: newBook.title,
      publication_name: newBook.publication,
      published_date: newBook.publishedDate,
    };

    try {
      if (isAddBook) {
        await API.post("ece/faculty/books", bookData);
      } else {
        await API.put(`ece/faculty/books/${selectedBook.Book_id}`, bookData);
      }
      fetchBookRecords();
      closePopup();
    } catch (error) {
      console.error("Error handling book record:", error);
    }
  };

  const handleDeleteBook = async (Book_id) => {
    try {
      await API.delete(`/ece/faculty/books/${Book_id}`);
      setBookDetails(bookDetails.filter((book) => book.Book_id !== Book_id));
    } catch (error) {
      console.error("Error deleting book record:", error);
    }
  };

  useEffect(() => {
    fetchBookRecords(); // Fetch data on component mount
  }, []);
  const openPopup = (book) => {
    setSelectedBook(book);
    setPopupOpen(true);
    setBlurActive(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setIsAddBook(false);
    setBlurActive(false);
  };

  const TABLE_HEAD = [
    "ISBN No.",
    "Book Title",
    "Publication Name",
    "Published Date",
    "Actions",
  ];
  const formatDateForInputPopup = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };
  return (
    <>
      <CustomTable
        title="Book Records Published"
        subtitle="(Details of books published)"
        columns={[
          { key: "isbn", label: "ISBN" },
          { key: "title", label: "Title" },
          { key: "publication_name", label: "Publication Name" },
          { key: "published_date", label: "Published Date" },
          { key: "actions", label: "Actions" },
        ]}
        data={bookDetails}
        actions={{
          edit: (book) => {
            setIsAddBook(false);
            setSelectedBook({
              isbn: book.isbn,
              faculty_id: book.faculty_id,
              book_title: book.title,
              publication_name: book.publication_name,
              publishedDate: formatDateForInputPopup(book.published_date),
              Book_id: book.Book_id,
            });
            openPopup(book);
          },
          delete: (book) => handleDeleteBook(book.Book_id),
        }}
        onAdd={() => {
          setIsAddBook(true);
          setPopupOpen(true);
          setBlurActive(true);
        }}
      />

      <Popup
        open={isPopupOpen}
        onClose={closePopup}
        className="mx-auto my-auto p-2"
        closeOnDocumentClick
      >
        <div>
          {isAddBook ? (
            <BookPopUp
              isbn=""
              title=""
              publication=""
              publishedDate=""
              closeModal={closePopup}
              handleAddBook={handleAddBook}
            />
          ) : (
            selectedBook && (
              <BookPopUp
                isbn={selectedBook.isbn}
                title={selectedBook.title}
                publication={selectedBook.publication_name}
                Book_id={selectedBook.Book_id}
                publishedDate={selectedBook.publishedDate}
                closeModal={closePopup}
                handleAddBook={handleAddBook}
              />
            )
          )}
        </div>
      </Popup>
    </>
  );
};

export default BookRecordsPublished;
