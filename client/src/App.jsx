import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Syllabus from "./pages/Syllabus.jsx";
import Notes from "./pages/Notes.jsx";
import QuestionPapers from "./pages/QuestionPapers.jsx";
import LabReports from "./pages/Labreports.jsx";

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
