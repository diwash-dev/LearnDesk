import {
  ArrowRight,
  Download,
  Clock,
  ClipboardList,
  FileText,
  Plus,
  Newspaper,
  MousePointerClick,
  Layers,
  Library,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ResourceCard, { categoryIcons } from "./components/ResourceCard.jsx";
import { API_BASE } from "./components/admin/Notestore.jsx";

/* ---------- Static data ---------- */

// Counts are placeholders. They will come from the API (GET /api/categories) later.
const categories = [
  {
    title: "Notes",
    text: "Chapter-wise notes written around your syllabus.",
    count: "240+ files",
  },
  {
    title: "Syllabus",
    text: "Official course outlines for every semester.",
    count: "48 files",
  },
  {
    title: "Question Papers",
    text: "Past exam papers to practise with.",
    count: "180+ files",
  },
  {
    title: "Lab Reports",
    text: "Reference reports for practical submissions.",
    count: "95+ files",
  },
  {
    title: "Projects",
    text: "Mini and major project reports.",
    count: "40+ files",
  },
  {
    title: "Solutions",
    text: "Worked answers for papers and exercises.",
    count: "120+ files",
  },
];

// Replace with a fetch to the Express API later (GET /api/resources?sort=latest).
// fileUrl will point to the PDF stored on Cloudinary.
const resources = [
  {
    title: "DBMS Notes",
    subject: "Database Management System",
    semester: 6,
    category: "Notes",
    fileUrl: "#",
    date: "2026-10-02",
  },
  {
    title: "Computer Networks Question Paper",
    subject: "Computer Networks",
    semester: 5,
    category: "Question Papers",
    fileUrl: "#",
    date: "2026-10-01",
  },
  {
    title: "Java Programming Lab Report",
    subject: "Object-Oriented Programming in Java",
    semester: 4,
    category: "Lab Reports",
    fileUrl: "#",
    date: "2026-09-29",
  },
  {
    title: "Web Technology Syllabus",
    subject: "Web Technology",
    semester: 5,
    category: "Syllabus",
    fileUrl: "#",
    date: "2026-09-26",
  },
  {
    title: "Data Structures Solutions",
    subject: "Data Structures and Algorithms",
    semester: 3,
    category: "Solutions",
    fileUrl: "#",
    date: "2026-09-22",
  },
  {
    title: "Library Management System Report",
    subject: "Mini Project",
    semester: 4,
    category: "Projects",
    fileUrl: "#",
    date: "2026-09-18",
  },
];

const features = [
  {
    icon: MousePointerClick,
    title: "Easy access",
    text: "Open and download any file in a click. No sign-up.",
  },
  {
    icon: Layers,
    title: "Organized by semester",
    text: "Every file sits under its semester and subject.",
  },
  {
    icon: Library,
    title: "Academic resources",
    text: "Notes, papers, labs and projects in one library.",
  },
  {
    icon: Zap,
    title: "Fast navigation",
    text: "Reach any semester from the menu in two clicks.",
  },
];

// Can later come from an articles API.
const articles = [
  {
    category: "Exam preparation",
    title: "How to prepare for semester exams",
    text: "A four-week plan that covers the full syllabus, leaves room for revision and keeps the last night calm.",
    date: "Sep 24, 2026",
  },
  {
    category: "Study habits",
    title: "How to organize your study materials",
    text: "Sort notes, handouts and papers by subject so you can find any topic in under a minute.",
    date: "Sep 17, 2026",
  },
  {
    category: "Past papers",
    title: "Why previous question papers matter",
    text: "Spot repeated topics, learn the marking pattern and practise under real exam timing.",
    date: "Sep 9, 2026",
  },
];

const faqs = [
  {
    q: "What is StudyHub?",
    a: "StudyHub is a library of academic resources: notes, syllabus, question papers, lab reports and projects, organized by semester and subject so you can find what you need quickly.",
  },
  {
    q: "Who can use StudyHub?",
    a: "Any college student can browse and download resources. Faculty and admins upload and manage the files.",
  },
  {
    q: "Can students download resources?",
    a: "Yes. Open a category or semester, pick a resource and download the PDF. You do not need an account.",
  },
  {
    q: "Which semesters are supported?",
    a: "Semesters 1 to 8. New subjects and files appear as faculty upload them.",
  },
  {
    q: "How can I submit an academic resource?",
    a: "Send the file through the Contact page. An admin checks it before it is published.",
  },
  {
    q: "Who checks the resources before they go live?",
    a: "Admins review every file for accuracy and relevance before it appears in the library.",
  },
];

/* ---------- Small shared piece ---------- */

function SectionHead({ title, text, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 leading-relaxed text-slate-600">{text}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  const [featured, ...restCategories] = categories;
  const FeaturedIcon = categoryIcons[featured.title];
  const [leadArticle, ...otherArticles] = articles;
  const [resourceCounts, setResourceCounts] = useState({});

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/notes`).then((response) => response.json()),
      fetch(`${API_BASE}/question-papers`).then((response) => response.json()),
      fetch(`${API_BASE}/lab-reports`).then((response) => response.json()),
      fetch(`${API_BASE}/catalog`).then((response) => response.json()),
    ])
      .then(([notes, papers, reports, catalog]) =>
        setResourceCounts({
          Notes: notes.length,
          Syllabus: catalog.reduce(
            (total, semester) => total + semester.subjects.length,
            0,
          ),
          "Question Papers": papers.length,
          "Lab Reports": reports.length,
        }),
      )
      .catch(() => setResourceCounts({}));
  }, []);

  const countLabel = (category) =>
    resourceCounts[category.title] == null
      ? category.count
      : `${resourceCounts[category.title]} files`;

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="overflow-x-clip border-b border-line bg-surface">
          <div className="wrap grid items-center gap-14 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-600">
                ACADEMIC RESOURCE PLATFORM
              </p>
              <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.04] text-ink sm:text-6xl lg:text-[3.25rem] xl:text-[4.25rem]">
                <span className="block">Your Semester.</span>
                <span className="block">Your Resources.</span>
                <span className="block">One Hub.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                StudyHub keeps your notes, syllabus, question papers, lab
                reports and projects in one place, sorted by semester and
                subject, so you spend your time studying instead of searching.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-[15px] font-semibold text-white shadow-soft transition-colors hover:bg-brand-800"
                >
                  Explore Resources
                  <ArrowRight size={17} />
                </a>
                <Link
                  to="/syllabus"
                  className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  Browse by Semester
                  <ArrowRight size={17} />
                </Link>
              </div>

              <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-6 text-sm font-medium text-slate-600">
                {[
                  "8 Semesters",
                  "Multiple Subjects",
                  "Notes • Papers • Labs",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Layered resource visualization: document, semester tabs, floating paper */}
            <div className="relative mx-auto h-[390px] w-full max-w-[470px] sm:h-[440px] lg:ml-auto lg:mr-0">
              <div className="absolute left-3 top-[3.75rem] h-[310px] w-[72%] rounded-xl border border-brand-200 bg-brand-100/70 sm:h-[340px]" />

              <div className="absolute left-0 top-12 flex h-[310px] w-[72%] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-lift sm:h-[340px]">
                <div className="flex items-start gap-3 border-b border-line p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <FileText size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight text-ink">
                      Database Management System
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Notes, 6th Semester
                    </p>
                  </div>
                  <span className="ml-auto rounded bg-brand-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    PDF
                  </span>
                </div>

                <div className="flex-1 space-y-3 p-4">
                  <div className="h-3 w-3/5 rounded bg-ink/85" />
                  <div className="space-y-2">
                    {["w-full", "w-[92%]", "w-[78%]"].map((w) => (
                      <div
                        key={w}
                        className={`h-2 rounded bg-slate-200 ${w}`}
                      />
                    ))}
                  </div>
                  <div className="rounded-md bg-brand-900 p-3 font-mono text-[11px] leading-5 text-brand-200">
                    <p>SELECT name, grade</p>
                    <p>FROM students</p>
                    <p>WHERE semester = 6;</p>
                  </div>
                  <div className="space-y-2">
                    {["w-full", "w-[70%]"].map((w) => (
                      <div
                        key={w}
                        className={`h-2 rounded bg-slate-200 ${w}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-slate-500">
                  Page 1 of 24
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                    <Download size={14} />
                  </span>
                </div>
              </div>

              <div className="absolute right-0 top-20 flex flex-col gap-2">
                {[4, 5, 6, 7, 8].map((n) => (
                  <span
                    key={n}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-bold ${
                      n === 6
                        ? "border-brand-700 bg-brand-700 text-white shadow-soft"
                        : "border-line bg-white text-slate-400"
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>

              <div className="absolute left-5 top-0 z-10 flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-soft">
                <Clock size={13} className="text-brand-600" />
                Added today
              </div>

              <div className="absolute bottom-0 right-2 z-10 flex w-[78%] items-center sm:right-4 sm:w-[64%] gap-3 rounded-xl border border-line bg-white p-3.5 shadow-lift">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <ClipboardList size={17} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    Computer Networks
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Question Paper, 5th Semester
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories: one featured category plus a list, instead of six identical cards */}
        <section
          id="categories"
          className="scroll-mt-20 bg-white py-20 lg:py-24"
        >
          <div className="wrap">
            <SectionHead
              title="Find the right material for every subject"
              text="Six types of resources, each organized by semester and subject."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-12">
              <a
                href="/notes"
                className="bg-grid group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-xl bg-brand-900 p-7 text-white lg:col-span-5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-brand-100">
                  <FeaturedIcon size={24} />
                </span>
                <div>
                  <p className="text-base text-brand-200">
                    {countLabel(featured)}
                  </p>
                  <h3 className="mt-1 text-4xl font-bold">{featured.title}</h3>
                  <p className="mt-2 max-w-xs text-lg leading-relaxed text-brand-100/80">
                    {featured.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-base font-semibold">
                    Open {featured.title}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </a>

              <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white lg:col-span-7">
                {restCategories.map((c) => {
                  const Icon = categoryIcons[c.title];
                  return (
                    <Link
                      key={c.title}
                      to={
                        {
                          Syllabus: "/syllabus",
                          "Question Papers": "/question-papers",
                          "Lab Reports": "/lab-reports",
                          Projects: "/projects",
                        }[c.title] || "#"
                      }
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-brand-50/70"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-white">
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold text-ink">
                          {c.title}
                        </span>
                        <span className="block truncate text-[15px] text-slate-500">
                          {c.text}
                        </span>
                      </span>
                      <span className="hidden text-[15px] text-slate-500 sm:block">
                        {countLabel(c)}
                      </span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Latest resources */}
        <section
          id="resources"
          className="scroll-mt-20 bg-surface py-20 lg:py-24"
        >
          <div className="wrap">
            <SectionHead
              title="Latest resources"
              text="Recently added by faculty."
              action={
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  View All Resources
                  <ArrowRight size={15} />
                </a>
              }
            />

            <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white shadow-soft">
              {/* Header row. Its columns must match ResourceCard's md:grid-cols-... */}
              <div className="hidden gap-4 border-b border-line bg-surface/70 px-5 py-3 text-xs font-medium text-slate-500 md:grid md:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem_9rem_7.5rem_1.25rem]">
                <span />
                <span>Resource</span>
                <span>Semester</span>
                <span>Type</span>
                <span>Added</span>
                <span />
              </div>
              <div className="divide-y divide-line">
                {resources.map((r) => (
                  <ResourceCard key={r.title} {...r} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why StudyHub */}
        <section className="bg-grid bg-brand-900 py-20 text-white lg:py-24">
          <div className="wrap">
            <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">
              Less searching. More studying.
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-brand-900 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-200/85">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section id="articles" className="scroll-mt-20 bg-white py-20 lg:py-24">
          <div className="wrap">
            <SectionHead
              title="Study guides and articles"
              action={
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  All articles
                  <ArrowRight size={15} />
                </a>
              }
            />

            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
              <a href="#" className="group lg:col-span-7">
                <div className="bg-grid relative flex h-56 items-end overflow-hidden rounded-xl bg-brand-900 p-6 sm:h-64">
                  <Newspaper
                    size={110}
                    strokeWidth={1}
                    className="absolute right-6 top-6 text-white/10"
                  />
                  <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-brand-100">
                    {leadArticle.category}
                  </span>
                </div>
                <p className="mt-5 text-sm text-slate-500">
                  {leadArticle.date}
                </p>
                <h3 className="mt-1.5 text-2xl font-bold text-ink transition-colors group-hover:text-brand-700">
                  {leadArticle.title}
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-slate-600">
                  {leadArticle.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Read article
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>

              <div className="divide-y divide-line lg:col-span-5">
                {otherArticles.map((a) => (
                  <a
                    key={a.title}
                    href="#"
                    className="group block py-7 first:pt-0 last:pb-0"
                  >
                    <p className="flex items-center gap-3 text-sm">
                      <span className="font-semibold text-brand-600">
                        {a.category}
                      </span>
                      <span className="text-slate-500">{a.date}</span>
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-ink transition-colors group-hover:text-brand-700">
                      {a.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-slate-600">
                      {a.text}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                      Read article
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ: native <details>, name="faq" keeps one answer open at a time */}
        <section
          id="faq"
          className="scroll-mt-20 border-t border-line bg-surface py-20 lg:py-24"
        >
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold text-ink sm:text-4xl">
                Questions students ask
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Cannot find your answer? Contact the StudyHub team.
              </p>
              <a
                href="/contact"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Contact us
                <ArrowRight size={15} />
              </a>
            </div>

            <div className="border-t border-line lg:col-span-8">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  name="faq"
                  className="group border-b border-line"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-ink transition-colors hover:text-brand-700 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus
                      size={18}
                      className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-2xl pb-5 pr-10 leading-relaxed text-slate-600">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
