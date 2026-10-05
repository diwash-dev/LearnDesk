import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const tones = {
  success: {
    title: "Saved successfully",
    bar: "from-brand-700 via-brand-500 to-emerald-500",
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    Icon: CheckCircle2,
  },
  error: {
    title: "Something went wrong",
    bar: "from-red-600 via-rose-500 to-brand-500",
    icon: "bg-red-50 text-red-600 ring-red-100",
    Icon: AlertCircle,
  },
};

export default function AdminToast({
  message,
  title,
  tone = "success",
  duration = 4200,
}) {
  const [dismissedMessage, setDismissedMessage] = useState(null);
  const currentTone = tones[tone] ?? tones.success;
  const Icon = currentTone.Icon;

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(
      () => setDismissedMessage(message),
      duration,
    );
    return () => window.clearTimeout(timer);
  }, [duration, message]);

  const visible = Boolean(message) && dismissedMessage !== message;

  if (!message || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-end sm:top-5">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border border-line bg-white text-ink shadow-lift"
      >
        <div className={`h-1 bg-gradient-to-r ${currentTone.bar}`} />
        <div className="flex gap-3 p-4">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${currentTone.icon}`}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">
              {title ?? currentTone.title}
            </p>
            <p className="mt-0.5 text-sm leading-5 text-slate-600">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissedMessage(message)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
