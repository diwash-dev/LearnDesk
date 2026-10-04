/* Admin Notes store. It starts from the SAME `files` array the public Notes page uses
   (exported from pages/Notes.jsx), so there is only one dataset.
   Record shape (unchanged):
   { id, semester, subject, title, description, unit, type, resourceType, pages, size, fileUrl, date }
   Admin adds one field: status ("published" | "draft"); existing records count as published.
   Changes live in memory until reload. Replace these functions with API calls later
   (GET/POST/PUT/DELETE /api/notes). */
import { files } from "../../pages/Notes.jsx";

export const resourceTypes = [
  { value: "notes", label: "Notes" },
  { value: "other", label: "Other" },
];
export const typeLabel = (v) =>
  resourceTypes.find((t) => t.value === v)?.label ?? v;

const today = () => new Date().toISOString().slice(0, 10);
let notes = files.map((f) => ({ status: "published", ...f }));
let nextId = Math.max(...files.map((f) => f.id)) + 1;

export const getNotes = () => [...notes];
export const getNote = (id) => notes.find((n) => n.id === Number(id));
export const addNote = (data) => {
  notes = [{ ...data, id: nextId++, date: today() }, ...notes];
};
export const updateNote = (id, data) => {
  notes = notes.map((n) =>
    n.id === Number(id) ? { ...n, ...data, date: today() } : n,
  );
};
export const deleteNote = (id) => {
  notes = notes.filter((n) => n.id !== Number(id));
};
