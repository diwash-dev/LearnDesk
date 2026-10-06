import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Upload } from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import AdminToast from "./AdminToast.jsx";
import { getCatalog } from "./Notestore.jsx";
import { addReport, getReport, updateReport } from "./Alllabreports.jsx";
import { ordinal } from "../../pages/Notes.jsx";

const fmtSize = (b) =>
  b >= 1048576
    ? `${(b / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(b / 1024))} KB`;

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const btn =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const btnLine = `${btn} border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50`;

// One form for /admin/lab-reports/new and /admin/lab-reports/:id/edit
export default function AddLabReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [existing, setExisting] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    semester: "",
    subject: "",
    no: "",
    status: "draft",
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const showError = useCallback((message, title = "Could not save") => {
    setToast({ id: Date.now(), message, title, tone: "error" });
  }, []);

  useEffect(() => {
    Promise.all([getCatalog(), id ? getReport(id) : Promise.resolve(null)])
      .then(([nextCatalog, report]) => {
        setCatalog(nextCatalog);
        setExisting(report);
        if (report) {
          setForm({
            title: report.title,
            description: report.description ?? "",
            semester: report.semesterId,
            subject: report.subjectId,
            no: report.experimentNo,
            status: report.status,
          });
        }
      })
      .catch((error) =>
        showError(
          error.message || "Failed to load lab report",
          "Could not load lab report",
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
    if (!file && !existing) {
      setFileError("Upload the PDF file.");
      return;
    }

    const data = new FormData();
    data.append("semesterId", form.semester);
    data.append("subjectId", form.subject);
    data.append("experimentNo", form.no.trim());
    data.append("title", form.title.trim());
    data.append("description", form.description.trim());
    data.append("status", status);
    if (file) data.append("file", file);

    setSaving(true);
    try {
      if (existing) await updateReport(id, data);
      else await addReport(data);

      navigate("/admin/lab-reports", {
        state: {
          message:
            status === "published" ? "Lab report published." : "Draft saved.",
        },
      });
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to save lab report");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Lab Report">Loading lab report...</AdminLayout>
    );
  }

  if (id && !existing) {
    return (
      <AdminLayout title="Edit Lab Report">
        <p className="text-sm text-slate-600">
          This lab report no longer exists.{" "}
          <Link
            to="/admin/lab-reports"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Back to all lab reports
          </Link>
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={existing ? "Edit Lab Report" : "Add Lab Report"}
      text={
        existing
          ? "Update the details of this lab report"
          : "Add a lab report for a subject and experiment"
      }
    >
      <AdminToast
        key={toast?.id}
        message={toast?.message}
        title={toast?.title}
        tone={toast?.tone}
      />

      <Link
        to="/admin/lab-reports"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft size={15} />
        All lab reports
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
              placeholder="e.g. CPU Scheduling"
              className={`${input} h-10`}
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
                  {ordinal[semester.number] ?? semester.number} Semester
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

          <div className="sm:col-span-2">
            <label htmlFor="no" className={label}>
              Lab / Experiment Number
            </label>
            <input
              id="no"
              required
              value={form.no}
              onChange={set("no")}
              placeholder="e.g. Lab 04"
              className={`${input} h-10 sm:max-w-[10rem]`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={label}>
              Description{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="A short summary of what this experiment covers"
              className={`${input} py-2.5`}
            />
          </div>

          <div className="sm:col-span-2">
            <span className={label}>PDF file</span>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-surface px-4 py-4 text-sm transition-colors hover:border-brand-300 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-300 ${fileError ? "border-red-400" : "border-line"}`}
            >
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
                  {file
                    ? `PDF · ${fmtSize(file.size)}`
                    : "PDF only. Files are uploaded securely to Cloudinary."}
                </span>
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => {
                  setFile(e.target.files[0] ?? null);
                  setFileError("");
                }}
              />
            </label>
            {fileError && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle size={13} />
                {fileError}
              </p>
            )}
          </div>

          <fieldset className="sm:col-span-2">
            <legend className={label}>Status</legend>
            <div className="flex flex-wrap gap-2">
              {[
                ["draft", "Draft"],
                ["published", "Published"],
              ].map(([value, text]) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={form.status === value}
                    onChange={set("status")}
                    className="peer sr-only"
                  />
                  <span className="block rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 peer-checked:border-brand-700 peer-checked:bg-brand-50 peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300">
                    {text}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">
          <Link to="/admin/lab-reports" className={btnLine}>
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className={`${btnLine} disabled:opacity-60`}
          >
            Save as draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`${btn} bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-60`}
          >
            Publish
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
