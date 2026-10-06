import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import AdminToast from "./AdminToast.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { fmt } from "../../pages/Labreports.jsx";
import { ordinal } from "../../pages/Notes.jsx";
import { API_BASE, getCatalog, request } from "./Notestore.jsx";

/* ---------- Data access ----------
   Talks to the Express API (/api/lab-reports).
   Admin record shape:
   { id, no, title, description, status, fileUrl, pages, semester, subject, updated, ... } */
const API = `${API_BASE}/lab-reports`;

const normalizeReport = (report) => ({
  ...report,
  no: report.experimentNo,
  semester: report.semester?.number ?? report.semesterId,
  subject: report.subject?.name ?? report.subjectId,
  updated: report.updatedAt,
});

export const getReports = () =>
  request(`${API}/admin`).then((reports) => reports.map(normalizeReport));
export const getReport = (id) => request(`${API}/admin/${id}`);
export const addReport = (data) => request(API, { method: "POST", body: data });
export const updateReport = (id, data) =>
  request(`${API}/${id}`, { method: "PUT", body: data });
export const deleteReport = (id) =>
  request(`${API}/${id}`, { method: "DELETE" });

/* ---------- Page ---------- */

const PAGE_SIZE = 10;
const select =
  "h-9 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const cell = "hidden px-4 py-3.5 text-slate-600 lg:table-cell";

export default function AllLabReports() {
  const [rows, setRows] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    q: "",
    semester: "",
    subject: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const message = useLocation().state?.message;

  useEffect(() => {
    Promise.all([getReports(), getCatalog()])
      .then(([nextReports, nextCatalog]) => {
        setRows(nextReports);
        setCatalog(nextCatalog);
      })
      .catch((err) =>
        setError({
          id: Date.now(),
          title: "Could not load lab reports",
          message: err.message || "Failed to load lab reports",
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
    // Same rule as the form: changing the semester resets the subject.
    setFilter((f) => ({
      ...f,
      [key]: value,
      ...(key === "semester" ? { subject: "" } : {}),
    }));
    setPage(1);
  };

  const q = filter.q.trim().toLowerCase();
  const filtered = rows.filter(
    (r) =>
      (!q ||
        r.title.toLowerCase().includes(q) ||
        r.no.toLowerCase().includes(q)) &&
      (!filter.semester || r.semester === Number(filter.semester)) &&
      (!filter.subject || r.subject === filter.subject) &&
      (!filter.status || r.status === filter.status),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const remove = (r) => setPendingDelete(r);

  const confirmRemove = async () => {
    if (!pendingDelete) return;
    const removedReport = pendingDelete;
    setPendingDelete(null);
    setRows((items) => items.filter((item) => item.id !== removedReport.id));

    try {
      await deleteReport(removedReport.id);
    } catch (err) {
      setRows((items) => [removedReport, ...items]);
      setError({
        id: Date.now(),
        title: "Could not delete",
        message: err.message || "Failed to delete lab report",
      });
    }
  };

  return (
    <AdminLayout
      title="Lab Reports"
      text="Manage lab reports for every semester and subject"
    >
      <AdminToast message={message} title="Lab report saved" />
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
              Lab reports library
            </h2>
            <p className="text-sm text-slate-500">
              {filtered.length} resources
            </p>
          </div>
          <Link
            to="/admin/lab-reports/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <Plus size={16} />
            Add Lab Report
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line bg-surface px-5 py-3">
          <label className="relative min-w-[12rem] flex-1 sm:max-w-xs">
            <span className="sr-only">Search lab reports</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={filter.q}
              onChange={change("q")}
              placeholder="Search title or experiment no."
              className={`${select} w-full pl-9 placeholder:text-slate-400`}
            />
          </label>
          <select
            aria-label="Filter by semester"
            value={filter.semester}
            onChange={change("semester")}
            className={select}
          >
            <option value="">All semesters</option>
            {catalog.map((sem) => (
              <option key={sem.id} value={sem.number}>
                {ordinal[sem.number] ?? sem.number} Semester
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by subject"
            value={filter.subject}
            onChange={change("subject")}
            disabled={!filter.semester}
            className={`${select} max-w-[14rem]`}
          >
            <option value="">
              {filter.semester ? "All subjects" : "Select a semester first"}
            </option>
            {(
              catalog.find((sem) => sem.number === Number(filter.semester))
                ?.subjects ?? []
            ).map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={filter.status}
            onChange={change("status")}
            className={select}
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="border-t border-line px-5 py-12 text-center text-sm text-slate-500">
            {loading
              ? "Loading lab reports..."
              : rows.length === 0
                ? "No lab reports yet. Use Add Lab Report to add the first one."
                : "No lab reports match these filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-t border-line text-left text-sm lg:min-w-[56rem]">
              <thead className="hidden bg-surface text-xs font-semibold text-slate-500 lg:table-header-group">
                <tr className="border-b border-line">
                  {[
                    "Title",
                    "Experiment No.",
                    "Semester",
                    "Subject",
                    "Updated",
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
                {visible.map((r) => {
                  const published = r.status === "published";
                  const badge = published
                    ? "bg-brand-50 text-brand-700"
                    : "border border-line bg-white text-slate-600";
                  return (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-brand-50/50"
                    >
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                            <FileText size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug text-ink">
                              {r.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 lg:hidden">
                              {r.no} · Sem {r.semester} · {r.subject} ·{" "}
                              {fmt(r.updated)}
                            </p>
                            <span
                              className={`mt-1.5 inline-block rounded px-2 py-0.5 text-xs font-semibold lg:hidden ${badge}`}
                            >
                              {published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3.5 font-semibold text-brand-700 lg:table-cell">
                        {r.no}
                      </td>
                      <td className={`${cell} whitespace-nowrap`}>
                        {ordinal[r.semester] ?? r.semester}
                      </td>
                      <td className={cell}>{r.subject}</td>
                      <td
                        className={`${cell} whitespace-nowrap text-slate-500`}
                      >
                        {fmt(r.updated)}
                      </td>
                      <td className={cell}>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold ${badge}`}
                        >
                          {published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 pr-5">
                        <div className="flex justify-end gap-1">
                          <a
                            href={r.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={iconBtn}
                            title="View"
                            aria-label={`View ${r.title}`}
                          >
                            <Eye size={16} />
                          </a>
                          <Link
                            to={`/admin/lab-reports/${r.id}/edit`}
                            className={iconBtn}
                            title="Edit"
                            aria-label={`Edit ${r.title}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(r)}
                            className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`}
                            title="Delete"
                            aria-label={`Delete ${r.title}`}
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete lab report?"
        message={
          pendingDelete
            ? `This will permanently remove ${pendingDelete.title}. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete lab report"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmRemove}
      />
    </AdminLayout>
  );
}
