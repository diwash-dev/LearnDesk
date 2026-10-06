import { useParams } from "react-router-dom";
import { API_BASE } from "../components/admin/Notestore.jsx";

export default function LabReportViewer() {
  const { id } = useParams();

  return (
    <main className="h-screen w-full bg-slate-100">
      <iframe
        title="StudyHub lab report viewer"
        src={`${API_BASE}/lab-reports/${id}/view`}
        className="h-full w-full border-0"
      />
    </main>
  );
}
