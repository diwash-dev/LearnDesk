import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import { categoryIcons } from "../ResourceCard.jsx";
import { fmtDate, ordinal } from "../../pages/Notes.jsx";
import { DOCS, projects as publicProjects } from "../../pages/Projects.jsx";

/* Project store. It starts from the SAME `projects` array the public Projects page uses
   (exported from pages/Projects.jsx), so there is only one dataset.
   Record shape (unchanged):
  { id, semester, title, description, type, documents: [{ name, text, fileType, pages, fileUrl }] }
   Admin adds: link, coverName, status ("published" | "draft"), date.
   Changes live in memory until reload. Replace these functions with API calls later
   (GET/POST/PUT/DELETE /api/projects). */

// The public data pairs each project semester with one project type.
export const typeForSemester = {
  4: "Project I",
  6: "Project II",
  8: "Project III",
};
export const projectSemesters = Object.keys(typeForSemester).map(Number);
export const projectTypes = Object.values(typeForSemester);
// The four document slots (name + short text) come from the public page, not copied here.
export const documentSlots = DOCS.map(([name, text]) => ({ name, text }));

const today = () => new Date().toISOString().slice(0, 10);
let items = publicProjects.map((p, i) => ({
  ...p,
  id: i + 1,
  link: "",
  coverName: "",
  status: "published",
  date: today(),
}));
let nextId = items.length + 1;

export const getProjects = () => [...items];
export const getProject = (id) => items.find((p) => p.id === Number(id));
export const addProject = (data) => {
  items = [{ ...data, id: nextId++, date: today() }, ...items];
};
export const updateProject = (id, data) => {
  items = items.map((p) =>
    p.id === Number(id) ? { ...p, ...data, date: today() } : p,
  );
};
export const deleteProject = (id) => {
  items = items.filter((p) => p.id !== Number(id));
};

const PAGE_SIZE = 10;
const Icon = categoryIcons.Projects;
const select =
  "h-9 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const cell = "hidden px-4 py-3.5 text-slate-600 lg:table-cell";
const pill = "rounded px-2 py-0.5 text-xs font-semibold";
const chip =
  "rounded border border-line bg-surface px-2 py-0.5 text-xs font-medium text-slate-600";
const on = "bg-brand-50 text-brand-700";
const off = "border border-line bg-white text-slate-600";

export default function AllProjects() {
  const [list, setList] = useState(getProjects);
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);
  const message = useLocation().state?.message;

  // Clear the "saved" message from history so it does not return on reload.
  useEffect(() => {
    if (message) window.history.replaceState({}, "");
  }, [message]);

  const filtered = list.filter(
    (p) => !semester || p.semester === Number(semester),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    deleteProject(p.id);
    setList(getProjects());
  };

  return (
    <AdminLayout
      title="All Projects"
      text="Manage projects and their documents"
    >
      {message && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700">
          <CheckCircle2 size={16} />
          {message}
        </p>
      )}

      <section className="overflow-hidden rounded-xl border border-line bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-ink">Projects library</h2>
            <p className="text-sm text-slate-500">{filtered.length} projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <Plus size={16} />
            Add Project
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line bg-surface px-5 py-3">
          <select
            aria-label="Filter by semester"
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setPage(1);
            }}
            className={select}
          >
            <option value="">All semesters</option>
            {projectSemesters.map((n) => (
              <option key={n} value={n}>
                {ordinal[n]} Semester
              </option>
            ))}
          </select>
        </div>

        {rows.length === 0 ? (
          <p className="border-t border-line px-5 py-12 text-center text-sm text-slate-500">
            No projects found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-t border-line text-left text-sm lg:min-w-[68rem]">
              <thead className="hidden bg-surface text-xs font-semibold text-slate-500 lg:table-header-group">
                <tr className="border-b border-line">
                  <th className="py-2.5 pl-5 pr-4 font-semibold">
                    Project title
                  </th>
                  {[
                    "Semester",
                    "Project type",
                    "Documents",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th key={h} className="px-4 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                  <th className="py-2.5 pl-4 pr-5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => {
                  const published = p.status === "published";
                  const count = p.documents.length;
                  const docs = `${count} of ${documentSlots.length} files`;
                  const docBadge = count === documentSlots.length ? on : off;
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-brand-50/50"
                    >
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                            <Icon size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug text-ink">
                              {p.title}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                              {p.description}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 lg:hidden">
                              Sem {p.semester} · {p.type} · {fmtDate(p.date)}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5 lg:hidden">
                              <span className={`${pill} ${docBadge}`}>
                                {docs}
                              </span>
                              <span
                                className={`${pill} ${published ? on : off}`}
                              >
                                {published ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={cell}>{ordinal[p.semester]}</td>
                      <td className={cell}>{p.type}</td>
                      <td className={cell}>
                        <span className={`${pill} ${docBadge}`}>{docs}</span>
                      </td>
                      <td
                        className={`${cell} whitespace-nowrap text-slate-500`}
                      >
                        {fmtDate(p.date)}
                      </td>
                      <td className={cell}>
                        <span className={`${pill} ${published ? on : off}`}>
                          {published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 pr-5">
                        <div className="flex justify-end gap-1">
                          <a
                            href={`/projects?semester=${p.semester}`}
                            target="_blank"
                            rel="noreferrer"
                            className={iconBtn}
                            title="View"
                            aria-label={`View ${p.title}`}
                          >
                            <Eye size={16} />
                          </a>
                          <Link
                            to={`/admin/projects/${p.id}/edit`}
                            className={iconBtn}
                            title="Edit"
                            aria-label={`Edit ${p.title}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(p)}
                            className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`}
                            title="Delete"
                            aria-label={`Delete ${p.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 text-sm text-slate-500">
            <p>
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}{" "}
              of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                aria-label="Previous page"
                className={`${iconBtn} border border-line disabled:opacity-40`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPage(current + 1)}
                disabled={current === pages}
                aria-label="Next page"
                className={`${iconBtn} border border-line disabled:opacity-40`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
