import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import your components
import AddAssignmentForm from "./components/AddAssignmentForm";
import AssignmentSubmission from "./components/AssignmentSubmission";
import BorrowedBooksPage from "./components/BorrowedBooksPage";
import Calendar from "./components/Calendar";
import CodingPlatform from "./components/CodingPlatform";
import ExamScheduler from "./components/ExamScheduler";
import Login from "./components/Login";
import Notes from "./components/Notes";
import PlagiarismChecker from "./components/PlagiarismChecker";
import Skills from "./components/Skills";
import TeacherAssignmentView from "./components/TeacherAssignmentView";
import Test from "./components/test";
import BookList from "./components/BookList.jsx";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
