import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE } from "../components/admin/Notestore.jsx";

export default function NoteViewer() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/notes/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load note");
        return response.json();
      })
      .then(setNote)
      .catch(() => setError("Unable to load this PDF."));
  }, [id]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-slate-600">{error}</p>
        <Link className="font-semibold text-brand-700" to="/notes">
          Back to notes
        </Link>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading PDF...
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-slate-100">
      <iframe
        title={note.title}
        src={note.fileUrl}
        className="h-full w-full border-0"
      />
    </main>
  );
}
