import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Syllabus from "./pages/Syllabus.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/syllabus/:semester" element={<Syllabus />} />
        <Route path="/syllabus/:semester/:slug" element={<Syllabus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
