import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Syllabus from "./pages/Syllabus.jsx";
import Notes from "./pages/Notes.jsx";
import NoteViewer from "./pages/NoteViewer.jsx";
import QuestionPapers from "./pages/QuestionPapers.jsx";
import QuestionPaperViewer from "./pages/QuestionPaperViewer.jsx";
import LabReports from "./pages/Labreports.jsx";
import Projects from "./pages/Projects.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import AllNotes from "./components/admin/Allnotes.jsx";
import NoteForm from "./components/admin/Noteform.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AllSyllabus from "./components/admin/Allsyllabus.jsx";
import AddSyllabus from "./components/admin/Addsyllabus.jsx";
import AddQuestionPaper from "./components/admin/Addquestionpaper.jsx";
import AllQuestionPapers from "./components/admin/Allquestionpapers.jsx";
import AllProjects from "./components/admin/Allprojects.jsx";
import AddProject from "./components/admin/Addproject.jsx";
import AddLabReport from "./components/admin/Addlabreport.jsx";
import AllLabReports from "./components/admin/Alllabreports.jsx";
import Settings from "./components/admin/Settings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/syllabus/:semester" element={<Syllabus />} />
        <Route path="/syllabus/:semester/:slug" element={<Syllabus />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:id" element={<NoteViewer />} />
        <Route path="/question-papers" element={<QuestionPapers />} />
        <Route
          path="/question-papers/view/:id"
          element={<QuestionPaperViewer />}
        />
        <Route path="/question-papers/:semester" element={<QuestionPapers />} />
        <Route
          path="/question-papers/:semester/:slug"
          element={<QuestionPapers />}
        />
        <Route path="/lab-reports" element={<LabReports />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin/syllabus" element={<AllSyllabus />} />
        <Route path="/admin/syllabus/new" element={<AddSyllabus />} />
        <Route path="/admin/syllabus/:id/edit" element={<AddSyllabus />} />

        <Route path="/admin/question-papers" element={<AllQuestionPapers />} />
        <Route
          path="/admin/question-papers/new"
          element={<AddQuestionPaper />}
        />
        <Route
          path="/admin/question-papers/:id/edit"
          element={<AddQuestionPaper />}
        />

        <Route path="/admin/projects" element={<AllProjects />} />
        <Route path="/admin/projects/new" element={<AddProject />} />
        <Route path="/admin/projects/:id/edit" element={<AddProject />} />
        <Route path="/admin/settings" element={<Settings />} />

        <Route path="/admin/lab-reports" element={<AllLabReports />} />
        <Route
          path="/admin/lab-reports/new"
          element={<AddLabReport key="new" />}
        />
        <Route
          path="/admin/lab-reports/:id/edit"
          element={<AddLabReport key="edit" />}
        />

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
