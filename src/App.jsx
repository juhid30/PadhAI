import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Test from "./components/test";
import BookList from "./components/BookList.jsx";
import UploadNotes from "./components/UploadNotes";
import UploadListing from "./components/UploadListing";
import Rooms from "./components/Rooms.jsx";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-assignment" element={<AddAssignmentForm />} />
          <Route
            path="/assignment-submission"
            element={<AssignmentSubmission />}
          />
          <Route path="/book-list" element={<BookList />} />
          <Route path="/borrowed-books" element={<BorrowedBooksPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/coding-platform" element={<CodingPlatform />} />
          <Route path="/exam-scheduler" element={<ExamScheduler />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
          <Route path="/skills" element={<Skills />} />
          <Route
            path="/teacher-assignment-view"
            element={<TeacherAssignmentView />}
          />
          <Route path="/test" element={<Test />} />
          <Route path="/upload-notes" element={<UploadNotes />} />
          <Route path="/upload-listing" element={<UploadListing />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
