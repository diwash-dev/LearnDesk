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

/* ---------- Sample data ----------
   "Title|short description" -> expanded into full report objects below.
   `subjects` and `fmt` are exported so the admin Lab Reports pages use the same data.
   Replace with an API call later (GET /api/lab-reports). */
const raw = {
  1: {
    "Computer Fundamentals & Applications": [
      "Windows Basics|Files, folders and system settings",
      "MS Word Document|Formatting, tables and mail merge",
      "MS Excel Worksheet|Formulas, charts and sorting",
    ],
    "Digital Logic": [
      "Logic Gates|Verify truth tables of basic gates",
      "Adders and Subtractors|Half and full adder circuits",
      "Flip-Flops|SR, JK and D flip-flop operation",
    ],
    "Introduction to Programming": [
      "Algorithms and Flowcharts|Plan solutions before coding",
      "Pseudocode Practice|Conditions, loops and functions",
      "Debugging Basics|Trace and fix logical errors",
    ],
  },
  2: {
    "C Programming": [
      "Input and Output|printf, scanf and formatted I/O",
      "Control Structures|if-else, switch and loops",
      "Arrays and Strings|1D, 2D arrays and string functions",
      "Pointers and Files|Pointer arithmetic and file handling",
    ],
    "Microprocessor & Computer Architecture": [
      "8085 Data Transfer|MOV, MVI and memory operations",
      "8085 Arithmetic Programs|Addition, subtraction and BCD",
      "Looping and Delay|Counters and delay subroutines",
    ],
    "Financial Accounting": [
      "Company Creation in Tally|Ledgers, groups and vouchers",
      "Trial Balance|Prepare trial balance and final accounts",
      "Inventory and VAT|Stock items and tax entries",
    ],
  },
  3: {
    "Data Structures & Algorithms": [
      "Stack Using Array|Push, pop and overflow checks",
      "Queue and Circular Queue|Enqueue and dequeue operations",
      "Linked List|Singly and doubly linked lists",
      "Sorting and Searching|Bubble, quick and binary search",
    ],
    "Object Oriented Programming in Java": [
      "Classes and Objects|Constructors and method overloading",
      "Inheritance and Interfaces|Extending classes and abstract types",
      "Exception Handling|try, catch and custom exceptions",
    ],
    "Web Technology": [
      "HTML5 Page Layout|Semantic tags, tables and forms",
      "CSS Styling|Selectors, flexbox and responsive design",
      "JavaScript DOM|Events and form validation",
    ],
  },
  4: {
    "Operating System": [
      "CPU Scheduling|FCFS, SJF and Round Robin",
      "Deadlock Avoidance|Banker's algorithm simulation",
      "Page Replacement|FIFO, LRU and optimal",
    ],
    "Database Management System": [
      "DDL and DML Commands|Create, alter, insert and update",
      "Joins and Subqueries|Inner, outer joins and nested queries",
      "PL/SQL Triggers|Procedures, functions and triggers",
    ],
    "Scripting Language": [
      "PHP Basics|Variables, loops and functions",
      "Forms and Sessions|GET, POST and session handling",
      "PHP and MySQL|CRUD operations with a database",
    ],
  },
  5: {
    ".NET Technology": [
      "C# Console Programs|Syntax, classes and collections",
      "Windows Forms Application|Controls and event handling",
      "ADO.NET Database|Connect and query SQL Server",
    ],
    "Computer Networking": [
      "Network Cabling|Straight and crossover UTP cables",
      "IP Addressing and Subnetting|Plan subnets for a small LAN",
      "Packet Tracer Topology|Configure routers and switches",
    ],
    "Computer Graphics & Animation": [
      "Line Drawing Algorithms|DDA and Bresenham's method",
      "Circle and Ellipse|Midpoint algorithm implementation",
      "2D Transformations|Translate, rotate and scale shapes",
    ],
  },
  6: {
    "Mobile Programming": [
      "Android Studio Setup|First app and project structure",
      "UI Layouts and Intents|Activities, layouts and navigation",
      "SQLite Storage|Local database in an Android app",
    ],
    "Advanced Java Programming": [
      "JDBC Connectivity|Connect Java to MySQL",
      "Servlets and JSP|Request handling and dynamic pages",
      "Hibernate Basics|ORM mapping and simple queries",
    ],
    "Network Programming": [
      "TCP Client and Server|Basic message exchange over sockets",
      "UDP Socket Programming|Datagram sender and receiver",
      "Multithreaded Server|Handle several clients together",
    ],
  },
  7: {
    "Cloud Computing": [
      "Virtual Machine Setup|Create and access a cloud VM",
      "Cloud Storage Service|Buckets, uploads and permissions",
      "Deploying a Web App|Host a simple app on the cloud",
    ],
    "Information Security": [
      "Encryption Techniques|Caesar and Vigenere ciphers",
      "Hashing and Integrity|MD5 and SHA checks",
      "Network Scanning|Port scanning with Nmap",
    ],
    "Data Analysis with Python": [
      "NumPy and Pandas|Arrays, series and data frames",
      "Data Cleaning|Handle missing and duplicate values",
      "Charts with Matplotlib|Line, bar and scatter plots",
    ],
  },
  8: {
    "Artificial Intelligence": [
      "Search Algorithms|BFS and DFS on graphs",
      "Prolog Basics|Facts, rules and queries",
      "Simple Neural Network|Perceptron training in Python",
    ],
    "Image Processing": [
      "Image Basics|Read, display and convert images",
      "Filtering and Smoothing|Mean and median filters",
      "Edge Detection|Sobel and Canny operators",
    ],
    "Project III": [
      "Requirement Analysis|SRS and use case diagrams",
      "System Design|ERD, DFD and interface designs",
      "Testing and Deployment|Test cases and final results",
    ],
  },
};

// Build report objects. Dates, sizes and page counts are deterministic dummy values.
export const subjects = Object.entries(raw).flatMap(([sem, subs]) =>
  Object.entries(subs).map(([name, list], si) => {
    const reports = list.map((line, i) => {
      const [title, description] = line.split("|");
      const seed = sem * 13 + si * 5 + i * 3;
      const fileType = seed % 4 === 3 ? "DOCX" : "PDF";
      return {
        no: `Lab ${String(i + 1).padStart(2, "0")}`,
        title,
        description,
        fileType,
        pages: 4 + ((seed * 7) % 11),
        size:
          fileType === "PDF"
            ? `${(0.3 + (seed % 9) * 0.17).toFixed(1)} MB`
            : `${120 + ((seed * 37) % 380)} KB`,
        updated: new Date(2026, seed % 9, 3 + ((seed * 5) % 24)),
        fileUrl: "#",
      };
    });
    return {
      id: `${sem}-${si}`,
      semester: Number(sem),
      name,
      reports,
      latest: new Date(Math.max(...reports.map((r) => r.updated))),
    };
  }),
);

export const fmt = (d) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const sampleNote =
  "Sample data for demonstration. Reports, dates and file details are placeholders.";

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
          <li key={r.no} className={chip}>
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
              key={r.no}
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
                  <p className="mt-0.5 text-sm text-slate-600">
                    {r.description}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2.5 text-xs text-slate-500">
                    <span className="rounded border border-line bg-white px-1.5 py-0.5 font-semibold text-slate-600">
                      {r.fileType}
                    </span>
                    <span>{r.pages} pages</span>
                    <span>Updated {fmt(r.updated)}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <a
                  href={r.fileUrl}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:flex-none"
                >
                  <Eye size={15} />
                  View
                </a>
                <a
                  href={r.fileUrl}
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

// Route: /lab-reports (the Navbar links here as /lab-reports?semester=N)
export default function LabReports() {
  const [params] = useSearchParams();
  const semParam = params.get("semester");
  const active = /^[1-8]$/.test(semParam ?? "") ? Number(semParam) : "all";
  const [selected, setSelected] = useState(null);

  const shown =
    active === "all" ? subjects : subjects.filter((s) => s.semester === active);

  useEffect(() => {
    document.title = selected
      ? `${selected.name} Lab Reports – LearnDesk`
      : "BCA Lab Reports – LearnDesk";
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
