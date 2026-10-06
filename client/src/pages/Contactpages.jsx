import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/*
  StudyHub Contact Us page (single file, React + Tailwind, no extra dependencies).
  Navbar and footer are NOT included: render this inside your existing layout.
  Edit the palette once in THEME (blue, white, slate).

  Props (all optional):
  - onSubmit(values): async function that really sends the message.
    Without it the form validates but says the message was NOT sent.
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

const CATEGORIES = [
  "General Support",
  "Report an Issue",
  "Feedback & Suggestion",
  "Other",
];

const ITEMS = [
  {
    title: "General Support",
    category: "General Support",
    text: "Questions about using StudyHub and its resources.",
    icon: "M8.5 9a3.5 3.5 0 1 1 5 3.2c-.9.5-1.5 1-1.5 2M12 18h.01",
  },
  {
    title: "Report an Issue",
    category: "Report an Issue",
    text: "Tell us if something is broken or not working correctly.",
    icon: "M12 8v5m0 3h.01M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z",
  },
  {
    title: "Feedback & Suggestions",
    category: "Feedback & Suggestion",
    text: "Share ideas that can help improve StudyHub.",
    icon: "M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z",
  },
];

const NOTICES = {
  sent: [
    "status",
    "border-[var(--p)]/25 bg-[var(--tint)] text-[var(--ink)]",
    "Message sent. We'll get back to you as soon as possible.",
  ],
  failed: [
    "alert",
    "border-red-300 bg-red-50 text-red-700",
    "We couldn't send your message. Check your connection and try again.",
  ],
  unconnected: [
    "status",
    "border-[var(--line)] bg-[var(--paper)] text-[var(--mute)]",
    "Your message was not sent. This form isn't connected to a sending service yet.",
  ],
};

const EMPTY = { name: "", email: "", category: "", subject: "", message: "" };

const input =
  "w-full h-11 rounded-lg border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--mute)]/60 transition duration-200 hover:border-[var(--p)]/40 focus:border-[var(--p)] focus:outline-none focus:ring-2 focus:ring-[var(--p)]/15 aria-[invalid=true]:border-red-500";

const grid = {
  backgroundImage:
    "linear-gradient(to right, rgb(36 86 230 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(36 86 230 / 0.07) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
  maskImage:
    "radial-gradient(ellipse 80% 100% at 75% 0%, black, transparent 75%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 80% 100% at 75% 0%, black, transparent 75%)",
};

export default function ContactPage({ onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed | unconnected

  const set = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
    setStatus("idle");
  };

  const pick = (category) => {
    setValues((v) => ({ ...v, category }));
    setErrors((er) => ({ ...er, category: undefined }));
    const el = document.getElementById("name");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!values.name.trim()) er.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email))
      er.email = "Enter a valid email address.";
    if (!values.category) er.category = "Choose a category.";
    if (!values.subject.trim()) er.subject = "Add a short subject.";
    if (values.message.trim().length < 10)
      er.message = "Write at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;

    if (!onSubmit) return setStatus("unconnected");
    setStatus("sending");
    try {
      await onSubmit(values);
      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const aria = (id) => ({
    "aria-invalid": !!errors[id],
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });
  const label = (id, text) => (
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-(--ink)">
      {text}
    </label>
  );
  const err = (id) =>
    errors[id] && (
      <p id={`${id}-error`} className="mt-2 text-xs text-red-600">
        {errors[id]}
      </p>
    );
  const notice = NOTICES[status];

  return (
    <main style={THEME} className="bg-white text-(--ink)">
      <Navbar />
      {/* Compact hero */}
      <section className="relative overflow-hidden border-b border-(--line) bg-(--paper)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={grid}
        />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-10 px-6 py-12 sm:py-16">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-(--p)">
              <span aria-hidden="true" className="h-px w-6 bg-(--p)" />
              StudyHub · Contact
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              How can we help?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-(--mute)">
              Questions, feedback, or something not working? Send us a message
              and we’ll be happy to help.
            </p>
          </div>

          {/* Abstract "conversation" visual: two message bubbles, pure CSS */}
          <div
            aria-hidden="true"
            className="relative hidden h-36 w-72 shrink-0 md:block"
          >
            <div className="absolute left-0 top-0 w-48 space-y-2 rounded-2xl rounded-bl-md border border-(--line) bg-white p-4 shadow-sm">
              <span className="block h-2 w-32 rounded-full bg-(--line)" />
              <span className="block h-2 w-24 rounded-full bg-(--line)" />
            </div>
            <div className="absolute bottom-0 right-0 w-44 space-y-2 rounded-2xl rounded-br-md bg-(--p) p-4 shadow-[0_12px_24px_-12px_rgb(36_86_230/0.6)]">
              <span className="block h-2 w-28 rounded-full bg-white/70" />
              <span className="block h-2 w-16 rounded-full bg-white/40" />
            </div>
            <span className="absolute right-2 top-2 h-16 w-16 rounded-full border border-(--p)/25" />
            <span className="absolute right-8 top-8 h-4 w-4 rounded-full border border-(--p)/30 bg-(--tint)" />
          </div>
        </div>
      </section>

      {/* Main contact area */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-[5fr_6fr] md:gap-10 lg:gap-16 lg:py-20">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Contact &amp; Support
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-(--mute)">
            Contact StudyHub with questions, problems, or suggestions. Choose
            what fits best and we’ll take it from there.
          </p>

          <ul className="mt-8 divide-y divide-(--line) border-y border-(--line)">
            {ITEMS.map((it) => (
              <li key={it.title}>
                <button
                  type="button"
                  onClick={() => pick(it.category)}
                  className="group -mx-3 flex w-[calc(100%+1.5rem)] items-start gap-4 rounded-lg px-3 py-5 text-left transition duration-200 hover:bg-(--tint)/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--p)/40"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--tint) text-(--p) transition duration-200 group-hover:bg-(--p) group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={it.icon} />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {it.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-(--mute)">
                      {it.text}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-2xl border border-(--line) bg-white p-6 shadow-[0_1px_2px_rgb(14_26_54/0.04),0_16px_40px_-24px_rgb(14_26_54/0.2)] sm:p-8"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            Send us a message
          </h2>

          <div aria-live="polite">
            {notice && (
              <p
                role={notice[0]}
                className={`mt-5 rounded-lg border px-4 py-3 text-sm ${notice[1]}`}
              >
                {notice[2]}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["name", "Full name", "Your full name", "name", "text"],
              ["email", "Email address", "you@example.com", "email", "email"],
            ].map(([id, text, ph, auto, type]) => (
              <div key={id}>
                {label(id, text)}
                <input
                  id={id}
                  name={id}
                  type={type}
                  autoComplete={auto}
                  placeholder={ph}
                  value={values[id]}
                  onChange={set}
                  className={input}
                  {...aria(id)}
                />
                {err(id)}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              {label("category", "Reason / Category")}
              <select
                id="category"
                name="category"
                value={values.category}
                onChange={set}
                className={`${input} ${values.category ? "" : "text-(--mute)/60"}`}
                {...aria("category")}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="text-(--ink)">
                    {c}
                  </option>
                ))}
              </select>
              {err("category")}
            </div>
            <div>
              {label("subject", "Subject")}
              <input
                id="subject"
                name="subject"
                placeholder="What is this about?"
                value={values.subject}
                onChange={set}
                className={input}
                {...aria("subject")}
              />
              {err("subject")}
            </div>
            <div>
              {label("message", "Message")}
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Share as much detail as you can."
                value={values.message}
                onChange={set}
                className={`${input} h-auto resize-y py-3 leading-relaxed`}
                {...aria("message")}
              />
              {err("message")}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-(--p) px-7 text-sm font-medium text-white transition duration-200 hover:bg-(--pd) active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--p)/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>

      <p className="mx-auto max-w-6xl px-6 pb-14 text-center text-sm text-(--mute)">
        We'll review your message and get back to you as soon as possible.
      </p>
      <Footer />
    </main>
  );
}
