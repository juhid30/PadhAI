import React from "react"; 
import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import BookList from "./components/BookList.jsx";
import UploadNotes from "./components/UploadNotes.jsx";
import UploadListing from "./components/UploadListing.jsx";
// import Rooms from "./components/Rooms.jsx";
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
import AudioRecorder from "./components/AudioRecorder.jsx";
import Sidebar from "./components/Sidebar.jsx";

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

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/resume-upload" element={<ResumeUpload />} /> */}
          <Route path="/add-assignment" element={<AddAssignmentForm />} />
          <Route path="/assignment-submission" element={<AssignmentSubmission />} />
          <Route path="/book-list" element={<BookList />} />
          <Route path="/borrowed-books" element={<BorrowedBooksPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/coding-platform" element={<CodingPlatform />} />
          <Route path="/exam-scheduler" element={<ExamScheduler />} />
          <Route path="/notes" element={<Notes />} />
          {/* <Route path="/rooms" element={<Rooms />} /> */}
          <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/teacher-assignment-view" element={<TeacherAssignmentView />} />
          {/* <Route path="/test" element={<Test />} /> */}
          <Route path="/upload-notes" element={<UploadNotes />} />
          <Route path="/upload-listing" element={<UploadListing />} />
          <Route path="/audioo" element={<AudioRecorder />} />
          <Route path="/sidebar" element={<Sidebar />} />

        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
