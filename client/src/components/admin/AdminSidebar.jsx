import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { Logo } from "../Navbar.jsx";
import { categoryIcons } from "../ResourceCard.jsx";

// Items with `children` have pages; the rest are placeholders for later steps.
const groups = [
  {
    title: "Content",
    items: [
      {
        label: "Notes",
        base: "/admin/notes",
        to: "/admin/notes",
      },
      { label: "Syllabus", to: "/admin/syllabus" },
      { label: "Question Papers", to: "/admin/question-papers" },
      {
        label: "Lab Reports",
        base: "/admin/lab-reports",
        to: "/admin/lab-reports",
      },
      { label: "Projects", to: "/admin/projects" },
    ].map((i) => ({ ...i, icon: categoryIcons[i.label] })),
  },
  {
    title: "Manage",
    items: [
      { label: "All Resources", icon: Layers },
      { label: "Settings", icon: Settings, to: "/admin/settings" },
    ],
  },
];

const item =
  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors";
const idle = "text-slate-600 hover:bg-brand-50 hover:text-brand-700";
const on = "bg-brand-50 text-brand-700";

export default function AdminSidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(
    groups
      .flatMap((g) => g.items)
      .find((i) => i.base && pathname.startsWith(i.base))?.label ?? null,
  );

  return (
    <aside
      aria-label="Admin"
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-line px-4 lg:h-[4.5rem]">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-brand-50 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin menu">
        <NavLink
          to="/admin"
          end
          onClick={onClose}
          className={({ isActive }) => `${item} ${isActive ? on : idle}`}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>

        {groups.map(({ title, items }) => (
          <div key={title} className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {title}
            </p>
            <ul className="space-y-0.5">
              {items.map(({ label, icon: Icon, base, children, to }) => {
                const isOpen = expanded === label;
                return (
                  <li key={label}>
                    {children ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : label)}
                        className={`${item} ${pathname.startsWith(base) ? "text-brand-700" : idle}`}
                      >
                        <Icon size={17} />
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronDown
                          size={15}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    ) : to ? (
                      <NavLink
                        to={to}
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                          `${item} ${isActive ? on : idle}`
                        }
                      >
                        <Icon size={17} />
                        {label}
                      </NavLink>
                    ) : (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                        }}
                        className={`${item} ${idle}`}
                      >
                        <Icon size={17} />
                        {label}
                      </a>
                    )}
                    {children && isOpen && (
                      <ul className="mt-0.5 space-y-0.5 border-l border-line pl-3 ml-5">
                        {children.map((c) => (
                          <li key={c.to}>
                            <NavLink
                              to={c.to}
                              end
                              onClick={onClose}
                              className={({ isActive }) =>
                                `${item} ${
                                  isActive ||
                                  (c.label.startsWith("All") &&
                                    pathname.startsWith(base) &&
                                    pathname.endsWith("/edit"))
                                    ? on
                                    : idle
                                }`
                              }
                            >
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <Link to="/" className={`${item} ${idle}`}>
          <LogOut size={17} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
