const API_BASE = "http://localhost:8080/api";

export const categoryApi = {
  getAll: () => fetch(`${API_BASE}/category/all`).then(res => res.json()),
  create: (name) => fetch(`${API_BASE}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/category/${id}`, { method: 'DELETE' })
};

export const hobbyApi = {
  getAll: () => fetch(`${API_BASE}/hobbies`).then(res => res.json()),
  getById: async (id) => {
      const response = await fetch(`${API_BASE}/hobbies/${id}`);
      if (!response.ok) throw new Error("Hobby not found");
      return response.json();
  },
  create: (data) => fetch(`${API_BASE}/hobbies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  update: (id, data) => fetch(`${API_BASE}/hobbies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/hobbies/${id}`, { method: 'DELETE' })
};

export const suggestionApi = {
  getAll: () => fetch(`${API_BASE}/suggestions`).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/suggestions/${id}`, { method: 'DELETE' })
};