import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import { ordinal } from "../../pages/Notes.jsx";
import {
  addPaper,
  paperTypes,
  getPaper,
  semesterNumbers,
  syllabusCatalog,
  updatePaper,
} from "./Allquestionpapers.jsx";

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const btn =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const btnLine = `${btn} border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50`;

const fmtSize = (bytes) =>
  bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// One form for /admin/question-papers/new and /admin/question-papers/:id/edit
export default function AddQuestionPaper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const existing = id ? getPaper(id) : null;
  const [form, setForm] = useState(() => ({
    semester: existing?.semester ?? "",
    subject: existing?.subject ?? "",
    year: existing?.year ?? "",
    paperType: existing?.paperType ?? "University",
  }));
  const [file, setFile] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Changing the semester clears the subject and swaps in that semester's subjects.
  const changeSemester = (e) =>
    setForm((f) => ({
      ...f,
      semester: e.target.value ? Number(e.target.value) : "",
      subject: "",
    }));

  const subjects = syllabusCatalog[form.semester] ?? [];

  const save = (status) => {
    if (status === "draft" && !formRef.current.reportValidity()) return;
    const data = {
      title: existing?.title ?? `${form.year} ${form.paperType} Question Paper`,
      semester: form.semester,
      subject: form.subject,
      year: Number(form.year),
      paperType: form.paperType,
      fileName: file ? file.name : (existing?.fileName ?? ""),
      size: file ? fmtSize(file.size) : (existing?.size ?? "—"),
      fileUrl: existing?.fileUrl ?? "#", // dummy until uploads are connected
      status,
    };
    existing ? updatePaper(id, data) : addPaper(data);
    navigate("/admin/question-papers", {
      state: {
        message:
          status === "published" ? "Question paper published." : "Draft saved.",
      },
    });
  };

  if (id && !existing) {
    return (
      <AdminLayout title="Edit Question Paper">
        <p className="text-sm text-slate-600">
          This question paper no longer exists.{" "}
          <Link
            to="/admin/question-papers"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Back to all question papers
          </Link>
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={existing ? "Edit Question Paper" : "Add Question Paper"}
      text={
        existing
          ? "Update the details of this question paper"
          : "Upload a past question paper"
      }
    >
      <Link
        to="/admin/question-papers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft size={15} />
        All question papers
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
              {semesterNumbers.map((n) => (
                <option key={n} value={n}>
                  {ordinal[n]} Semester
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
                <option key={s.slug} value={s.subject}>
                  {s.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className={label}>
              Year
            </label>
            <input
              id="year"
              type="number"
              required
              min="1990"
              max="2100"
              value={form.year}
              onChange={set("year")}
              placeholder="e.g. 2024"
              className={`${input} h-10`}
            />
          </div>

          <div>
            <label htmlFor="paperType" className={label}>
              Paper Type
            </label>
            <select
              id="paperType"
              required
              value={form.paperType}
              onChange={set("paperType")}
              className={`${input} h-10`}
            >
              {paperTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
                  PDF only. Files are not stored yet; a placeholder link (#) is
                  saved.
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
          <Link to="/admin/question-papers" className={btnLine}>
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
