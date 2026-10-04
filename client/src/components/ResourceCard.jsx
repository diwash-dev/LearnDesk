import {
  FileText,
  BookOpen,
  ClipboardList,
  FlaskConical,
  FolderOpen,
  ListChecks,
  ArrowUpRight,
} from "lucide-react";

// One icon per resource category. Navbar and Home reuse this map.
export const categoryIcons = {
  Notes: FileText,
  Syllabus: BookOpen,
  "Question Papers": ClipboardList,
  "Lab Reports": FlaskConical,
  Projects: FolderOpen,
  Solutions: ListChecks,
};

// Shape matches the future API response: { title, subject, semester, category, fileUrl, date }
// The column widths here must match the header row in Home.jsx (md:grid-cols-...).
export default function ResourceCard({
  title,
  subject,
  semester,
  category,
  fileUrl,
  date,
}) {
  const Icon = categoryIcons[category] ?? FileText;
  const added = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <a
      href={fileUrl}
      className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-brand-50/70 sm:px-5 md:grid md:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem_9rem_7.5rem_1.25rem] md:items-center"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand-600 transition-colors group-hover:border-brand-200">
        <Icon size={18} />
      </span>

      {/* md:contents lets the title and meta become direct grid cells on wider screens */}
      <div className="min-w-0 flex-1 md:contents">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-semibold text-ink group-hover:text-brand-700">
            {title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate-500">{subject}</p>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 md:mt-0 md:contents md:text-sm">
          <span className="w-fit rounded bg-brand-50 px-2 py-0.5 font-semibold text-brand-700 md:justify-self-start">
            Semester {semester}
          </span>
          <span className="md:text-slate-600">{category}</span>
          <span>{added}</span>
        </div>
      </div>

      <ArrowUpRight
        size={16}
        className="mt-1 shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 md:mt-0"
      />
    </a>
  );
}
