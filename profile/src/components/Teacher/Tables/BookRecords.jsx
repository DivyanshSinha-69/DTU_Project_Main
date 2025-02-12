import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import BookPopUp from "../PopUp/BookRecordsPopUp"; // Assuming you have a popup component for books
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyBookDetails = [
  {
    isbn: "978-3-16-148410-0",
    title: "React for Beginners",
    publication: "Tech Books",
    publishedDate: "2023-05-10",
  },
  {
    isbn: "978-1-4028-9462-6",
    title: "Advanced JavaScript",
    publication: "Code Press",
    publishedDate: "2022-08-15",
  },
  {
    isbn: "978-0-1234-5678-9",
    title: "Mastering CSS",
    publication: "Design Publishers",
    publishedDate: "2021-11-01",
  },
];

const BookRecordsPublished = ({ setBlurActive }) => {
  const [bookDetails, setBookDetails] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBook, setIsAddBook] = useState(false);

  const facultyId = "FAC001"; // Keep faculty_id fixed for now

  // Fetch book records from the backend
  const fetchBookRecords = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/ece/faculty/books/FAC001`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          setBookDetails([]); // No data found, set to an empty array
          return;
        }
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      setBookDetails(
        data?.map((book) => ({
          isbn: book.ISBN, // Ensure it matches the API response field
          faculty_id: book.faculty_id,
          title: book.book_title, // Change `book_title` to `title` for consistency
          publication_name: book.publication_name, // Change `publication_name` to `publication`
          published_date: book.published_date, // Keep consistent naming
          Book_id: book.Book_id,
        })),
      );
    } catch (error) {
      console.error("Error fetching book records:", error);
      setBookDetails([]); // Fallback to an empty array in case of errors
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

  const handleAddBook = async (newBook) => {
    const bookData = {
      ISBN: newBook.isbn,
      faculty_id: "FAC001",
      book_title: newBook.title, // Ensure correct API mapping
      publication_name: newBook.publication,
      published_date: newBook.publishedDate,
    };

    try {
      if (isAddBook) {
        // Add new book record
        const response = await fetch(
          `http://localhost:3001/ece/faculty/books`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookData), // Sending the data in the body
          },
        );

        if (!response.ok) {
          console.error("Error adding book record");
          return;
        }
      } else {
        // Update existing book record
        const response = await fetch(
          `http://localhost:3001/ece/faculty/books/${selectedBook.Book_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ISBN: newBook.isbn,
              faculty_id: "FAC001",
              book_title: newBook.title, // Ensure correct API mapping
              publication_name: newBook.publication,
              published_date: newBook.publishedDate,
              Book_id: newBook.Book_id,
            }),
          },
        );

        if (!response.ok) {
          console.error("Error updating book record");
          return;
        }
      }

      // After successful add or update, refetch the book records
      fetchBookRecords(); // This will update the state with the latest data from the backend
      closePopup(); // Close the popup after success
    } catch (error) {
      console.error("Error in handling book record:", error);
    }
  };

  const handleDeleteBook = async (Book_id) => {
    const response = await fetch(
      `http://localhost:3001/ece/faculty/books/${Book_id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      console.error("Error deleting book record");
      return;
    }
    setBookDetails(bookDetails.filter((book) => book.Book_id !== Book_id));
  };

  const TABLE_HEAD = [
    "ISBN No.",
    "Book Title",
    "Publication Name",
    "Published Date",
    "Actions",
  ];
  const formatDateForInput = (date) => {
    const [date1, time] = date?.split("T");

    const [year, month, day] = date1?.split("-");
    return "${day}-${month}-${year}";
  };

  return (
    <div>
      <div className="h-auto p-10">
        <div className="flex flex-row justify-between pr-5 pl-5">
          <p className="p-3 text-2xl font1 border-top my-auto">
            Book Records Published <br />
            <span className="text-lg text-red-600">
              (Details of books published)
            </span>
          </p>
          <button
            onClick={() => {
              setIsAddBook(true);
              setPopupOpen(true);
              setBlurActive(true);
            }}
            className="p-3 text-lg m-5 font1 border-top bg-green-700 text-white rounded-full hover:invert hover:scale-[130%] transition-transform ease-in"
          >
            <img src={addImg} alt="add" className="h-5 w-5" />
          </button>
        </div>
        <hr className="mb-7"></hr>

        <div className="">
          <Card className="h-auto w-full pl-10 pr-10 overflow-x-scroll md:overflow-hidden">
            <table className="w-full min-w-auto lg:min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD?.map((head, index) => (
                    <th
                      key={head}
                      className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${
                        head === "Actions" ? "text-right" : ""
                      }`}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookDetails?.map((book, index) => {
                  const {
                    Book_id,
                    isbn,
                    title,
                    publication_name,
                    published_date,
                  } = book;
                  const isLast = index === bookDetails.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${isbn}-${index}`}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {isbn}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {publication_name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(published_date)?.toLocaleDateString(
                            "en-GB",
                          )}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsAddBook(false);
                              setSelectedBook({
                                isbn: book.ISBN, // Ensure it matches the API response field
                                faculty_id: book.faculty_id,
                                book_title: book.book_title, // Change `book_title` to `title` for consistency
                                publication_name: book.publication_name, // Change `publication_name` to `publication`
                                published_date: formatDateForInput(
                                  book.published_date,
                                ), // Keep consistent naming
                                Book_id: book.Book_id,
                              });
                              openPopup(book);
                            }}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img src={editImg} alt="edit" className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteBook(Book_id);
                            }}
                            className="bg-red-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img
                              src={deleteImg}
                              alt="delete"
                              className="h-5 w-5 filter brightness-0 invert"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Popup */}
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
                publishedDate={formatDateForInput(selectedBook.published_date)}
                closeModal={closePopup}
                handleAddBook={handleAddBook}
              />
            )
          )}
        </div>
      </Popup>
    </div>
  );
};

export default BookRecordsPublished;
