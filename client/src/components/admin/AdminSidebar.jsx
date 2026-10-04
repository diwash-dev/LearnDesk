import { Link, NavLink } from "react-router-dom";
import { Layers, LayoutDashboard, LogOut, Settings, X } from "lucide-react";
import { Logo } from "../Navbar.jsx";
import { categoryIcons } from "../ResourceCard.jsx";

// Only Dashboard has a page so far; everything else is a placeholder for later steps.
const groups = [
  {
    title: "Content",
    items: [
      "Notes",
      "Syllabus",
      "Question Papers",
      "Lab Reports",
      "Projects",
    ].map((label) => ({ label, icon: categoryIcons[label] })),
  },
  {
    title: "Manage",
    items: [
      { label: "All Resources", icon: Layers },
      { label: "Settings", icon: Settings },
    ],
  },
];

const item =
  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors";
const idle = "text-slate-600 hover:bg-brand-50 hover:text-brand-700";

export default function AdminSidebar({ open, onClose }) {
  return (
    <aside
      aria-label="Admin"
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-line px-4 lg:h-18">
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
          className={({ isActive }) =>
            `${item} ${isActive ? "bg-brand-50 text-brand-700" : idle}`
          }
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
              {items.map(({ label, icon: Icon }) => (
                <li key={label}>
                  {label === "Notes" ||
                  label === "Syllabus" ||
                  label === "Question Papers" ? (
                    <NavLink
                      to={
                        label === "Notes"
                          ? "/admin/notes"
                          : label === "Syllabus"
                            ? "/admin/syllabus"
                            : "/admin/question-papers"
                      }
                      onClick={onClose}
                      className={({ isActive }) =>
                        `${item} ${isActive ? "bg-brand-50 text-brand-700" : idle}`
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
                </li>
              ))}
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
