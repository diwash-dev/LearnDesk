import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import { ordinal } from "../../pages/Notes.jsx";
import { semesterNumbers, subjects } from "../../pages/Syllabus.jsx";
import { addSyllabus, getSyllabus, updateSyllabus } from "./Allsyllabus.jsx";

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

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Units are typed one per line as "Unit title: topic, topic, topic"
// and stored in the same shape as the public page: [{ title, topics }].
const unitsToText = (units = []) =>
  units.map((u) => `${u.title}: ${u.topics.join(", ")}`).join("\n");
const textToUnits = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split(":");
      return {
        title: title.trim(),
        topics: rest
          .join(":")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
    });

const syllabusCatalog = subjects.reduce((catalog, subject) => {
  (catalog[subject.semester] ??= []).push(subject);
  return catalog;
}, {});

// One form for /admin/syllabus/new and /admin/syllabus/:id/edit
export default function AddSyllabus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const existing = id ? getSyllabus(id) : null;
  const [form, setForm] = useState(() => ({
    semester: existing?.semester ?? "",
    subject: existing?.subject ?? "",
    subjectCode: existing?.subjectCode ?? "",
    creditHours: existing?.creditHours ?? "",
    description: existing?.description ?? "",
    units: unitsToText(existing?.units),
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

  const subjectsForSemester = syllabusCatalog[form.semester] ?? [];

  const save = (status) => {
    if (status === "draft" && !formRef.current.reportValidity()) return;
    const data = {
      semester: form.semester,
      subject: form.subject,
      slug: slugify(form.subject),
      subjectCode: form.subjectCode.trim(),
      creditHours: form.creditHours ? Number(form.creditHours) : null,
      description: form.description.trim(),
      units: textToUnits(form.units),
      fileName: file ? file.name : (existing?.fileName ?? ""),
      size: file ? fmtSize(file.size) : (existing?.size ?? "—"),
      fileUrl: existing?.fileUrl ?? "#", // dummy until uploads are connected
      status,
    };
    existing ? updateSyllabus(id, data) : addSyllabus(data);
    navigate("/admin/syllabus", {
      state: {
        message:
          status === "published" ? "Syllabus published." : "Draft saved.",
      },
    });
  };

  if (id && !existing) {
    return (
      <AdminLayout title="Edit Syllabus">
        <p className="text-sm text-slate-600">
          This syllabus no longer exists.{" "}
          <Link
            to="/admin/syllabus"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Back to all syllabus
          </Link>
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={existing ? "Edit Syllabus" : "Add Syllabus"}
      text={
        existing
          ? "Update the details of this syllabus"
          : "Upload the syllabus for a subject"
      }
    >
      <Link
        to="/admin/syllabus"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft size={15} />
        All syllabus
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
              {subjectsForSemester.map((s) => (
                <option key={s.slug} value={s.subject}>
                  {s.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subjectCode" className={label}>
              Subject code
            </label>
            <input
              id="subjectCode"
              required
              value={form.subjectCode}
              onChange={set("subjectCode")}
              placeholder="e.g. CMP 301"
              className={`${input} h-10`}
            />
          </div>

          <div>
            <label htmlFor="creditHours" className={label}>
              Credit hours
            </label>
            <input
              id="creditHours"
              type="number"
              required
              min="1"
              value={form.creditHours}
              onChange={set("creditHours")}
              placeholder="e.g. 3"
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
              placeholder="A short summary of what this syllabus covers"
              className={`${input} py-2.5`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="units" className={label}>
              Units / Chapters
            </label>
            <textarea
              id="units"
              required
              rows={6}
              value={form.units}
              onChange={set("units")}
              placeholder={
                "One unit per line, e.g.\nIntroduction to Computers: History, Generations, Types of computers\nNumber Systems: Binary and octal, Hexadecimal"
              }
              className={`${input} py-2.5`}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              One unit per line: Unit title: topic, topic, topic
            </p>
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
          <Link to="/admin/syllabus" className={btnLine}>
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
