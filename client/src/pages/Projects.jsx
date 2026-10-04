import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

/* ---------- Sample data ----------
  "Title|description|type". Replace with an API call later. */
const raw = {
  4: [
    "Online Examination System|Timed multiple-choice tests with automatic result generation.|Project I|PHP,MySQL,Bootstrap",
    "Inventory Management System|Track stock, suppliers and purchase records for a small shop.|Project I|PHP,MySQL,JavaScript",
    "College Library System|Catalogue books, issue them to students and track returns.|Project I|PHP,MySQL,CSS",
  ],
  6: [
    "Expense Tracker App|An Android app to record daily spending and view monthly summaries.|Project II|Android,Java,SQLite",
    "Online Shopping Platform|A web store with product catalogue, cart and order tracking.|Project II|Java,JSP,Hibernate,MySQL",
    "Student Management System|Manage admissions, attendance and fee records in one place.|Project II|C#,ASP.NET,SQL Server",
  ],
  8: [
    "Hospital Appointment System|Patients book doctors online while staff manage schedules.|Project III|React,Node.js,MongoDB",
    "Cloud File Sharing System|Upload, share and manage files with role-based access.|Project III|Node.js,React,AWS S3",
  ],
};

// [name, description, file type, base page count]
export const DOCS = [
  ["Project Proposal", "Problem, objectives, scope and timeline", "DOCX", 6],
  ["Project Documentation", "Design, modules and implementation", "PDF", 24],
  ["Project Report", "Final report with results and conclusion", "PDF", 48],
  [
    "Project Guidelines / Syllabus",
    "Format, marking scheme and submission rules",
    "PDF",
    10,
  ],
];

export const projects = Object.entries(raw).flatMap(([sem, list]) =>
  list.map((line, i) => {
    const [title, description, type] = line.split("|");
    return {
      id: `${sem}-${i}`,
      semester: Number(sem),
      title,
      description,
      type,
      documents: DOCS.map(([name, text, fileType, base]) => ({
        name,
        text,
        fileType,
        pages: base + ((Number(sem) + i * 3) % 7),
        fileUrl: "#",
      })),
    };
  }),
);

const sampleNote =
  "Sample data for demonstration. Projects and document details are placeholders.";

/* ---------- Pieces ---------- */

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

function ProjectCard({ p, onOpen }) {
  return (
    <li className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-soft transition-colors hover:border-brand-300">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          Semester {p.semester}
        </span>
        <span className="rounded border border-line px-2 py-0.5 text-xs font-semibold text-slate-600">
          {p.type}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-ink">
        {p.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        {p.description}
      </p>
      <button
        type="button"
        onClick={() => onOpen(p)}
        className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
      >
        View Project
        <ArrowRight size={15} />
      </button>
    </li>
  );
}

function ProjectDetail({ p, onBack }) {
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="wrap">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft size={15} />
          All projects
        </button>

        <div className="mt-4 rounded-xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-semibold text-ink">About this project</p>
          <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">
            {p.description}
          </p>
          <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-500">Semester</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">
                {ORDINALS[p.semester - 1]} Semester
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Project type</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{p.type}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold text-ink">Project documents</h2>
          <p className="text-sm text-slate-500">{p.documents.length} files</p>
        </div>

        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-soft">
          {p.documents.map((d) => (
            <li
              key={d.name}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-ink">
                    {d.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-600">{d.text}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2.5 text-xs text-slate-500">
                    <span className="rounded border border-line bg-white px-1.5 py-0.5 font-semibold text-slate-600">
                      {d.fileType}
                    </span>
                    <span>{d.pages} pages</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <a
                  href={d.fileUrl}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:flex-none"
                >
                  <Eye size={15} />
                  View
                </a>
                <a
                  href={d.fileUrl}
                  download
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 sm:flex-none"
                >
                  <Download size={15} />
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-start gap-2 text-sm text-slate-500">
          <Info size={16} className="mt-0.5 shrink-0" />
          {sampleNote}
        </p>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

// Route: /projects (the Navbar links here as /projects?semester=N)
export default function Projects() {
  const [params] = useSearchParams();
  const semParam = params.get("semester");
  const active = /^[468]$/.test(semParam ?? "") ? Number(semParam) : "all";
  const [selected, setSelected] = useState(null);

  const shown =
    active === "all" ? projects : projects.filter((p) => p.semester === active);

  useEffect(() => {
    document.title = selected
      ? `${selected.title} – LearnDesk`
      : "BCA Projects – LearnDesk";
  }, [selected]);

  // Changing semester (selector or Navbar link) returns to the project list.
  useEffect(() => {
    setSelected(null);
  }, [active]);

  // Jump to the top when a project is opened or closed.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selected]);

  const crumbs = [{ label: "Home", href: "/" }, { label: "Projects" }];

  return (
    <>
      <Navbar />
      <main>
        {selected ? (
          <>
            <PageHeader
              crumbs={[
                crumbs[0],
                {
                  label: "Projects",
                  href: "/projects",
                },
                { label: selected.title },
              ]}
              title={selected.title}
            />
            <ProjectDetail p={selected} onBack={() => setSelected(null)} />
          </>
        ) : (
          <>
            <PageHeader
              crumbs={crumbs}
              title="BCA Projects"
              text="BCA projects for Semesters 4, 6 and 8. Open a project to get its proposal, documentation, report and guidelines."
            />
            <section className="bg-white py-6 lg:py-8">
              <div className="wrap">
                <p className="text-sm text-slate-500" aria-live="polite">
                  {active === "all"
                    ? `Showing all ${shown.length} projects across Semesters 4, 6 and 8`
                    : `Showing ${shown.length} projects in Semester ${active}`}
                </p>

                <ul className="mt-4 grid gap-4 md:grid-cols-2">
                  {shown.map((p) => (
                    <ProjectCard key={p.id} p={p} onOpen={setSelected} />
                  ))}
                </ul>

                <p className="mt-8 flex items-start gap-2 text-sm text-slate-500">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  {sampleNote}
                </p>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
