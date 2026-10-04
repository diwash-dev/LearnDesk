import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Syllabus from "./pages/Syllabus.jsx";
import Notes from "./pages/Notes.jsx";
import QuestionPapers from "./pages/QuestionPapers.jsx";
import LabReports from "./pages/Labreports.jsx";
import Projects from "./pages/Projects.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import AllNotes from "./components/admin/Allnotes.jsx";
import NoteForm from "./components/admin/Noteform.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/syllabus/:semester" element={<Syllabus />} />
        <Route path="/syllabus/:semester/:slug" element={<Syllabus />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/question-papers" element={<QuestionPapers />} />
        <Route path="/question-papers/:semester" element={<QuestionPapers />} />
        <Route
          path="/question-papers/:semester/:slug"
          element={<QuestionPapers />}
        />
        <Route path="/lab-reports" element={<LabReports />} />
        <Route path="/projects" element={<Projects />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/notes" element={<AllNotes />} />
        <Route path="/admin/notes/new" element={<NoteForm />} />
        <Route path="/admin/notes/:id/edit" element={<NoteForm />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
