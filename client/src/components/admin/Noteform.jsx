import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import AdminToast from "./AdminToast.jsx";
import { ordinal } from "../../pages/Notes.jsx";
import {
  addNote,
  getCatalog,
  getNote,
  resourceTypes,
  updateNote,
} from "./Notestore.jsx";

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const btn =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const btnLine = `${btn} border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50`;

// One form for /admin/notes/new and /admin/notes/:id/edit
export default function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [existing, setExisting] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    semester: "",
    subject: "",
    resourceType: "notes",
    unit: "",
  }));
  const [file, setFile] = useState(null);
  const showError = useCallback((message, title = "Could not save") => {
    setToast({
      id: Date.now(),
      message,
      title,
      tone: "error",
    });
  }, []);

  useEffect(() => {
    Promise.all([getCatalog(), id ? getNote(id) : Promise.resolve(null)])
      .then(([nextCatalog, note]) => {
        setCatalog(nextCatalog);
        setExisting(note);
        if (note) {
          setForm({
            title: note.title ?? "",
            description: note.description ?? "",
            semester: note.semesterId ?? "",
            subject: note.subjectId ?? "",
            resourceType: "notes",
            unit: "",
          });
        }
      })
      .catch((error) =>
        showError(
          error.message || "Failed to load note",
          "Could not load note",
        ),
      )
      .finally(() => setLoading(false));
  }, [id, showError]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Changing the semester clears the subject and swaps in that semester's subjects.
  const changeSemester = (e) =>
    setForm((f) => ({ ...f, semester: e.target.value, subject: "" }));

  const subjects =
    catalog.find((semester) => semester.id === Number(form.semester))
      ?.subjects ?? [];

  const save = async (status) => {
    if (!formRef.current.reportValidity()) return;

    try {
      if (!existing && !file) {
        showError("Please choose a PDF file.", "PDF file required");
        return;
      }

      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("semesterId", form.semester);
      data.append("subjectId", form.subject);
      if (file) data.append("file", file);

      if (existing) {
        await updateNote(id, data);

        navigate("/admin/notes", {
          state: { message: "Note updated successfully." },
        });
      } else {
        await addNote(data);

        navigate("/admin/notes", {
          state: {
            message:
              status === "published" ? "Note published." : "Draft saved.",
          },
        });
      }
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to save note");
    }
  };

  if (loading) {
    return <AdminLayout title="Edit Note">Loading note...</AdminLayout>;
  }

  if (id && !existing) {
    return (
      <AdminLayout title="Edit Note">
        <p className="text-sm text-slate-600">
          This note no longer exists.{" "}
          <Link
            to="/admin/notes"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Back to all notes
          </Link>
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={existing ? "Edit Note" : "Add Note"}
      text={
        existing
          ? "Update the details of this note"
          : "Upload a new note, question set or other file"
      }
    >
      <AdminToast
        key={toast?.id}
        message={toast?.message}
        title={toast?.title}
        tone={toast?.tone}
      />

      <Link
        to="/admin/notes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft size={15} />
        All notes
      </Link>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          save("published");
        }}
        className="max-w-3xl rounded-xl border border-line bg-white p-5 shadow-soft sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={label}>
              Title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Unit 2 – Network Layer"
              className={`${input} h-10`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={label}>
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="A short summary of what this file covers"
              className={`${input} py-2.5`}
            />
          </div>

          <div>
            <label htmlFor="semester" className={label}>
              Semester
            </label>
            <select
              id="semester"
              required
              value={form.semester}
              onChange={changeSemester}
              className={`${input} h-10`}
            >
              <option value="">Select semester</option>
              {catalog.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {ordinal[semester.number]
                    ? `${ordinal[semester.number]} Semester`
                    : semester.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className={label}>
              Subject
            </label>
            <select
              id="subject"
              required
              disabled={!form.semester}
              value={form.subject}
              onChange={set("subject")}
              className={`${input} h-10`}
            >
              <option value="">
                {form.semester ? "Select subject" : "Select a semester first"}
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="sm:col-span-2">
            <legend className={label}>Resource type</legend>
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((t) => (
                <label key={t.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="resourceType"
                    value={t.value}
                    checked={form.resourceType === t.value}
                    onChange={set("resourceType")}
                    className="peer sr-only"
                  />
                  <span className="block rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 peer-checked:border-brand-700 peer-checked:bg-brand-50 peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <label htmlFor="unit" className={label}>
              Unit / Chapter{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="unit"
              type="number"
              min="1"
              value={form.unit}
              onChange={set("unit")}
              placeholder="e.g. 3"
              className={`${input} h-10 sm:max-w-[10rem]`}
            />
          </div>

          <div className="sm:col-span-2">
            <span className={label}>PDF file</span>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line bg-surface px-4 py-4 text-sm transition-colors hover:border-brand-300 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-300">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand-600">
                <Upload size={16} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink">
                  {file?.name ??
                    (existing
                      ? "Current file attached. Choose a PDF to replace it."
                      : "Choose a PDF file")}
                </span>
                <span className="block text-xs text-slate-500">
                  PDF only. Files are uploaded securely to Cloudinary.
                </span>
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">
          <Link to="/admin/notes" className={btnLine}>
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => save("draft")}
            className={btnLine}
          >
            Save as draft
          </button>
          <button
            type="submit"
            className={`${btn} bg-brand-700 text-white hover:bg-brand-800`}
          >
            Publish
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
