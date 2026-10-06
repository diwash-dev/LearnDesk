import { useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/*
  StudyHub About page (single file, React + Tailwind, no extra dependencies).
  Navbar and footer are NOT included: render this inside your existing layout.
  Palette lives in THEME (blue, white, slate). No statistics, people,
  testimonials or history are invented; only the four capabilities you listed appear.
*/

const THEME = {
  "--p": "#2456E6",
  "--pd": "#1B45C4",
  "--tint": "#EAF0FF",
  "--ink": "#0E1A36",
  "--mute": "#55627D",
  "--line": "#E1E7F2",
  "--paper": "#F6F8FC",
};

const label =
  "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-(--p)";
const reveal =
  "transition duration-700 ease-out opacity-0 translate-y-3 data-[in=true]:opacity-100 data-[in=true]:translate-y-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none";
const h2 =
  "mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl";
const bar = "block h-2 rounded-full bg-(--line)";

const I = {
  notes:
    "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13V4Z",
  doc: "M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  mark: "M6 4h12v17l-6-4-6 4V4Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  find: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4",
  open: "M14 4h6v6m0-6-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4",
  loop: "M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15m0 5v-5h5",
  simple: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
  grid: "M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z",
  cap: "m2 9 10-5 10 5-10 5L2 9Zm5 3v5c0 1 2.5 2 5 2s5-1 5-2v-5",
};

const FLOW = ["Discover", "Access", "Organize", "Continue Learning"];
const SCATTER = [
  ["Notes", "5%", "4%", -6],
  ["PDFs", "48%", "14%", 5],
  ["Syllabus", "8%", "38%", 4],
  ["Results", "52%", "52%", -5],
  ["Saved Resources", "6%", "74%", -3],
];

const FEATURES = [
  {
    title: "Study Materials",
    text: "Access notes and useful academic learning resources in one place.",
    icon: I.notes,
    span: "md:col-span-4 md:row-span-2 md:p-9",
    kind: "cards",
  },
  {
    title: "Documents",
    text: "Find important PDFs and academic documents without searching through different places.",
    icon: I.doc,
    span: "md:col-span-2",
    kind: "files",
  },
  {
    title: "Syllabus & Results",
    text: "Keep essential academic information easier to find and access.",
    icon: I.list,
    span: "md:col-span-2",
    kind: "rows",
  },
];

const STEPS = [
  ["01", "Discover", "Find the academic resource you need.", I.find],
  [
    "02",
    "Access",
    "Open and use the material without unnecessary friction.",
    I.open,
  ],
  ["03", "Save", "Bookmark useful resources for later.", I.mark],
  [
    "04",
    "Continue Learning",
    "Keep the resources you use most within easy reach.",
    I.loop,
  ],
];

const PRINCIPLES = [
  ["Simple", "A clean experience without unnecessary complexity.", I.simple],
  [
    "Organized",
    "Keep important academic resources structured and easy to access.",
    I.grid,
  ],
  [
    "Student-focused",
    "Designed around practical everyday academic needs.",
    I.cap,
  ],
];

const grid = (alpha, size, origin) => ({
  backgroundImage: `linear-gradient(to right, rgb(36 86 230 / ${alpha}) 1px, transparent 1px), linear-gradient(to bottom, rgb(36 86 230 / ${alpha}) 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
  maskImage: `radial-gradient(ellipse 80% 100% at ${origin}, black, transparent 75%)`,
  WebkitMaskImage: `radial-gradient(ellipse 80% 100% at ${origin}, black, transparent 75%)`,
});

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

// Small product-style preview used inside feature blocks
function Preview({ kind }) {
  if (kind === "cards")
    return (
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            className="space-y-2 rounded-xl border border-(--line) p-3 transition duration-200 group-hover:border-(--p)/25"
          >
            <span className="block h-14 rounded-lg bg-(--paper)" />
            <span className={`${bar} w-4/5`} />
            <span className={`${bar} w-1/2 opacity-60`} />
          </div>
        ))}
      </div>
    );
  if (kind === "saved")
    return (
      <div className="flex gap-2">
        {["w-24", "w-32", "w-20"].map((w, n) => (
          <span
            key={n}
            className="flex items-center gap-2 rounded-full border border-(--line) px-3 py-1.5 transition duration-200 group-hover:border-(--p)/30"
          >
            <Icon d={I.mark} className="h-3.5 w-3.5 text-(--p)" />
            <span className={`${bar} ${w}`} />
          </span>
        ))}
      </div>
    );
  return (
    <div className="divide-y divide-(--line) rounded-xl border border-(--line) px-3">
      {[0, 1, 2].map((n) => (
        <div key={n} className="flex items-center gap-2.5 py-2.5">
          <span
            className={`h-4 w-4 rounded ${n === 0 ? "bg-(--p)/80" : "bg-(--tint)"}`}
          />
          <span className={`${bar} flex-1`} />
          {kind === "rows" && (
            <span className="h-2 w-6 rounded-full bg-(--tint)" />
          )}
        </div>
      ))}
    </div>
  );
}

// Floating panel in the hero composition
const Panel = ({ icon, title, className }) => (
  <div
    className={`absolute flex items-center gap-2.5 rounded-xl border border-(--line) bg-white p-2.5 pr-4 shadow-[0_12px_24px_-16px_rgb(14_26_54/0.35)] ${className}`}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--tint) text-(--p)">
      <Icon d={icon} className="h-4 w-4" />
    </span>
    <span>
      <span className="block text-xs font-semibold">{title}</span>
      <span className={`${bar} mt-1.5 w-12`} />
    </span>
  </div>
);

export default function AboutPage() {
  const root = useRef(null);

  // Reveal on scroll: marks [data-reveal] elements once visible.
  useEffect(() => {
    const els = root.current.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window))
      return els.forEach((el) => el.setAttribute("data-in", "true"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.setAttribute("data-in", "true");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main
      ref={root}
      style={THEME}
      className="overflow-x-clip bg-white text-(--ink)"
    >
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-(--line) bg-(--paper)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={grid(0.07, 40, "50% 0%")}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-40 h-96 w-3xl max-w-full -translate-x-1/2 rounded-full bg-(--p)/10 blur-[100px]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <p className={label}>
            <span aria-hidden="true" className="h-px w-6 bg-(--p)" />
            About StudyHub
            <span aria-hidden="true" className="h-px w-6 bg-(--p)" />
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Everything you need for your academic journey, in one place.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-(--mute) sm:text-lg">
            StudyHub brings essential academic resources together in a simple,
            organized space designed around the everyday needs of students.
          </p>
        </div>
      </section>

      {/* 02 The idea */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div data-reveal className={reveal}>
          <p className={label}>The idea</p>
          <h2 className={h2}>
            Your study resources shouldn't be scattered everywhere.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-(--mute)">
            Students often work with notes, PDFs, syllabi, results, and other
            academic resources spread across different places. StudyHub is
            designed to bring these resources into one organized learning space.
          </p>
          <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm font-medium">
            {FLOW.map((f, i) => (
              <li key={f} className="flex items-center gap-3">
                <span className="rounded-full border border-(--line) bg-white px-3.5 py-1.5">
                  {f}
                </span>
                {i < FLOW.length - 1 && (
                  <Icon d={I.arrow} className="h-4 w-4 text-(--p)" />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Scattered -> organized */}
        <div
          data-reveal
          style={{ transitionDelay: "120ms" }}
          className={`${reveal} grid grid-cols-[1fr_auto_1.15fr] items-center gap-3 sm:gap-5`}
          aria-hidden="true"
        >
          <div className="relative h-64">
            {SCATTER.map(([t, left, top, rot]) => (
              <span
                key={t}
                className="absolute whitespace-nowrap rounded-lg border border-dashed border-(--mute)/40 bg-white px-2.5 py-1.5 text-[11px] text-(--mute) sm:text-xs"
                style={{ left, top, transform: `rotate(${rot}deg)` }}
              >
                {t}
              </span>
            ))}
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-(--p)/30 bg-(--tint) text-(--p)">
            <Icon d={I.arrow} className="h-4 w-4" />
          </span>
          <div className="rounded-2xl border border-(--line) bg-white p-3 shadow-[0_20px_40px_-28px_rgb(14_26_54/0.35)]">
            <div className="mb-1 flex items-center gap-2 border-b border-(--line) pb-2.5 text-xs font-semibold">
              <span className="h-3.5 w-3.5 rounded bg-(--p)" />
              StudyHub
            </div>
            {SCATTER.map(([t]) => (
              <div
                key={t}
                className="flex items-center gap-2.5 border-b border-(--line) py-2.5 text-xs last:border-0"
              >
                <span className="h-4 w-4 rounded bg-(--tint)" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 What's inside */}
      <section className="relative border-y border-(--line) bg-(--paper)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={grid(0.05, 48, "20% 0%")}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div data-reveal className={`${reveal} max-w-xl`}>
            <p className={label}>What's inside</p>
            <h2 className={h2}>
              Everything important, organized in one place.
            </h2>
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            {FEATURES.map((f, i) => (
              <article
                key={f.title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`${reveal} group flex-1 basis-60 rounded-2xl border border-(--line) bg-white p-6 hover:border-(--p)/40`}
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--tint) text-(--p) transition duration-200 group-hover:scale-105 group-hover:bg-(--p) group-hover:text-white">
                    <Icon d={f.icon} />
                  </span>
                  <h3
                    className={`mt-5 font-semibold tracking-tight ${i === 0 ? "text-2xl" : "text-lg"}`}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={`mt-2 max-w-sm leading-relaxed text-(--mute) ${i === 0 ? "" : "text-sm"}`}
                  >
                    {f.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 The experience */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div data-reveal className={`${reveal} max-w-xl`}>
          <p className={label}>The experience</p>
          <h2 className={h2}>From finding a resource to using it.</h2>
        </div>
        <ol className="relative mt-14 grid gap-10 border-l border-(--line) pl-8 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0 lg:pt-10">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 hidden h-px bg-(--line) lg:block"
          />
          {STEPS.map(([n, t, d, ic], i) => (
            <li
              key={n}
              data-reveal
              style={{ transitionDelay: `${i * 140}ms` }}
              className={`${reveal} group relative`}
            >
              <span
                aria-hidden="true"
                className="absolute -left-9.25 top-3 h-2.5 w-2.5 scale-0 rounded-full border-2 border-(--p) bg-white transition duration-500 group-data-[in=true]:scale-100 motion-reduce:scale-100 lg:-top-11.25 lg:left-0"
              />
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-10 left-3 hidden h-px w-[calc(100%+2rem-0.75rem)] origin-left scale-x-0 bg-(--p)/50 transition duration-700 group-data-[in=true]:scale-x-100 motion-reduce:scale-x-100 lg:block"
                />
              )}
              <div className="flex items-end justify-between gap-4 lg:pr-6">
                <span className="text-5xl font-semibold tabular-nums tracking-tight text-(--p)/25 sm:text-6xl">
                  {n}
                </span>
                <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-(--line) text-(--p) transition duration-200 hover:border-(--p)/40">
                  <Icon d={ic} className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 max-w-[16rem] text-sm leading-relaxed text-(--mute)">
                {d}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 05 Why StudyHub */}
      <section className="border-t border-(--line)">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div data-reveal className={`${reveal} max-w-3xl`}>
            <p className={label}>Why StudyHub</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Built around the way students actually study.
            </h2>
          </div>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-0">
            {PRINCIPLES.map(([t, d, ic], i) => (
              <div
                key={t}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`${reveal} group md:px-8 md:first:pl-0 md:last:pr-0 ${i ? "md:border-l md:border-(--line)" : ""}`}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-(--line) text-(--p) transition duration-200 group-hover:border-(--p)/40 group-hover:bg-(--tint)">
                  <Icon d={ic} className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {t}
                </h3>
                <p className="mt-3 max-w-xs leading-relaxed text-(--mute)">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 Mission */}
      <section className="relative overflow-hidden border-t border-(--line) bg-(--tint)/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={grid(0.08, 36, "50% 100%")}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-12 w-px bg-linear-to-b from-(--p)/40 to-transparent"
        />
        <div
          data-reveal
          className={`${reveal} relative mx-auto max-w-4xl px-6 py-20 text-center lg:py-28`}
        >
          <p className={label}>Our mission</p>
          <p className="mt-5 text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            Make academic resources easier to discover, access, and organize.
          </p>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-(--mute)">
            StudyHub aims to make the everyday process of finding, using, and
            keeping academic resources simpler for students.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
