import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import Popup from "reactjs-popup";
import BookPopUp from "../PopUp/BookRecordsPopUp"; // Assuming you have a popup component for books
import "../../../styles/popup.css";
import editImg from "../../../assets/edit.svg";
import addImg from "../../../assets/add.svg";
import deleteImg from "../../../assets/delete.svg";

// Dummy data for testing
const dummyBookDetails = [
  { isbn: "978-3-16-148410-0", title: "React for Beginners", publication: "Tech Books", publishedDate: "2023-05-10" },
  { isbn: "978-1-4028-9462-6", title: "Advanced JavaScript", publication: "Code Press", publishedDate: "2022-08-15" },
  { isbn: "978-0-1234-5678-9", title: "Mastering CSS", publication: "Design Publishers", publishedDate: "2021-11-01" },
];

const BookRecordsPublished = ({ setBlurActive }) => {
  const [bookDetails, setBookDetails] = useState(dummyBookDetails);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBook, setIsAddBook] = useState(false);

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

  const handleAddBook = (newBook) => {
    if (selectedBook) {
      // Update existing book record
      setBookDetails((prevDetails) =>
        prevDetails.map((book) => (book === selectedBook ? { ...newBook } : book))
      );
    } else {
      // Add new book record
      setBookDetails([...bookDetails, newBook]);
    }
    closePopup();
  };

  const handleDeleteBook = (indexToDelete) => {
    setBookDetails(bookDetails.filter((_, index) => index !== indexToDelete));
  };

  const TABLE_HEAD = ["ISBN No.", "Book Title", "Publication Name", "Published Date", "Actions"];

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
                  {TABLE_HEAD.map((head, index) => (
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
                {bookDetails.map((book, index) => {
                  const { isbn, title, publication, publishedDate } = book;
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
                          {publication}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {publishedDate}
                        </Typography>
                      </td>
                      <td className={`${classes} text-right`}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPopup(book)}
                            className="bg-green-700 text-white p-2 rounded-full hover:invert hover:scale-110 transition-transform ease-in"
                          >
                            <img
                              src={editImg}
                              alt="edit"
                              className="h-5 w-5"
                            />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(index)}
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
        <div className="h-[550px] w-[auto] md:w-[500px] md:mx-auto bg-gray-800 opacity-[0.8] rounded-[12%] top-10 fixed inset-5 md:inset-20 flex items-center justify-center">
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
                publication={selectedBook.publication}
                publishedDate={selectedBook.publishedDate}
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
