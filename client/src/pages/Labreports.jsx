import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  API_BASE,
  getCatalog,
  request,
} from "../components/admin/Notestore.jsx";

/* ---------- Data ----------
   Subjects come from GET /api/catalog and reports from GET /api/lab-reports
   (published only). Only subjects with at least one published report are listed.
   `fmt` is exported so the admin Lab Reports pages format dates the same way. */

const byNumber = (a, b) =>
  a.experimentNo.localeCompare(b.experimentNo, undefined, { numeric: true });

const toSubjects = (catalog, reports) =>
  catalog
    .flatMap((sem) =>
      sem.subjects.map((s) => ({
        id: s.id,
        semester: sem.number,
        name: s.name,
        reports: reports
          .filter((r) => r.subjectId === s.id)
          .sort(byNumber)
          .map((r) => ({
            id: r.id,
            no: r.experimentNo,
            title: r.title,
            description: r.description,
            fileType: r.fileType,
            pages: r.pages,
            updated: r.updatedAt,
            fileUrl: r.fileUrl,
          })),
      })),
    )
    .filter((s) => s.reports.length > 0);

export const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ---------- Pieces (same design as the Projects page) ---------- */

function PageHeader({ crumbs, title, text }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="wrap py-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={14} />}
                {c.href ? (
                  <Link to={c.href} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {text && (
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{text}</p>
        )}
      </div>
    </section>
  );
}

const chip =
  "rounded border border-line bg-surface px-2 py-0.5 text-xs font-medium text-slate-600";

function SubjectCard({ s, onOpen }) {
  const titles = s.reports.slice(0, 3);
  return (
    <li className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-soft transition-colors hover:border-brand-300">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          Semester {s.semester}
        </span>
        <span className="rounded border border-line px-2 py-0.5 text-xs font-semibold text-slate-600">
          {s.reports.length} lab reports
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{s.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        Lab experiments and reports for {s.name}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {titles.map((r) => (
          <li key={r.id} className={chip}>
            {r.title}
          </li>
        ))}
        {s.reports.length > titles.length && (
          <li className={chip}>+{s.reports.length - titles.length} more</li>
        )}
      </ul>
      <button
        type="button"
        onClick={() => onOpen(s)}
        className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
      >
        View Lab Reports
        <ArrowRight size={15} />
      </button>
    </li>
  );
}

function SubjectDetail({ s, onBack }) {
  const types = [...new Set(s.reports.map((r) => r.fileType))].join(", ");
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="wrap">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft size={15} />
          All subjects
        </button>

        <div className="mt-4 rounded-xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-semibold text-ink">About this subject</p>
          <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">
            Lab experiments and reports for {s.name}.
          </p>
          <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-500">Semester</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">
                Semester {s.semester}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Lab reports</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">
                {s.reports.length} reports
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">File types</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{types}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold text-ink">Lab reports</h2>
          <p className="text-sm text-slate-500">{s.reports.length} files</p>
        </div>

        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-soft">
          {s.reports.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand-700">{r.no}</p>
                  <h3 className="text-[15px] font-semibold text-ink">
                    {r.title}
                  </h3>
                  {r.description && (
                    <p className="mt-0.5 text-sm text-slate-600">
                      {r.description}
                    </p>
                  )}
                  <p className="mt-2 flex flex-wrap items-center gap-x-2.5 text-xs text-slate-500">
                    <span className="rounded border border-line bg-white px-1.5 py-0.5 font-semibold text-slate-600">
                      {r.fileType}
                    </span>
                    {r.pages && <span>{r.pages} pages</span>}
                    <span>Updated {fmt(r.updated)}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <a
                  href={`/lab-reports/view/${r.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:flex-none"
                >
                  <Eye size={15} />
                  View
                </a>
                <a
                  href={`${API_BASE}/lab-reports/${r.id}/download`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 sm:flex-none"
                >
                  <Download size={15} />
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

// Route: /lab-reports (the Navbar links here as /lab-reports?semester=N)
export default function LabReports() {
  const [params] = useSearchParams();
  const semParam = params.get("semester");
  const active = /^[1-8]$/.test(semParam ?? "") ? Number(semParam) : "all";
  const [selected, setSelected] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    Promise.all([getCatalog(), request(`${API_BASE}/lab-reports`)])
      .then(([catalog, reports]) => {
        setSubjects(toSubjects(catalog, reports));
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, []);

  const shown =
    active === "all" ? subjects : subjects.filter((s) => s.semester === active);

  useEffect(() => {
    document.title = selected
      ? `${selected.name} Lab Reports – StudyHub`
      : "BCA Lab Reports – StudyHub";
  }, [selected]);

  // Changing semester (Navbar link) returns to the subject list.
  useEffect(() => {
    setSelected(null);
  }, [active]);

  // Jump to the top when a subject is opened or closed.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selected]);

  const home = { label: "Home", href: "/" };

  return (
    <>
      <Navbar />
      <main>
        {selected ? (
          <>
            <PageHeader
              crumbs={[
                home,
                { label: "Lab Reports", href: "/lab-reports" },
                { label: selected.name },
              ]}
              title={selected.name}
            />
            <SubjectDetail s={selected} onBack={() => setSelected(null)} />
          </>
        ) : (
          <>
            <PageHeader
              crumbs={[home, { label: "Lab Reports" }]}
              title="BCA Lab Reports"
              text="Lab reports for every BCA semester. Open a subject to view or download its experiments."
            />
            <section className="bg-white py-6 lg:py-8">
              <div className="wrap">
                {status !== "ready" ? (
                  <p className="py-12 text-center text-sm text-slate-500">
                    {status === "loading"
                      ? "Loading lab reports..."
                      : "Unable to load lab reports. Please try again later."}
                  </p>
                ) : shown.length === 0 ? (
                  <p className="py-12 text-center text-sm text-slate-500">
                    No lab reports published yet.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-slate-500" aria-live="polite">
                      {active === "all"
                        ? `Showing all ${shown.length} subjects across 8 semesters`
                        : `Showing ${shown.length} subjects in Semester ${active}`}
                    </p>

                    <ul className="mt-4 grid gap-4 md:grid-cols-2">
                      {shown.map((s) => (
                        <SubjectCard key={s.id} s={s} onOpen={setSelected} />
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
