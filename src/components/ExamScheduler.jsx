import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const ExamScheduler = () => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [startTime, setStartTime] = useState("");
  const [end, setEnd] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [year, setYear] = useState("");

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
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Schedule a Test
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Test Title"
          required
          className="w-full p-4 mb-4 text-blue-600 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full p-4 mb-4 text-blue-600 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            Select Year
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          className="w-full p-4 mb-4 text-blue-600 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full p-4 mb-4 text-blue-600 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          className="w-full p-4 mb-4 text-blue-600 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="w-full p-4 mb-4 text-blue-600 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="all-day"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring focus:ring-blue-300 rounded"
          />
          <label
            htmlFor="all-day"
            className="ml-2 text-lg font-medium text-gray-700"
          >
            All Day Event
          </label>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamScheduler;
