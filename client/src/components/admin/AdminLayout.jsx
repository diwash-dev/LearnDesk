import { useState } from "react";
import AdminHeader from "./AdminHeader.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout({ title, text, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader title={title} text={text} onMenu={() => setOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
