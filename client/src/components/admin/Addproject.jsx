import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import { ordinal } from "../../pages/Notes.jsx";
import {
  addProject,
  documentSlots,
  getProject,
  projectSemesters,
  projectTypes,
  typeForSemester,
  updateProject,
} from "./Allprojects.jsx";

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const btn =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const btnLine = `${btn} border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50`;
const optional = <span className="font-normal text-slate-500">(optional)</span>;

// One upload box, used for the cover image and for each project document.
function FileField({ title, hint, accept, file, current, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line bg-surface px-4 py-3.5 text-sm transition-colors hover:border-brand-300 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-300">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand-600">
        <Upload size={16} />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-ink">{title}</span>
        <span className="block truncate text-xs text-slate-500">
          {file?.name ??
            (current
              ? "Current file attached. Choose one to replace it."
              : hint)}
        </span>
      </span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files[0] ?? null)}
      />
    </label>
  );
}

// One form for /admin/projects/new and /admin/projects/:id/edit
export default function AddProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const existing = id ? getProject(id) : null;
  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    semester: existing?.semester ?? "",
    type: existing?.type ?? "",
    link: existing?.link ?? "",
  }));
  const [cover, setCover] = useState(null);
  const [docs, setDocs] = useState({}); // newly chosen PDFs, keyed by document name
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Picking a semester also picks that semester's usual project type (still editable).
  const changeSemester = (e) =>
    setForm((f) => ({
      ...f,
      semester: e.target.value ? Number(e.target.value) : "",
      type: typeForSemester[e.target.value] ?? "",
    }));

  const save = (status) => {
    if (status === "draft" && !formRef.current.reportValidity()) return;
    // Same field names as the public Projects data, plus `link`, `coverName`, `status`.
    const documents = documentSlots.flatMap(({ name, text }) => {
      const old = existing?.documents.find((d) => d.name === name);
      if (docs[name]) {
        return [
          {
            name,
            text,
            fileType: "PDF",
            pages: old?.pages ?? null,
            fileUrl: old?.fileUrl ?? "#", // dummy until uploads are connected
          },
        ];
      }
      return old ? [old] : [];
    });
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      semester: form.semester,
      type: form.type,
      documents,
      link: form.link.trim(),
      coverName: cover ? cover.name : (existing?.coverName ?? ""),
      status,
    };
    existing ? updateProject(id, data) : addProject(data);
    navigate("/admin/projects", {
      state: {
        message: status === "published" ? "Project published." : "Draft saved.",
      },
    });
  };

  if (id && !existing) {
    return (
      <AdminLayout title="Edit Project">
        <p className="text-sm text-slate-600">
          This project no longer exists.{" "}
          <Link
            to="/admin/projects"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Back to all projects
          </Link>
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={existing ? "Edit Project" : "Add Project"}
      text={
        existing
          ? "Update the details and documents of this project"
          : "Add a project with its proposal, documentation and report"
      }
    >
      <Link
        to="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft size={15} />
        All projects
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
              Project title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Online Examination System"
              className={`${input} h-10`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={label}>
              Short description
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="One or two sentences about what the project does"
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
              {projectSemesters.map((n) => (
                <option key={n} value={n}>
                  {ordinal[n]} Semester
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className={label}>
              Project type
            </label>
            <select
              id="type"
              required
              value={form.type}
              onChange={set("type")}
              className={`${input} h-10`}
            >
              <option value="">Select project type</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="link" className={label}>
              Project / GitHub link {optional}
            </label>
            <input
              id="link"
              type="url"
              value={form.link}
              onChange={set("link")}
              placeholder="https://github.com/username/project"
              className={`${input} h-10`}
            />
          </div>

          <div className="sm:col-span-2">
            <span className={label}>Cover image {optional}</span>
            <FileField
              title="Choose a cover image"
              hint="JPG or PNG"
              accept="image/*"
              file={cover}
              current={!!existing?.coverName}
              onChange={setCover}
            />
          </div>
        </div>

        <section className="mt-6 border-t border-line pt-5">
          <h3 className="text-sm font-bold text-ink">Project Documents</h3>
          <p className="mt-1 text-xs text-slate-500">
            PDF only. Files are not stored yet; a placeholder link (#) is saved.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {documentSlots.map(({ name, text }) => (
              <FileField
                key={name}
                title={name}
                hint={text}
                accept="application/pdf"
                file={docs[name]}
                current={!!existing?.documents.some((d) => d.name === name)}
                onChange={(file) => setDocs((d) => ({ ...d, [name]: file }))}
              />
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">
          <Link to="/admin/projects" className={btnLine}>
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
