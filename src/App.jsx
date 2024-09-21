import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import BookList from "./components/BookList.jsx";
import UploadNotes from "./components/UploadNotes.jsx";
import UploadListing from "./components/UploadListing.jsx";
import AddAssignmentForm from "./components/AddAssignmentForm.jsx";
import AssignmentSubmission from "./components/AssignmentSubmission.jsx";
import BorrowedBooksPage from "./components/BorrowedBooksPage.jsx";
import Calendar from "./components/Calendar.jsx";
import CodingPlatform from "./components/CodingPlatform.jsx";
import ExamScheduler from "./components/ExamScheduler.jsx";
import Notes from "./components/Notes.jsx";
import PlagiarismChecker from "./components/PlagiarismChecker.jsx";
import Skills from "./components/Skills.jsx";
import TeacherAssignmentView from "./components/TeacherAssignmentView.jsx";
import Rooms from "./components/Rooms.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Roadmap } from "./components/Roadmap.jsx";

function App() {
  const isStudent = true; // Change this to false for teacher routes

  return (
    <div className="maindiv flex flex-row" style={{ width: "100%" }}>
      <Router>
        <Sidebar className="sidebar" />
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Student Routes */}
          {isStudent ? (
            <>
              <Route path="/assignment-submission" element={<AssignmentSubmission />} />
              <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
              <Route path="/book-list" element={<BookList />} />
              <Route path="/borrowed-books" element={<BorrowedBooksPage />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/coding-platform" element={<CodingPlatform />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/roadmap" element={<Roadmap />} />
            </>
          ) : (
            /* Teacher Routes */
            <>
              <Route path="/exam-scheduler" element={<ExamScheduler />} />
              <Route path="/upload-notes" element={<UploadNotes />} />
              <Route path="/upload-listing" element={<UploadListing />} />
              <Route path="/add-assignment" element={<AddAssignmentForm />} />
              <Route path="/teacher-assignment-view" element={<TeacherAssignmentView />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
