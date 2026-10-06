import { useState, version as reactVersion } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  SlidersHorizontal,
  User,
} from "lucide-react";
import AdminLayout from "./AdminLayout.jsx";

/* ---------- Backend hooks ----------
   The project has no admin API or sign-in yet, so each of these rejects on purpose and the
   page shows that as an error. Later, put the real request inside, e.g.
     updateProfile  -> PUT /api/admin/profile   { name, email }
     updatePassword -> PUT /api/admin/password  { currentPassword, newPassword }
     updateSettings -> PUT /api/admin/settings  { defaultStatus, perPage, publicDownloads }
   and load the initial values from GET /api/admin/profile and GET /api/admin/settings. */
const notConnected = () =>
  Promise.reject(new Error("The admin API is not connected yet."));
const updateProfile = () => notConnected();
const updatePassword = () => notConnected();
const updateSettings = () => notConnected();

// No signed-in user exists yet, so the profile starts empty (later: GET /api/admin/profile).
const emptyProfile = { name: "", email: "" };
// Defaults match how the admin and public pages behave today (later: GET /api/admin/settings).
const defaultSettings = {
  defaultStatus: "draft",
  perPage: 10,
  publicDownloads: true,
};

const tabs = [
  ["profile", "Profile", User],
  ["security", "Account & Security", Lock],
  ["resources", "Resource Management", SlidersHorizontal],
  ["system", "System Information", Info],
];

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-500 disabled:hover:border-line";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60";
const btnPrimary = `${btn} bg-brand-700 text-white hover:bg-brand-800`;
const btnLine = `${btn} border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50`;
const bad = "!border-red-400 focus:!ring-red-100";

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const [busy, setBusy] = useState(null);
  const [feedback, setFeedback] = useState({});

  const [profile, setProfile] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({});
  const [pwErrors, setPwErrors] = useState({});

  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const dirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // Runs a save, then shows success or error feedback for that section.
  const run = async (key, task, onDone) => {
    setBusy(key);
    setFeedback((f) => ({ ...f, [key]: null }));
    try {
      await task();
      setFeedback((f) => ({
        ...f,
        [key]: { type: "success", text: "Changes saved." },
      }));
      onDone?.();
    } catch (e) {
      setFeedback((f) => ({
        ...f,
        [key]: { type: "error", text: `Could not save. ${e.message}` },
      }));
    } finally {
      setBusy(null);
    }
  };

  const saveProfile = (e) => {
    e.preventDefault();
    const er = {};
    if (!profile.name.trim()) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(profile.email))
      er.email = "Enter a valid email address.";
    setProfileErrors(er);
    if (Object.keys(er).length) return;
    run(
      "profile",
      () =>
        updateProfile({
          name: profile.name.trim(),
          email: profile.email.trim(),
        }),
      () => setEditing(false),
    );
  };

  const savePassword = (e) => {
    e.preventDefault();
    const er = {};
    if (!pw.current) er.current = "Enter your current password.";
    if (pw.next.length < 8) er.next = "Use at least 8 characters.";
    else if (pw.next === pw.current)
      er.next = "Choose a password different from the current one.";
    if (pw.confirm !== pw.next) er.confirm = "The passwords do not match.";
    setPwErrors(er);
    if (Object.keys(er).length) return;
    run(
      "security",
      () =>
        updatePassword({ currentPassword: pw.current, newPassword: pw.next }),
      () => setPw({ current: "", next: "", confirm: "" }),
    );
  };

  const saveSettings = (e) => {
    e.preventDefault();
    run(
      "resources",
      () => updateSettings(settings),
      () => setSavedSettings(settings),
    );
  };

  const head = (title, text) => (
    <div className="mb-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{text}</p>
    </div>
  );
  const banner = (key) => {
    const f = feedback[key];
    if (!f) return null;
    const ok = f.type === "success";
    return (
      <p
        role={ok ? "status" : "alert"}
        className={`mb-5 flex items-start gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium ${ok ? "border-brand-300 bg-brand-50 text-brand-700" : "border-red-200 bg-red-50 text-red-700"}`}
      >
        {ok ? (
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
        )}
        {f.text}
      </p>
    );
  };
  const err = (text) =>
    text && (
      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
        <AlertCircle size={13} />
        {text}
      </p>
    );
  const spinner = (key) =>
    busy === key && <Loader2 size={15} className="animate-spin" />;
  const initial = profile.name.trim().charAt(0).toUpperCase();

  const passwordFields = [
    ["current", "Current password", "current-password"],
    ["next", "New password", "new-password"],
    ["confirm", "Confirm new password", "new-password"],
  ];

  return (
    <AdminLayout
      title="Settings"
      text="Manage your profile, security and resource defaults"
    >
      <p className="mb-5 flex items-start gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-slate-600">
        <Info size={16} className="mt-0.5 shrink-0 text-brand-600" />
        Changes cannot be saved yet because sign-in and the admin API are not
        connected.
      </p>

      <div className="xl:grid xl:grid-cols-[13rem_minmax(0,1fr)] xl:items-start xl:gap-8">
        <nav
          aria-label="Settings sections"
          className="mb-5 flex gap-1 overflow-x-auto xl:mb-0 xl:flex-col xl:overflow-visible"
        >
          {tabs.map(([key, text, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"}`}
            >
              <Icon size={16} />
              {text}
            </button>
          ))}
        </nav>

        <section className="max-w-3xl rounded-xl border border-line bg-white p-5 shadow-soft sm:p-6">
          {tab === "profile" && (
            <form onSubmit={saveProfile} noValidate>
              {head(
                "Profile",
                "Your name and email as they appear in the admin area.",
              )}
              {banner("profile")}
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-white"
                  aria-hidden="true"
                >
                  {initial || <User size={22} />}
                </span>
                <p className="text-sm text-slate-500">
                  Your initial is used as the avatar. Photo upload can be added
                  later.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={label}>
                    Name
                  </label>
                  <input
                    id="name"
                    disabled={!editing}
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Not available yet"
                    className={`${input} ${profileErrors.name ? bad : ""}`}
                  />
                  {err(profileErrors.name)}
                </div>
                <div>
                  <label htmlFor="email" className={label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled={!editing}
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="Not available yet"
                    className={`${input} ${profileErrors.email ? bad : ""}`}
                  />
                  {err(profileErrors.email)}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setProfileErrors({});
                      }}
                      className={btnLine}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy === "profile"}
                      className={btnPrimary}
                    >
                      {spinner("profile")}
                      {busy === "profile" ? "Saving…" : "Save changes"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className={btnLine}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          )}

          {tab === "security" && (
            <form onSubmit={savePassword} noValidate>
              {head(
                "Account & Security",
                "Change the password you use to sign in to the admin area.",
              )}
              {banner("security")}
              <div className="grid max-w-md gap-5">
                {passwordFields.map(([key, text, auto]) => (
                  <div key={key}>
                    <label htmlFor={`pw-${key}`} className={label}>
                      {text}
                    </label>
                    <div className="relative">
                      <input
                        id={`pw-${key}`}
                        type={showPw[key] ? "text" : "password"}
                        autoComplete={auto}
                        value={pw[key]}
                        onChange={(e) =>
                          setPw((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className={`${input} pr-10 ${pwErrors[key] ? bad : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPw((s) => ({ ...s, [key]: !s[key] }))
                        }
                        aria-label={`${showPw[key] ? "Hide" : "Show"} ${text.toLowerCase()}`}
                        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {key === "next" && !pwErrors.next && (
                      <p className="mt-1.5 text-xs text-slate-500">
                        At least 8 characters.
                      </p>
                    )}
                    {err(pwErrors[key])}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end border-t border-line pt-5">
                <button
                  type="submit"
                  disabled={busy === "security"}
                  className={btnPrimary}
                >
                  {spinner("security")}
                  {busy === "security" ? "Saving…" : "Save Password"}
                </button>
              </div>
            </form>
          )}

          {tab === "resources" && (
            <form onSubmit={saveSettings}>
              {head(
                "Resource Management",
                "Defaults used when adding and listing resources.",
              )}
              {banner("resources")}
              <div className="grid gap-6">
                <fieldset>
                  <legend className={label}>Default publishing status</legend>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["draft", "Draft"],
                      ["published", "Published"],
                    ].map(([value, text]) => (
                      <label key={value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="defaultStatus"
                          value={value}
                          checked={settings.defaultStatus === value}
                          onChange={() =>
                            setSettings((s) => ({ ...s, defaultStatus: value }))
                          }
                          className="peer sr-only"
                        />
                        <span className="block rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 peer-checked:border-brand-700 peer-checked:bg-brand-50 peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300">
                          {text}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    New resources start with this status in the Add forms.
                  </p>
                </fieldset>

                <div>
                  <label htmlFor="perPage" className={label}>
                    Default items per page
                  </label>
                  <select
                    id="perPage"
                    value={settings.perPage}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        perPage: Number(e.target.value),
                      }))
                    }
                    className={`${input} sm:max-w-40`}
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} items
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-slate-500">
                    How many rows the admin lists show on each page.
                  </p>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3">
                  <div>
                    <p
                      id="downloads-label"
                      className="text-sm font-semibold text-ink"
                    >
                      Allow public downloads
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      When off, students can view files on the public pages but
                      not download them.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.publicDownloads}
                    aria-labelledby="downloads-label"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        publicDownloads: !s.publicDownloads,
                      }))
                    }
                    className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${settings.publicDownloads ? "bg-brand-700" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${settings.publicDownloads ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end border-t border-line pt-5">
                <button
                  type="submit"
                  disabled={!dirty || busy === "resources"}
                  className={btnPrimary}
                >
                  {spinner("resources")}
                  {busy === "resources" ? "Saving…" : "Save Settings"}
                </button>
              </div>
            </form>
          )}

          {tab === "system" && (
            <div>
              {head(
                "System Information",
                "Read-only details about this installation.",
              )}
              <dl className="divide-y divide-line rounded-lg border border-line">
                {[
                  ["Application", "StudyHub"],
                  [
                    "Environment",
                    import.meta.env.DEV ? "Development" : "Production",
                  ],
                  ["Frontend", `React ${reactVersion}`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
