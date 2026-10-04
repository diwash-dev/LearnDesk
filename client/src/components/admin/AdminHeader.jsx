import { Link } from "react-router-dom";
import { ExternalLink, Menu } from "lucide-react";

export default function AdminHeader({ title, text, onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-brand-50 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-ink">{title}</h1>
          {text && (
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {text}
            </p>
          )}
        </div>

        <Link
          to="/"
          className="hidden items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 sm:flex"
        >
          <ExternalLink size={15} />
          View site
        </Link>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white"
          title="Admin"
        >
          AD
        </span>
      </div>
    </header>
  );
}
