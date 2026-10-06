import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Presentation,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { API_BASE } from "../components/admin/Notestore.jsx";

/* ---------- Sample data ----------
   SAMPLE / DUMMY records for UI development only.
   Later: replace `files` with a fetch to the Express API (GET /api/notes).
   Every file keeps the same shape the backend can return:
   { id, semester, subject, title, description, unit, type, resourceType, pages, size, fileUrl, date }
  resourceType: notes | other
   fileUrl will point to the file stored on Cloudinary. */

// [subject, short name, "unit 1|unit 2|unit 3", extra file kind]
// kind: a = assignment (DOCX), s = lecture slides (PPTX), c = lab programs (ZIP)
const raw = {
  1: [
    [
      "Computer Fundamentals",
      "Computer Fundamentals",
      "Introduction to Computers|Number Systems|Hardware and Memory",
      "a",
    ],
    [
      "Mathematics I",
      "Mathematics I",
      "Limits and Continuity|Differentiation|Integration",
      "a",
    ],
    [
      "Programming in C",
      "C Programming",
      "C Basics and Operators|Control Structures|Functions and Pointers",
      "c",
    ],
    [
      "Digital Logic",
      "Digital Logic",
      "Boolean Algebra|Combinational Circuits|Sequential Circuits",
      "s",
    ],
    [
      "Technical English",
      "Technical English",
      "Communication Skills|Technical Writing|Business Correspondence",
      "a",
    ],
  ],
  2: [
    [
      "Object Oriented Programming",
      "OOP",
      "Classes and Objects|Inheritance|Polymorphism",
      "c",
    ],
    [
      "Mathematics II",
      "Mathematics II",
      "Sets and Relations|Logic and Proofs|Graph Theory",
      "a",
    ],
    [
      "Data Structures and Algorithms",
      "DSA",
      "Stacks and Queues|Linked Lists|Trees and Graphs",
      "c",
    ],
    [
      "Computer Architecture",
      "Computer Architecture",
      "CPU Organization|Memory Organization|Input Output and Pipelining",
      "s",
    ],
    [
      "Statistics",
      "Statistics",
      "Descriptive Statistics|Probability|Hypothesis Testing",
      "a",
    ],
  ],
  3: [
    [
      "Database Management System",
      "DBMS",
      "Introduction to DBMS|ER Model|SQL",
      "a",
    ],
    [
      "Operating Systems",
      "OS",
      "Process Management|Memory Management|File Systems",
      "s",
    ],
    [
      "Web Technology",
      "Web Technology",
      "HTML and CSS|JavaScript Basics|Server Side Scripting",
      "c",
    ],
    [
      "Numerical Methods",
      "Numerical Methods",
      "Solution of Equations|Interpolation|Numerical Integration",
      "a",
    ],
    [
      "Computer Graphics",
      "Computer Graphics",
      "Output Primitives|2D Transformations|3D Projections",
      "s",
    ],
  ],
  4: [
    [
      "Software Engineering",
      "Software Engineering",
      "Software Process Models|Requirements Engineering|Software Testing",
      "s",
    ],
    [
      "Computer Networks",
      "Computer Networks",
      "OSI and TCP/IP Models|Network Layer|Transport Layer",
      "a",
    ],
    [
      "Java Programming",
      "Java",
      "Java Basics|Classes and Interfaces|Collections and JDBC",
      "c",
    ],
    [
      "System Analysis and Design",
      "SAD",
      "System Concepts|Data Flow Diagrams|System Design",
      "a",
    ],
    [
      "Artificial Intelligence",
      "AI",
      "Search Techniques|Knowledge Representation|Expert Systems",
      "s",
    ],
  ],
  5: [
    [
      "Web Programming",
      "Web Programming",
      "Modern JavaScript|Node and Express|REST APIs",
      "c",
    ],
    [
      "Mobile Application Development",
      "Mobile App Development",
      "Mobile UI Design|Data Storage|Networking and Services",
      "c",
    ],
    [
      "Computer Security",
      "Computer Security",
      "Cryptography Basics|Authentication|Network Security",
      "s",
    ],
    [
      "Cloud Computing",
      "Cloud Computing",
      "Cloud Models|Virtualization|Cloud Services",
      "s",
    ],
    [
      "E-Commerce",
      "E-Commerce",
      "E-Commerce Models|Electronic Payment|Digital Marketing",
      "a",
    ],
  ],
  6: [
    [
      "Advanced Database",
      "Advanced Database",
      "Query Optimization|Distributed Databases|NoSQL Systems",
      "a",
    ],
    [
      "Internet Technology",
      "Internet Technology",
      "Internet Architecture|Web Services|Content Delivery",
      "s",
    ],
    [
      "Software Project Management",
      "SPM",
      "Project Planning|Scheduling and Risk|Quality Management",
      "a",
    ],
    [
      "Information Security",
      "Information Security",
      "Security Management|Access Control|Digital Forensics",
      "s",
    ],
    [
      "Machine Learning",
      "Machine Learning",
      "Supervised Learning|Unsupervised Learning|Neural Networks",
      "c",
    ],
  ],
  7: [
    [
      "Advanced Web Technology",
      "Advanced Web Tech",
      "Web Architecture|Progressive Web Apps|Web Security",
      "c",
    ],
    [
      "Network Programming",
      "Network Programming",
      "Socket Programming|Client Server Design|Secure Communication",
      "c",
    ],
    [
      "Data Mining",
      "Data Mining",
      "Association Rules|Classification|Clustering",
      "a",
    ],
    [
      "Project Work",
      "Project Work",
      "Proposal Writing|System Design Documentation|Report Formatting",
      "a",
    ],
    [
      "Elective I",
      "Elective I",
      "Course Overview|Core Concepts|Case Studies",
      "s",
    ],
  ],
  8: [
    [
      "Internship / Project",
      "Internship",
      "Internship Guidelines|Project Report Format|Defense Preparation",
      "a",
    ],
    [
      "Advanced Computing",
      "Advanced Computing",
      "Parallel Computing|High Performance Systems|Big Data Basics",
      "s",
    ],
    [
      "Cloud / Distributed Computing",
      "Distributed Computing",
      "Distributed Concepts|Fault Tolerance|Cloud Native Design",
      "s",
    ],
    [
      "Information Systems",
      "Information Systems",
      "Enterprise Systems|Decision Support|IT Governance",
      "a",
    ],
    [
      "Elective II",
      "Elective II",
      "Course Overview|Core Concepts|Case Studies",
      "s",
    ],
  ],
};

const extras = {
  a: {
    suffix: "Assignment",
    type: "DOCX",
    resourceType: "other",
    label: "an assignment",
    text: "Practice assignment with questions from each unit.",
  },
  s: {
    suffix: "Lecture Slides",
    type: "PPTX",
    resourceType: "other",
    label: "lecture slides",
    text: "Lecture slides covering the whole syllabus for quick revision.",
  },
  c: {
    suffix: "Lab Programs",
    type: "ZIP",
    resourceType: "other",
    label: "lab programs",
    text: "Complete set of lab programs with sample output.",
  },
};

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Builds `files` (flat list) and `catalog` (semester -> subjects with their files).
export const files = [];
export const catalog = {};
let nextId = 1;
const baseDate = Date.UTC(2026, 9, 3);

Object.entries(raw).forEach(([semKey, list]) => {
  const semester = Number(semKey);
  catalog[semester] = [];
  list.forEach(([subject, short, unitTitles, kind], si) => {
    const extra = extras[kind];
    const docs = [
      ...unitTitles.split("|").map((t, i) => ({
        title: `Unit ${i + 1} – ${t}`,
        description: `Lecture notes on ${t.toLowerCase()} with solved examples and practice questions.`,
        unit: i + 1,
        type: "PDF",
        resourceType: "notes",
      })),
      {
        title: `${short} ${extra.suffix}`,
        description: extra.text,
        unit: null,
        type: extra.type,
        resourceType: extra.resourceType,
      },
    ];

    const subjectFiles = docs.map((d, fi) => {
      const seed = semester * 5 + si * 7 + fi * 11;
      const days = 1 + ((semester * 9 + si * 5 + fi * 3) % 75);
      const isPdf = d.type === "PDF";
      const pages = isPdf ? 10 + (seed % 30) : null;
      const size = isPdf
        ? `${(pages * 0.09).toFixed(1)} MB`
        : d.type === "DOCX"
          ? `${40 + ((seed * 13) % 120)} KB`
          : `${(0.8 + (seed % 8) * 0.4).toFixed(1)} MB`;
      return {
        id: nextId++,
        semester,
        subject,
        ...d,
        pages,
        size,
        fileUrl: "#",
        date: new Date(baseDate - days * 864e5).toISOString().slice(0, 10),
      };
    });

    files.push(...subjectFiles);
    catalog[semester].push({
      name: subject,
      slug: slugify(subject),
      semester,
      files: subjectFiles,
      latest: subjectFiles
        .map((f) => f.date)
        .sort()
        .pop(),
      description: `Unit-wise notes and ${extra.label} for ${subject}.`,
    });
  });
});

export const ordinal = [
  "",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
];
export const semesterNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
const fileCount = (n, source = catalog) =>
  (source[n] ?? []).reduce((sum, s) => sum + s.files.length, 0);
export const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const databaseCatalog = (notes) => {
  const result = Object.fromEntries(
    Object.entries(catalog).map(([semester, subjects]) => [
      semester,
      subjects.map(({ files: _files, latest: _latest, ...subject }) => ({
        ...subject,
        files: [],
        latest: null,
      })),
    ]),
  );

  notes.forEach((note) => {
    const semester = note.semester?.number ?? note.semesterId;
    const subject = note.subject?.name ?? `Subject ${note.subjectId}`;
    const subjectSlug = slugify(subject);
    const file = {
      id: note.id,
      title: note.title,
      description: note.description ?? "",
      unit: null,
      type: (note.fileType || "PDF").toUpperCase(),
      resourceType: "notes",
      pages: null,
      size: "PDF",
      fileUrl: note.fileUrl,
      date: note.updatedAt ?? note.createdAt,
      subject,
      semester,
    };

    result[semester] ??= [];
    let entry = result[semester].find((item) => item.slug === subjectSlug);
    if (!entry) {
      entry = {
        name: subject,
        slug: subjectSlug,
        semester,
        files: [],
        latest: note.createdAt,
        description: `Notes for ${subject}.`,
      };
      result[semester].push(entry);
    }
    entry.files.push(file);
    if (new Date(note.createdAt) > new Date(entry.latest)) {
      entry.latest = note.createdAt;
    }
  });

  return result;
};

// Resource-type filter shown above each subject's file list
const resourceTypes = [
  { value: "all", label: "All" },
  { value: "notes", label: "Notes" },
  { value: "other", label: "Other" },
];

const typeIcons = {
  PDF: FileText,
  DOCX: FileText,
  PPTX: Presentation,
  ZIP: FileArchive,
};

/* ---------- Page ---------- */

export default function Notes() {
  const [dbCatalog, setDbCatalog] = useState(catalog);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/notes`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load notes");
        return response.json();
      })
      .then((notes) => setDbCatalog(databaseCatalog(notes)))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const activeCatalog = dbCatalog;
  const availableSemesters = Object.keys(activeCatalog)
    .map(Number)
    .sort((a, b) => a - b);

  // State lives in the URL (?semester=6&subject=database-management-system),
  // so Navbar links, refresh and sharing all work on this single page.
  const [params, setParams] = useSearchParams();

  const semParam = Number(params.get("semester"));
  const sem =
    Number.isInteger(semParam) && activeCatalog[semParam] ? semParam : 0;
  const subjects = sem ? activeCatalog[sem] : [];
  const subject = sem
    ? (subjects.find((s) => s.slug === params.get("subject")) ?? subjects[0])
    : null;

  const chooseSubject = (s) => {
    setParams({ semester: s.semester, subject: s.slug });
    // On small screens the file list sits below the subjects, so bring it into view
    if (window.innerWidth < 1024) {
      setTimeout(
        () =>
          document
            .getElementById("files")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        50,
      );
    }
  };

  return (
    <>
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-line bg-surface">
          <div className="wrap py-10 sm:py-12">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link
                    to="/"
                    className="transition-colors hover:text-brand-700"
                  >
                    Home
                  </Link>
                </li>
                <ChevronRight size={14} className="text-slate-400" />
                <li className="font-medium text-ink">Notes</li>
              </ol>
            </nav>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              BCA Notes
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
              Unit-wise notes, assignments and lab material for every BCA
              subject, organized by semester.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-white py-12 lg:py-16">
          <div className="wrap">
            {loading ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Loading notes...
              </p>
            ) : sem === 0 ? (
              <div className="space-y-12">
                {availableSemesters.map((n) => (
                  <div key={n}>
                    <SemesterHeading n={n} source={activeCatalog} />
                    <SubjectList
                      subjects={activeCatalog[n]}
                      onSelect={chooseSubject}
                      twoColumns
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <SemesterHeading n={sem} source={activeCatalog} />
                <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
                  <div className="lg:sticky lg:top-28">
                    <SubjectList
                      subjects={subjects}
                      active={subject.slug}
                      onSelect={chooseSubject}
                    />
                  </div>
                  <SubjectFiles
                    key={`${subject.semester}-${subject.slug}`}
                    subject={subject}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ---------- Pieces ---------- */

function SemesterHeading({ n, source }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <h2 className="text-2xl font-bold text-ink">{ordinal[n]} Semester</h2>
      <p className="text-sm text-slate-500">
        {source[n].length} subjects, {fileCount(n, source)} files
      </p>
    </div>
  );
}

function SubjectList({ subjects, active, onSelect, twoColumns = false }) {
  return (
    <div
      className={`grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-soft ${
        twoColumns
          ? "lg:grid-cols-2 lg:[&>*:last-child:nth-child(odd)]:col-span-2"
          : ""
      }`}
    >
      {subjects.map((s) => {
        const isActive = s.slug === active;
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => onSelect(s)}
            aria-pressed={active !== undefined ? isActive : undefined}
            className={`group flex items-center gap-3 border-l-[3px] px-4 py-3.5 text-left transition-colors ${
              isActive
                ? "border-brand-700 bg-brand-50"
                : "border-transparent bg-white hover:bg-brand-50/70"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand-600">
              <BookOpen size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block truncate text-[15px] font-semibold ${
                  isActive
                    ? "text-brand-700"
                    : "text-ink group-hover:text-brand-700"
                }`}
              >
                {s.name}
              </span>
              <span className="block truncate text-xs text-slate-500">
                {s.files.length} files · Updated {fmtDate(s.latest)}
              </span>
            </span>
            <ChevronRight
              size={16}
              className={`shrink-0 transition-colors ${
                isActive
                  ? "text-brand-600"
                  : "text-slate-300 group-hover:text-brand-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function SubjectFiles({ subject }) {
  const [type, setType] = useState("all");
  const shown =
    type === "all"
      ? subject.files
      : subject.files.filter((f) => f.resourceType === type);

  return (
    <div
      id="files"
      className="min-w-0 scroll-mt-28 overflow-hidden rounded-xl border border-line bg-white shadow-soft"
    >
      <div className="border-b border-line bg-surface/70 p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-brand-600">
          {ordinal[subject.semester].toUpperCase()} SEMESTER
        </p>
        <h2 className="mt-1.5 text-2xl font-bold text-ink">{subject.name}</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
          {subject.description}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          {subject.files.length} files · Last updated {fmtDate(subject.latest)}
        </p>
      </div>
      <div
        role="group"
        aria-label="Filter by resource type"
        className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3 sm:px-5"
      >
        {resourceTypes.map((r) => {
          const count =
            r.value === "all"
              ? subject.files.length
              : subject.files.filter((f) => f.resourceType === r.value).length;
          const active = r.value === type;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => setType(r.value)}
              aria-pressed={active}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand-700 bg-brand-700 text-white shadow-soft"
                  : "border-line bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {r.label}
              <span
                className={`text-xs font-medium ${active ? "text-brand-200" : "text-slate-400"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {shown.length ? (
        <div className="divide-y divide-line">
          {shown.map((f) => (
            <FileRow key={f.id} f={f} />
          ))}
        </div>
      ) : (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          No files of this type for this subject yet.
        </p>
      )}
    </div>
  );
}

function FileRow({ f, showSubject = false }) {
  const Icon = typeIcons[f.type] ?? FileText;
  const isPdf = f.type === "PDF";
  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 px-4 py-4 transition-colors hover:bg-brand-50/50 sm:px-5 md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:items-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-brand-600">
        <Icon size={18} />
      </span>

      <div className="min-w-0">
        {showSubject && (
          <p className="mb-0.5 text-xs font-medium text-brand-600">
            {f.subject} · {ordinal[f.semester]} Semester
          </p>
        )}
        <h3 className="text-[15px] font-semibold text-ink">{f.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {f.description}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
              isPdf ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-700"
            }`}
          >
            {f.type}
          </span>
          {f.unit && (
            <span className="font-medium text-slate-600">Unit {f.unit}</span>
          )}
          {f.pages && <span>{f.pages} pages</span>}
          <span>{f.size}</span>
          <span>Updated {fmtDate(f.date)}</span>
        </p>
      </div>

      <div className="col-span-2 flex gap-2 md:col-span-1">
        {isPdf && (
          <a
            href={`/notes/${f.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${f.title}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 md:flex-none"
          >
            <ExternalLink size={15} className="text-brand-600" />
            View
          </a>
        )}
        <a
          href={`${API_BASE}/notes/${f.id}/download`}
          aria-label={`Download ${f.title}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 md:flex-none"
        >
          <Download size={15} />
          Download
        </a>
      </div>
    </div>
  );
}
