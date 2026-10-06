import { Mail } from "lucide-react";
import { Logo } from "./Navbar.jsx";

const columns = [
  {
    title: "Academic Resources",
    links: [
      "Notes",
      "Syllabus",
      "Question Papers",
      "Lab Reports",
      "Projects",
      "Solutions",
    ],
  },
  {
    title: "Quick Links",
    links: ["Home", "Browse by Semester", "Articles", "FAQ", "About StudyHub"],
  },
  {
    title: "Support",
    links: ["Contact", "Submit a Resource", "Report a Problem", "Admin Login"],
  },
];

// Lucide no longer ships brand icons, so these are small inline SVGs in the same stroke style.
const socials = [
  {
    label: "Facebook",
    shape: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "Instagram",
    shape: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    label: "YouTube",
    shape: (
      <>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Notes, syllabus, question papers, lab reports and projects for
            college students, organized by semester and subject.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ label, shape }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {shape}
                </svg>
              </a>
            ))}
            <a
              href="#"
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-slate-400 transition-colors hover:border-white/25 hover:text-white"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {columns.map(({ title, links }, i) => (
          <div
            key={title}
            className={`lg:col-span-2 ${i === 0 ? "lg:col-start-6" : ""}`}
          >
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-1 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} StudyHub. All rights reserved.</p>
          <p>Built for college students in Nepal.</p>
        </div>
      </div>
    </footer>
  );
}
