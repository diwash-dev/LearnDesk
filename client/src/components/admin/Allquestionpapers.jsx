import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import AdminToast from "./AdminToast.jsx";
import { ordinal, semesterNumbers } from "../../pages/Notes.jsx";
import { API_BASE, getCatalog, request } from "./Notestore.jsx";

/* Question paper store: talks to the Express API (/api/question-papers).
   Admin record shape:
   { id, year, paperType, status, fileUrl, pages, semester, subject, ... } */
export const paperTypes = [
  "University",
  "College",
  "Mid-Term",
  "Internal",
  "Model",
  "Practical",
  "Other",
];

const API = `${API_BASE}/question-papers`;

const normalizePaper = (paper) => ({
  ...paper,
  semester: paper.semester?.number ?? paper.semesterId,
  subject: paper.subject?.name ?? paper.subjectId,
});

export const paperLabel = (p) => `${p.subject} ${p.year} ${p.paperType}`;

export const getPapers = () =>
  request(`${API}/admin`).then((papers) => papers.map(normalizePaper));
export const getPaper = (id) => request(`${API}/admin/${id}`);
export const addPaper = (data) => request(API, { method: "POST", body: data });
export const updatePaper = (id, data) =>
  request(`${API}/${id}`, { method: "PUT", body: data });
export const deletePaper = (id) =>
  request(`${API}/${id}`, { method: "DELETE" });

const PAGE_SIZE = 10;
const select =
  "h-9 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const cell = "hidden px-4 py-3.5 text-slate-600 lg:table-cell";
const pill = "rounded px-2 py-0.5 text-xs font-semibold";

export default function AllQuestionPapers() {
  const [list, setList] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ semester: "", subject: "" });
  const [page, setPage] = useState(1);
  const message = useLocation().state?.message;

  useEffect(() => {
    Promise.all([getPapers(), getCatalog()])
      .then(([nextPapers, nextCatalog]) => {
        setList(nextPapers);
        setCatalog(nextCatalog);
      })
      .catch((err) =>
        setError({
          id: Date.now(),
          title: "Could not load question papers",
          message: err.message || "Failed to load question papers",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  // Clear the "saved" message from history so it does not return on reload.
  useEffect(() => {
    if (message) window.history.replaceState({}, "");
  }, [message]);

  const change = (key) => (e) => {
    const value = e.target.value;
    // Changing the semester resets the subject.
    setFilter((f) => ({
      ...f,
      [key]: value,
      ...(key === "semester" ? { subject: "" } : {}),
    }));
    setPage(1);
  };

  const filtered = list.filter(
    (p) =>
      (!filter.semester || p.semester === Number(filter.semester)) &&
      (!filter.subject || p.subject === filter.subject),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const remove = async (p) => {
    if (!window.confirm(`Delete "${paperLabel(p)}"? This cannot be undone.`))
      return;

    try {
      await deletePaper(p.id);
      setList((items) => items.filter((item) => item.id !== p.id));
    } catch (err) {
      setError({
        id: Date.now(),
        title: "Could not delete",
        message: err.message || "Failed to delete question paper",
      });
    }
  };

  return (
    <AdminLayout title="All Question Papers" text="Manage past question papers">
      <AdminToast message={message} title="Question paper saved" />
      <AdminToast
        key={error?.id}
        message={error?.message}
        title={error?.title}
        tone="error"
      />

      <section className="overflow-hidden rounded-xl border border-line bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-ink">
              Question papers library
            </h2>
            <p className="text-sm text-slate-500">
              {filtered.length} question papers
            </p>
          </div>
          <Link
            to="/admin/question-papers/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <Plus size={16} />
            Add Question Paper
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line bg-surface px-5 py-3">
          <select
            aria-label="Filter by semester"
            value={filter.semester}
            onChange={change("semester")}
            className={select}
          >
            <option value="">All semesters</option>
            {semesterNumbers.map((n) => (
              <option key={n} value={n}>
                {ordinal[n]} Semester
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by subject"
            value={filter.subject}
            onChange={change("subject")}
            disabled={!filter.semester}
            className={select}
          >
            <option value="">
              {filter.semester ? "All subjects" : "Select a semester first"}
            </option>
            {(
              catalog.find((s) => s.number === Number(filter.semester))
                ?.subjects ?? []
            ).map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {rows.length === 0 ? (
          <p className="border-t border-line px-5 py-12 text-center text-sm text-slate-500">
            {loading
              ? "Loading question papers..."
              : "No question papers found."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-t border-line text-left text-sm lg:min-w-[62rem]">
              <thead className="hidden bg-surface text-xs font-semibold text-slate-500 lg:table-header-group">
                <tr className="border-b border-line">
                  {["Subject", "Semester", "Year", "Paper Type", "Status"].map(
                    (h) => (
                      <th key={h} className="px-4 py-2.5 font-semibold">
                        {h}
                      </th>
                    ),
                  )}
                  <th className="py-2.5 pl-4 pr-5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => {
                  const published = p.status === "published";
                  const badge = published
                    ? "bg-brand-50 text-brand-700"
                    : "border border-line bg-white text-slate-600";
                  const typeBadge =
                    p.paperType === "University"
                      ? "bg-brand-50 text-brand-700"
                      : "border border-line bg-white text-slate-600";
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-brand-50/50"
                    >
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                            <FileText size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug text-ink">
                              {p.subject}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 lg:hidden">
                              Sem {p.semester} · {p.year} · {p.paperType}
                            </p>
                            <span
                              className={`mt-1.5 inline-block lg:hidden ${pill} ${badge}`}
                            >
                              {published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={cell}>{ordinal[p.semester]}</td>
                      <td className={cell}>{p.year}</td>
                      <td className={cell}>
                        <span className={`${pill} ${typeBadge}`}>
                          {p.paperType}
                        </span>
                      </td>
                      <td className={cell}>
                        <span className={`${pill} ${badge}`}>
                          {published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 pr-5">
                        <div className="flex justify-end gap-1">
                          <a
                            href={p.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={iconBtn}
                            title="View"
                            aria-label={`View ${paperLabel(p)}`}
                          >
                            <Eye size={16} />
                          </a>
                          <Link
                            to={`/admin/question-papers/${p.id}/edit`}
                            className={iconBtn}
                            title="Edit"
                            aria-label={`Edit ${paperLabel(p)}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(p)}
                            className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`}
                            title="Delete"
                            aria-label={`Delete ${paperLabel(p)}`}
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
