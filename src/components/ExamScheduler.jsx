import React, { useState } from "react";
// import { ToastContainer, toast, Bounce } from "react-toastify";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

const ExamScheduler = () => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [startTime, setStartTime] = useState("");
  const [end, setEnd] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [year, setYear] = useState("");

  // Handlers for input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleStartChange = (e) => setStart(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndChange = (e) => setEnd(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleAllDayChange = (e) => setAllDay(e.target.checked);
  const handleYearChange = (e) => setYear(e.target.value);

  // Firebase API call
  const addTestToFirebase = async (testData) => {
    try {
      const docRef = await addDoc(collection(db, "EventScheduling"), testData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && start && startTime && end && year) {
      const testData = allDay
        ? { title, start, allDay: true, year }
        : {
            title,
            start: `${start}T${startTime}:00`,
            end: `${end}T${endTime}:00`,
            year,
          };

      addTestToFirebase(testData);
    } else {
      console.log("All fields are required");
    }
  };

  return (
    <>
      <div className="w-full lg:w-[83%] mx-auto flex flex-col bg-white shadow-md rounded-lg p-6">
        {/* Title Section */}
        <div className="flex items-center justify-center border-b-2 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Schedule a Test
          </h2>
        </div>

        {/* Form Section */}
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6"
          onSubmit={handleSubmit}
        >
          {/* Title Input */}
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-lg font-medium text-gray-700"
            >
              Test Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter Test Title"
              className="mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>

          {/* Year Selection */}
          <div className="flex flex-col">
            <label htmlFor="year" className="text-lg font-medium text-gray-700">
              Select Year:
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              required
            >
              <option value="">Select Year</option>
              <option value="FE">FE</option>
              <option value="SE">SE</option>
              <option value="TE">TE</option>
              <option value="BE">BE</option>
            </select>
          </div>

          {/* Start Date Input */}
          <div className="flex flex-col">
            <label
              htmlFor="start"
              className="text-lg font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="start"
              value={start}
              onChange={handleStartChange}
              className="mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>

          {/* Start Time Input */}
          <div className="flex flex-col">
            <label
              htmlFor="start-time"
              className="text-lg font-medium text-gray-700"
            >
              Start Time:
            </label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>

          {/* End Date Input */}
          <div className="flex flex-col">
            <label htmlFor="end" className="text-lg font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              id="end"
              value={end}
              onChange={handleEndChange}
              className="mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>

          {/* End Time Input */}
          <div className="flex flex-col">
            <label
              htmlFor="end-time"
              className="text-lg font-medium text-gray-700"
            >
              End Time:
            </label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={handleEndTimeChange}
              className="mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>

          {/* All Day Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="all-day"
              checked={allDay}
              onChange={handleAllDayChange}
              className="h-5 w-5 text-green-600 focus:ring focus:ring-green-300 rounded"
            />
            <label
              htmlFor="all-day"
              className="ml-2 text-lg font-medium text-gray-700"
            >
              All Day Event
            </label>
          </div>
        </form>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-green-700 text-white py-3 px-6 rounded-md text-lg font-semibold shadow-lg hover:bg-green-800 transition-all duration-300"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ExamScheduler;
