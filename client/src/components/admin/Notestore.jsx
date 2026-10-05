export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${API_BASE}/notes`;

const getToken = () =>
  localStorage.getItem("adminToken") || localStorage.getItem("token");

export const request = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const resourceTypes = [
  { value: "notes", label: "Notes" },
  { value: "other", label: "Other" },
];

export const typeLabel = (v) =>
  resourceTypes.find((t) => t.value === v)?.label ?? v;

export const getNote = (id) => request(`${API}/${id}`);

export const getCatalog = async () => {
  const response = await fetch(`${API_BASE}/catalog`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load catalog");
  return data;
};

const normalizeNote = (note) => ({
  ...note,
  semester: note.semester?.number ?? note.semesterId,
  subject: note.subject?.name ?? note.subjectId,
  resourceType: "notes",
  status: "published",
  unit: null,
  date: note.createdAt,
});

export const getNotes = () =>
  request(API).then((notes) => notes.map(normalizeNote));

export const addNote = (data) =>
  request(API, {
    method: "POST",
    body: data,
  });

export const updateNote = (id, data) =>
  request(`${API}/${id}`, {
    method: "PUT",
    body: data,
  });

export const deleteNote = (id) =>
  request(`${API}/${id}`, {
    method: "DELETE",
  });
