import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  LogIn,
  Newspaper,
  CircleHelp,
  Info,
  Mail,
} from "lucide-react";
import { categoryIcons } from "./ResourceCard.jsx";

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

// Each of these opens a Semester 1-8 menu. Only Syllabus and Notes have real routes so far;
// the others stay "#" placeholders until their pages exist.
const resourceMenus = [
  "Notes",
  "Syllabus",
  "Question Papers",
  "Lab Reports",
  "Projects",
];

const routes = { Syllabus: "/syllabus", Notes: "/notes" };
const allHref = (name) => routes[name] ?? "#";
const semHref = (name, n) => {
  if (name === "Syllabus") return `/syllabus/${n}`;
  if (name === "Notes") return `/notes?semester=${n}`;
  return "#";
};

// Internal routes use <Link>, placeholders stay plain anchors.
function A({ href, ...props }) {
  return href.startsWith("/") ? (
    <Link to={href} {...props} />
  ) : (
    <a href={href} {...props} />
  );
}

const moreLinks = [
  {
    label: "Solutions",
    text: "Worked answers to papers",
    icon: categoryIcons.Solutions,
  },
  { label: "Articles", text: "Study guides and tips", icon: Newspaper },
  { label: "FAQ", text: "Common questions", icon: CircleHelp },
  { label: "About LearnDesk", text: "What we are building", icon: Info },
  { label: "Contact", text: "Reach the team", icon: Mail },
];

// Logo mark: a document with a folded corner and a graduation cap line
export function Logo({ dark = false }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5"
      aria-label="LearnDesk home"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect
          width="32"
          height="32"
          rx="8"
          className={dark ? "fill-brand-500" : "fill-brand-700"}
        />
        <path
          d="M9.5 7.5h8.2l5.3 5.3v11a1.5 1.5 0 0 1-1.5 1.5H9.5A1.5 1.5 0 0 1 8 23.8V9A1.5 1.5 0 0 1 9.5 7.5Z"
          fill="#fff"
        />
        <path
          d="M17.7 7.5v4.1a1.2 1.2 0 0 0 1.2 1.2H23"
          className="stroke-brand-300"
          strokeWidth="1.4"
        />
        <path
          d="M11.5 17h9M11.5 20.2h6"
          className="stroke-brand-600"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`text-[19px] font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        Learn
        <span className={dark ? "text-brand-300" : "text-brand-600"}>Desk</span>
      </span>
    </Link>
  );
}

const navItem =
  "flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // desktop: which menu is open
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null); // mobile: which category is expanded

  const closeAll = () => {
    setOpen(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="wrap flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo />

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Main"
          onMouseLeave={() => setOpen(null)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(null)}
        >
          <Link
            to="/"
            className={`${navItem} !text-brand-700`}
            onMouseEnter={() => setOpen(null)}
          >
            Home
          </Link>

          {resourceMenus.map((name) => {
            const Icon = categoryIcons[name];
            const isOpen = open === name;
            return (
              <div
                key={name}
                className="relative"
                onMouseEnter={() => setOpen(name)}
              >
                <button
                  className={`${navItem} ${isOpen ? "bg-brand-50 !text-brand-700" : ""}`}
                  aria-expanded={isOpen}
                  onClick={() => {
                    // Clicking "Syllabus" or "Notes" itself opens its page
                    if (routes[name]) {
                      closeAll();
                      navigate(routes[name]);
                    } else {
                      setOpen(isOpen ? null : name);
                    }
                  }}
                >
                  {name}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                    <div className="w-[25rem] rounded-xl border border-line bg-white p-4 shadow-lift">
                      <div className="mb-3 flex items-center justify-between px-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Icon size={16} className="text-brand-600" />
                          {name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Choose a semester
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {semesters.map((n) => (
                          <A
                            key={n}
                            href={semHref(name, n)}
                            onClick={closeAll}
                            className="group rounded-lg border border-line px-2 py-2 text-center transition-colors hover:border-brand-300 hover:bg-brand-50"
                          >
                            <span className="block text-[11px] text-slate-500">
                              Semester
                            </span>
                            <span className="block text-lg font-bold leading-6 text-ink group-hover:text-brand-700">
                              {n}
                            </span>
                          </A>
                        ))}
                      </div>
                      <A
                        href={allHref(name)}
                        onClick={closeAll}
                        className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                      >
                        {routes[name] ? "All Semesters" : `All ${name}`}
                        <ArrowRight size={14} />
                      </A>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="relative" onMouseEnter={() => setOpen("More")}>
            <button
              className={`${navItem} ${open === "More" ? "bg-brand-50 !text-brand-700" : ""}`}
              aria-expanded={open === "More"}
              onClick={() => setOpen(open === "More" ? null : "More")}
            >
              More
              <ChevronDown
                size={14}
                className={`transition-transform ${open === "More" ? "rotate-180" : ""}`}
              />
            </button>
            {open === "More" && (
              <div className="absolute right-0 top-full pt-3">
                <ul className="w-64 rounded-xl border border-line bg-white p-2 shadow-lift">
                  {moreLinks.map(({ label, text, icon: Icon }) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-brand-50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600 group-hover:bg-white">
                          <Icon size={16} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">
                            {label}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {text}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {/* Search is visual only for now */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <a
            href="#"
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 xl:flex"
          >
            <LogIn size={15} />
            Admin Login
          </a>
          {/* Plain anchor so "/#categories" also works from other pages */}
          <a
            href="/#categories"
            className="hidden rounded-md bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 xl:block"
          >
            Browse Resources
          </a>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-brand-50 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu: the grid-rows trick animates height without extra state */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out xl:hidden ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        inert={mobileOpen ? undefined : ""}
      >
        <div className="overflow-hidden">
          <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line px-4 pb-6 pt-4">
            <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-slate-500">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search notes, papers, subjects"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
              />
            </label>

            <ul className="mt-3 divide-y divide-line">
              <li>
                <Link
                  to="/"
                  onClick={closeAll}
                  className="block py-3 text-[15px] font-semibold text-brand-700"
                >
                  Home
                </Link>
              </li>

              {[...resourceMenus, "More"].map((name) => {
                const isMore = name === "More";
                const Icon = categoryIcons[name];
                const isOpen = expanded === name;
                return (
                  <li key={name}>
                    <button
                      className="flex w-full items-center justify-between py-3 text-[15px] font-semibold text-ink"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : name)}
                    >
                      <span className="flex items-center gap-2.5">
                        {Icon && <Icon size={17} className="text-brand-600" />}
                        {name}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      inert={isOpen ? undefined : ""}
                    >
                      <div className="overflow-hidden">
                        {isMore ? (
                          <ul className="space-y-1 pb-3">
                            {moreLinks.map(({ label, icon: MoreIcon }) => (
                              <li key={label}>
                                <a
                                  href="#"
                                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-brand-50"
                                >
                                  <MoreIcon
                                    size={15}
                                    className="text-brand-600"
                                  />
                                  {label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 pb-4">
                            <A
                              href={allHref(name)}
                              onClick={closeAll}
                              className="col-span-4 flex items-center justify-between rounded-md bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
                            >
                              {routes[name] ? "All Semesters" : `All ${name}`}
                              <ArrowRight size={14} />
                            </A>
                            {semesters.map((n) => (
                              <A
                                key={n}
                                href={semHref(name, n)}
                                onClick={closeAll}
                                className="rounded-md border border-line py-2 text-center text-sm font-semibold text-ink hover:border-brand-300 hover:bg-brand-50"
                              >
                                Sem {n}
                              </A>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <a
              href="#"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-line py-2.5 text-sm font-semibold text-ink hover:bg-brand-50"
            >
              <LogIn size={16} />
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
