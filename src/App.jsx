import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
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
import InternshipFetch from "./components/InternshipFetch.jsx";
import Dashboard from "./components/Dashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import Sidebar from "./components/Sidebar.jsx";
<<<<<<< HEAD
import AppliedToInternship from "./components/AppliedToInternship.jsx";
import BookLendingPage from "./components/BookLendingPage.jsx";
=======
>>>>>>> f51aa2eee73bdf411f75a5625f966c5b6c94da12
import { Roadmap } from "./components/Roadmap.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import BookLendingPage from "./components/BookLendingPage"
import AppliedToInternship from "./components/AppliedToInternship"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const role = localStorage.getItem("selectedRole");

function App() {
  return (
    <div className="maindiv flex flex-row" style={{ width: "100%" }}>
      <Router>
        {/* Conditionally render Sidebar if a role exists */}
        {role && <Sidebar className="sidebar" />}
        <Routes>
          <Route
            path="/"
            element={
              role === 'student' ? <Dashboard />
              : role === 'teacher' ? <TeacherDashboard />
              : role === 'librarian' ? <BorrowedBooksPage />
              : <Login />
            }
          />
          <Route path="/student-dashboard" element={<Dashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/hr" element={<VideoPlayer />} />
          <Route path="/add-assignment" element={<AddAssignmentForm />} />
          <Route path="/assignment-submission" element={<AssignmentSubmission />} />
          <Route path="/borrowed-books" element={<BorrowedBooksPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/coding-platform" element={<CodingPlatform />} />
          <Route path="/exam-scheduler" element={<ExamScheduler />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/internship-fetch" element={<InternshipFetch />} />
          <Route path="/book-lending" element={<BookLendingPage />} />
          <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/teacher-assignment-view" element={<TeacherAssignmentView />} />
          <Route path="/upload-notes" element={<UploadNotes />} />
          <Route path="/upload-listing" element={<UploadListing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply-internship" element={<InternshipFetch />} />
          <Route path="/applied-to-internship" element={<AppliedToInternship />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
