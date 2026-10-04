import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";
import {
  catalog,
  fmtDate,
  ordinal,
  semesterNumbers,
} from "../../pages/Notes.jsx";
import {
  deleteNote,
  getNotes,
  resourceTypes,
  typeLabel,
} from "./Notestore.jsx";

const PAGE_SIZE = 10;
const select =
  "h-9 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-400";
const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300";
const cell = "hidden px-4 py-3.5 text-slate-600 lg:table-cell";

export default function AllNotes() {
  const [notes, setNotes] = useState(getNotes);
  const [filter, setFilter] = useState({ semester: "", subject: "", type: "" });
  const [page, setPage] = useState(1);
  const message = useLocation().state?.message;

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

  const filtered = notes.filter(
    (n) =>
      (!filter.semester || n.semester === Number(filter.semester)) &&
      (!filter.subject || n.subject === filter.subject) &&
      (!filter.type || n.resourceType === filter.type),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const remove = (n) => {
    if (!window.confirm(`Delete "${n.title}"? This cannot be undone.`)) return;
    deleteNote(n.id);
    setNotes(getNotes());
  };

  return (
    <AdminLayout
      title="All Notes"
      text="Manage notes and other study material"
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
            <h2 className="text-base font-bold text-ink">Notes library</h2>
            <p className="text-sm text-slate-500">
              {filtered.length} resources
            </p>
          </div>
          <Link
            to="/admin/notes/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <Plus size={16} />
            Add Note
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
            {(catalog[filter.semester] ?? []).map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by resource type"
            value={filter.type}
            onChange={change("type")}
            className={select}
          >
            <option value="">All types</option>
            {resourceTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {rows.length === 0 ? (
          <p className="border-t border-line px-5 py-12 text-center text-sm text-slate-500">
            No notes match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-t border-line text-left text-sm lg:min-w-[62rem]">
              <thead className="hidden bg-surface text-xs font-semibold text-slate-500 lg:table-header-group">
                <tr className="border-b border-line">
                  <th className="py-2.5 pl-5 pr-4 font-semibold">Title</th>
                  {[
                    "Semester",
                    "Subject",
                    "Resource type",
                    "Unit / Chapter",
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
                {rows.map((n) => {
                  const published = n.status === "published";
                  const badge = published
                    ? "bg-brand-50 text-brand-700"
                    : "border border-line bg-white text-slate-600";
                  const unit = n.unit ? `Unit ${n.unit}` : "—";
                  return (
                    <tr
                      key={n.id}
                      className="transition-colors hover:bg-brand-50/50"
                    >
                      <td className="py-3.5 pl-5 pr-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                            <FileText size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug text-ink">
                              {n.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 lg:hidden">
                              Sem {n.semester} · {n.subject} ·{" "}
                              {typeLabel(n.resourceType)} · {unit} ·{" "}
                              {fmtDate(n.date)}
                            </p>
                            <span
                              className={`mt-1.5 inline-block rounded px-2 py-0.5 text-xs font-semibold lg:hidden ${badge}`}
                            >
                              {published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={cell}>{ordinal[n.semester]}</td>
                      <td className={cell}>{n.subject}</td>
                      <td className={cell}>{typeLabel(n.resourceType)}</td>
                      <td className={cell}>{unit}</td>
                      <td
                        className={`${cell} whitespace-nowrap text-slate-500`}
                      >
                        {fmtDate(n.date)}
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
                            href={n.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={iconBtn}
                            title="View"
                            aria-label={`View ${n.title}`}
                          >
                            <Eye size={16} />
                          </a>
                          <Link
                            to={`/admin/notes/${n.id}/edit`}
                            className={iconBtn}
                            title="Edit"
                            aria-label={`Edit ${n.title}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(n)}
                            className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`}
                            title="Delete"
                            aria-label={`Delete ${n.title}`}
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
