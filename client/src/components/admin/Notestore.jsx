const API = "http://localhost:5000/api/notes";

const getToken = () => localStorage.getItem("token");

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
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

export const getNotes = () => request(API);

export const getNote = (id) => request(`${API}/${id}`);

export const addNote = (data) =>
  request(API, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateNote = (id, data) =>
  request(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteNote = (id) =>
  request(`${API}/${id}`, {
    method: "DELETE",
  });
