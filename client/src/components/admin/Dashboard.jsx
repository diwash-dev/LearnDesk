import { useEffect, useState } from "react";
import { FileText, Layers } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import { categoryIcons } from "../../components/ResourceCard.jsx";

/* ---------- Sample data ----------
   Replace with API data in a later step. */
const counts = [
  { label: "Notes", count: 412, added: 18 },
  { label: "Syllabus", count: 64, added: 2 },
  { label: "Question Papers", count: 356, added: 14 },
  { label: "Lab Reports", count: 118, added: 9 },
  { label: "Projects", count: 27, added: 3 },
];

const cards = [
  {
    label: "Total Resources",
    icon: Layers,
    count: counts.reduce((n, c) => n + c.count, 0),
    added: counts.reduce((n, c) => n + c.added, 0),
    primary: true,
  },
  ...counts.map((c) => ({ ...c, icon: categoryIcons[c.label] })),
];

const recent = [
  [
    "Data Structures Unit 3: Trees and Graphs",
    "Notes",
    3,
    "PDF",
    "4 Oct 2026",
    "Published",
  ],
  ["BCA Semester 5 Syllabus", "Syllabus", 5, "PDF", "3 Oct 2026", "Published"],
  [
    "DBMS Question Paper 2025 (Regular)",
    "Question Papers",
    4,
    "PDF",
    "3 Oct 2026",
    "Published",
  ],
  [
    "Operating System Lab 02: Deadlock Avoidance",
    "Lab Reports",
    4,
    "DOCX",
    "2 Oct 2026",
    "Draft",
  ],
  [
    "Online Examination System Report",
    "Projects",
    4,
    "PDF",
    "1 Oct 2026",
    "Published",
  ],
  [
    "Computer Networking Lab 03: Subnetting",
    "Lab Reports",
    5,
    "PDF",
    "30 Sep 2026",
    "Published",
  ],
  [
    "C Programming Notes: Pointers",
    "Notes",
    2,
    "PDF",
    "29 Sep 2026",
    "Published",
  ],
  [
    "Hospital Appointment System Proposal",
    "Projects",
    8,
    "DOCX",
    "28 Sep 2026",
    "Draft",
  ],
];

const cols =
  "md:grid-cols-[minmax(0,1fr)_9rem_5rem_7rem_6rem] md:items-center md:gap-4";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard – LearnDesk";
  }, []);

  // Mobile drawer: close on Escape and stop the page behind it from scrolling.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-64">
        <AdminHeader
          title="Dashboard"
          text="Overview of everything published on LearnDesk"
          onMenu={() => setMenuOpen(true)}
        />

        <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section aria-label="Resource totals">
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map(({ label, icon: Icon, count, added, primary }) => (
                <li
                  key={label}
                  className={`rounded-xl border p-5 shadow-soft ${primary ? "border-brand-700 bg-brand-700" : "border-line bg-white"}`}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${primary ? "text-brand-100" : "text-slate-600"}`}
                    >
                      {label}
                    </p>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${primary ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"}`}
                    >
                      <Icon size={17} />
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-3xl font-extrabold tracking-tight ${primary ? "text-white" : "text-ink"}`}
                  >
                    {count}
                  </p>
                  <p
                    className={`mt-1 text-xs ${primary ? "text-brand-100" : "text-slate-500"}`}
                  >
                    +{added} this month
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Recent uploads"
            className="overflow-hidden rounded-xl border border-line bg-white shadow-soft"
          >
            <div className="px-5 py-4">
              <h2 className="text-base font-bold text-ink">Recent uploads</h2>
              <p className="text-sm text-slate-500">
                The latest files added across all categories
              </p>
            </div>

            <div
              className={`hidden grid-cols-1 border-y border-line bg-surface px-5 py-2.5 text-xs font-semibold text-slate-500 md:grid ${cols}`}
            >
              <span>Title</span>
              <span>Category</span>
              <span>Semester</span>
              <span>Uploaded</span>
              <span>Status</span>
            </div>

            <ul className="divide-y divide-line border-t border-line md:border-t-0">
              {recent.map(([title, category, sem, type, date, status]) => {
                const badge =
                  status === "Published"
                    ? "bg-brand-50 text-brand-700"
                    : "border border-line bg-white text-slate-600";
                return (
                  <li
                    key={title}
                    className={`grid px-5 py-3.5 transition-colors hover:bg-brand-50/50 ${cols}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-600">
                        <FileText size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {title}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {type}
                          <span className="md:hidden">
                            {" "}
                            · {category} · Sem {sem} · {date}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold md:hidden ${badge}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="hidden text-sm text-slate-600 md:block">
                      {category}
                    </p>
                    <p className="hidden text-sm text-slate-600 md:block">
                      Sem {sem}
                    </p>
                    <p className="hidden text-sm text-slate-500 md:block">
                      {date}
                    </p>
                    <span
                      className={`hidden w-fit rounded px-2 py-0.5 text-xs font-semibold md:inline-block ${badge}`}
                    >
                      {status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
