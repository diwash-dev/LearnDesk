import { useParams } from "react-router-dom";
import { API_BASE } from "../components/admin/Notestore.jsx";

export default function QuestionPaperViewer() {
  const { id } = useParams();

  return (
    <main className="h-screen w-full bg-slate-100">
      <iframe
        title="StudyHub question paper viewer"
        src={`${API_BASE}/question-papers/${id}/view`}
        className="h-full w-full border-0"
      />
    </main>
  );
}
