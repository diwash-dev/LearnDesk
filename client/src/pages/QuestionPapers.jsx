import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { semesterNumbers, slugify } from "./Notes.jsx";
import {
  API_BASE,
  getCatalog,
  request,
} from "../components/admin/Notestore.jsx";

function PageHeader({ crumbs, title, text, children }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="wrap py-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight size={14} />}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-brand-700">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink">{crumb.label}</span>
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
        {children}
      </div>
    </section>
  );
}

function NotFound({ message, href, label }) {
  return (
    <section className="bg-white py-16">
      <div className="wrap text-center">
        <p className="text-slate-600">{message}</p>
        <Link
          to={href}
          className="mt-5 inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}

/* ---------- Data ----------
   Subjects come from GET /api/catalog and papers from GET /api/question-papers
   (published only). The subject slug is built from the subject name, the same way
   the Notes page does it. */

const toSubjects = (catalog) =>
  catalog.flatMap((sem) =>
    sem.subjects.map((s) => ({
      id: s.id,
      semester: sem.number,
      subject: s.name,
      slug: slugify(s.name),
      subjectCode: s.code,
    })),
  );

const papersFor = (papers, s) => papers.filter((p) => p.subjectId === s.id);

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Question Papers", href: "/question-papers" },
];

/* ---------- Views ---------- */

// Step 1 and 2: choose a semester (or All), then a subject
function SubjectList({ semester, subjects, papers }) {
  const visible = semester
    ? subjects.filter((s) => s.semester === semester)
    : subjects;
  const groups = (semester ? [semester] : semesterNumbers).map((n) => ({
    n,
    items: visible.filter((s) => s.semester === n),
  }));

  useEffect(() => {
    document.title = "BCA Question Papers – LearnDesk";
  }, []);

  const [selectedSubject, setSelectedSubject] = useState(visible[0] ?? null);

  useEffect(() => {
    setSelectedSubject(visible[0] ?? null);
  }, [semester]);

  if (semester) {
    return (
      <>
        <PageHeader
          crumbs={[...crumbs, { label: "BCA" }]}
          title={`Semester ${semester} Question Papers`}
          text="Choose a subject to view its past question papers."
        />
        <section className="bg-white py-10 lg:py-14">
          <div className="wrap grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="mb-3 text-sm font-semibold text-ink">Subjects</p>
              <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-soft">
                {visible.map((subject) => {
                  const active = selectedSubject?.slug === subject.slug;
                  return (
                    <button
                      key={subject.slug}
                      type="button"
                      onClick={() => setSelectedSubject(subject)}
                      aria-pressed={active}
                      className={`border-l-[3px] px-4 py-3.5 text-left transition-colors ${
                        active
                          ? "border-brand-700 bg-brand-50"
                          : "border-transparent bg-white hover:bg-brand-50/70"
                      }`}
                    >
                      <span
                        className={`block text-[15px] font-semibold ${active ? "text-brand-700" : "text-ink"}`}
                      >
                        {subject.subject}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {papersFor(papers, subject).length} papers
                        {subject.subjectCode && ` · ${subject.subjectCode}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedSubject && (
              <PaperList subject={selectedSubject} papers={papers} compact />
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        crumbs={[...crumbs, { label: "BCA" }]}
        title="BCA Question Papers"
        text="Choose a semester, pick a subject and open its past question papers."
        facts
      />
      <section className="bg-white py-10 lg:py-14">
        <div className="wrap">
          <p className="text-sm text-slate-500" aria-live="polite">
            {semester
              ? `Showing ${visible.length} subjects in Semester ${semester}`
              : `Showing all ${visible.length} subjects across 8 semesters`}
          </p>

          <div className="mt-6 space-y-10">
            {groups.map(({ n, items }) => (
              <section key={n} aria-label={`Semester ${n}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-xl font-bold text-ink">Semester {n}</h2>
                  <p className="text-sm text-slate-500">
                    {items.length} subjects
                  </p>
                </div>

                <ul
                  className={`mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-soft ${!semester ? "md:grid-cols-2" : ""}`}
                >
                  {items.map((s) => {
                    const list = papersFor(papers, s);
                    return (
                      <li key={s.slug}>
                        <Link
                          to={`/question-papers/${s.semester}/${s.slug}`}
                          className="group flex items-center gap-3 bg-white px-4 py-3.5 text-left transition-colors hover:bg-brand-50/70"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand-600">
                            <BookOpen size={17} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-[15px] font-semibold text-ink group-hover:text-brand-700">
                              {s.subject}
                            </h3>
                            <span className="mt-1 block truncate text-xs text-slate-500">
                              {list.length} papers
                              {s.subjectCode && ` · ${s.subjectCode}`}
                            </span>
                          </div>
                          <ArrowRight
                            size={16}
                            className="shrink-0 text-slate-300 transition-colors group-hover:text-brand-600"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Step 3: the papers of one subject
function PaperList({ subject: s, papers, compact = false }) {
  const list = papersFor(papers, s);

  useEffect(() => {
    document.title = `${s.subject} Question Papers – LearnDesk`;
  }, [s]);

  return (
    <>
      {!compact && (
        <PageHeader
          crumbs={[
            ...crumbs,
            { label: "BCA", href: "/question-papers" },
            {
              label: `Semester ${s.semester}`,
              href: `/question-papers/${s.semester}`,
            },
            { label: s.subject },
          ]}
          title={s.subject}
        >
          <ul className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
            {s.subjectCode && (
              <li className="rounded-md border border-line bg-white px-3 py-1.5 font-semibold text-ink">
                {s.subjectCode}
              </li>
            )}
            <li className="rounded-md border border-line bg-white px-3 py-1.5">
              Semester {s.semester}
            </li>
            <li className="rounded-md border border-line bg-white px-3 py-1.5">
              {list.length} Question Papers
            </li>
          </ul>
        </PageHeader>
      )}

      <section className="bg-white py-10 lg:py-14">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <Link
              to={`/question-papers/${s.semester}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              <ArrowLeft size={15} />
              All Semester {s.semester} subjects
            </Link>
            <p className="text-sm text-slate-500">Newest first</p>
          </div>

          {list.length === 0 ? (
            <p className="mt-4 rounded-xl border border-line px-5 py-10 text-center text-sm text-slate-500">
              No question papers for this subject yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-soft">
              {list.map((p) => (
                <li
                  key={p.id}
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[4.5rem_6rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5"
                >
                  {/* sm:contents lets year and paper type become grid cells on wider screens */}
                  <div className="flex items-center gap-3 sm:contents">
                    <p className="text-lg font-bold text-ink">{p.year}</p>
                    <span
                      className={`w-fit rounded px-2 py-0.5 text-xs font-semibold ${
                        p.paperType === "University"
                          ? "bg-brand-50 text-brand-700"
                          : "border border-line bg-white text-slate-600"
                      }`}
                    >
                      {p.paperType}
                    </span>
                  </div>

                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    <span className="rounded border border-line px-1.5 py-0.5 text-xs font-semibold text-slate-600">
                      PDF
                    </span>
                    {p.pages && <span>{p.pages} pages</span>}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={p.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:flex-none"
                    >
                      <Eye size={15} />
                      View
                    </a>
                    <a
                      href={`${API_BASE}/question-papers/${p.id}/download`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 sm:flex-none"
                    >
                      <Download size={15} />
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

/* ---------- Page ---------- */

// Routes: /question-papers, /question-papers/:semester, /question-papers/:semester/:slug (see App.jsx)
export default function QuestionPapers() {
  const { semester, slug } = useParams();
  const [data, setData] = useState({ subjects: [], papers: [] });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    Promise.all([getCatalog(), request(`${API_BASE}/question-papers`)])
      .then(([catalog, papers]) => {
        setData({ subjects: toSubjects(catalog), papers });
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, []);

  const semesterNumber = semester === undefined ? null : Number(semester);
  const semesterOk =
    semesterNumber === null || semesterNumbers.includes(semesterNumber);
  const found =
    slug && semesterOk
      ? data.subjects.find(
          (s) => s.semester === semesterNumber && s.slug === slug,
        )
      : null;

  let content;
  if (status !== "ready") {
    content = (
      <section className="bg-white py-16">
        <div className="wrap text-center">
          <p className="text-slate-600">
            {status === "loading"
              ? "Loading question papers..."
              : "Unable to load question papers. Please try again later."}
          </p>
        </div>
      </section>
    );
  } else if (!semesterOk) {
    content = (
      <NotFound
        message="Question papers are available for semesters 1 to 8."
        href="/question-papers"
        label="View all subjects"
      />
    );
  } else if (slug) {
    content = found ? (
      <PaperList subject={found} papers={data.papers} />
    ) : (
      <NotFound
        message="That subject is not part of this semester."
        href={`/question-papers/${semesterNumber}`}
        label="View semester subjects"
      />
    );
  } else {
    content = (
      <SubjectList
        semester={semesterNumber}
        subjects={data.subjects}
        papers={data.papers}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main>{content}</main>
      <Footer />
    </>
  );
}
