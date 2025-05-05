import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import BookPopUp from "../PopUp/BookRecordsPopUp";
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";
import { useSelector } from "react-redux";
import API from "../../../utils/API";
import CustomTable from "../../DynamicComponents/CustomTable";
import { toast } from "react-hot-toast";
const BookRecordsPublished = ({ setBlurActive }) => {
  const [bookDetails, setBookDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBook, setIsAddBook] = useState(false);

  const user = useSelector((state) => state.auth.user) || {};
  const { faculty_id } = user;
  const facultyId = faculty_id;

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  const fetchBookRecords = async () => {
    try {
      const response = await API.get(`ece/faculty/books`, {
        params: {
          faculty_id: facultyId,
        },
      });
      if (response.data.length === 0) {
        setBookDetails([]);
      } else {
        setBookDetails(
          response.data?.map((book) => ({
            Book_id: book.Book_id,
            isbn: book.ISBN,
            book_title: book.book_title,
            chapter_title: book.chapter_title || "-",
            publication_name: book.publication_name,
            published_date: formatDateForInput(book.published_date),
            affiliated: book.affiliated === "yes" ? "Yes" : "No",
            link: book.link_doi || "-",
            book_chapter: book.book_chapter,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching book records:", error);
      setBookDetails([]);
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    fetchBookRecords();
  }, [facultyId]);

  const handleAddBook = async (newBook) => {
    const bookData = {
      ISBN: newBook.isbn,
      book_title: newBook.book_title,
      chapter_title: newBook.chapter_title,
      publication_name: newBook.publication_name,
      published_date: newBook.published_date,
      affiliated: newBook.affiliated ? "yes" : "no",
      link_doi: newBook.link_doi,
      book_chapter: newBook.book_chapter,
    };

    try {
      if (isAddBook) {
        await API.post("ece/faculty/books", bookData, {
          params: { faculty_id: facultyId },
        });
      } else {
        await API.put(`ece/faculty/books/${selectedBook.Book_id}`, bookData, {
          params: { faculty_id: facultyId },
        });
      }
      fetchBookRecords();
      closePopup();
    } catch (error) {
      console.error("Error handling book record:", error);
      toast.error(
        error.response?.data?.message || "Failed to save book details"
      );
    }
  };

  const handleDeleteBook = async (Book_id) => {
    try {
      await API.delete(`/ece/faculty/books/${Book_id}`, {
        params: { faculty_id: facultyId },
      });
      setBookDetails(bookDetails.filter((book) => book.Book_id !== Book_id));
    } catch (error) {
      console.error("Error deleting book record:", error);
    }
  };

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

  const formatDateForInputPopup = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <CustomTable
        title="Book Records Published"
        subtitle="(Details of books/chapters published)"
        columns={[
          { key: "isbn", label: "ISBN No." },
          {
            key: "book_chapter",
            label: "Book/Chapter",
          },
          {
            key: "book_title",
            label: "Book Title",
          },
          {
            key: "chapter_title",
            label: "Chapter Title",
          },
          { key: "publication_name", label: "Publication Name" },
          { key: "published_date", label: "Published Date" },
          {
            key: "affiliated",
            label: "Affiliated to DTU",
          },
          {
            key: "link",
            label: "Link/DOI",
            type: "link",
          },
          { key: "actions", label: "Actions" },
        ]}
        data={bookDetails}
        actions={{
          edit: (book) => {
            setIsAddBook(false);
            setSelectedBook({
              Book_id: book.Book_id,
              isbn: book.isbn,
              book_title: book.book_title,
              chapter_title: book.chapter_title,
              publication_name: book.publication_name,
              published_date: formatDateForInputPopup(book.published_date),
              affiliated: book.affiliated,
              link_doi: book.link,
              book_chapter: book.book_chapter,
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
              book_title=""
              chapter_title=""
              publication_name=""
              published_date=""
              affiliated={false}
              link_doi=""
              book_chapter="book"
              closeModal={closePopup}
              handleAddBook={handleAddBook}
            />
          ) : (
            selectedBook && (
              <BookPopUp
                Book_id={selectedBook.Book_id}
                isbn={selectedBook.isbn}
                book_title={selectedBook.book_title}
                chapter_title={selectedBook.chapter_title}
                publication_name={selectedBook.publication_name}
                published_date={selectedBook.published_date}
                affiliated={selectedBook.affiliated}
                link_doi={selectedBook.link}
                book_chapter={selectedBook.book_chapter}
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
