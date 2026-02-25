const API_BASE = "http://localhost:8080/api";

export const categoryApi = {
  getAll: () => fetch(`${API_BASE}/categories`).then(res => res.json()),
  create: (name) => fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' })
};

export const hobbyApi = {
  getAll: () => fetch(`${API_BASE}/hobbies`).then(res => res.json()),
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/hobbies/${id}`);
    if (!response.ok) throw new Error("Hobby not found");
    return response.json();
  },

  create: (data, imageFile) => {
    const formData = new FormData();

    // Add hobby data as JSON blob
    const hobbyBlob = new Blob([JSON.stringify({
      name: data.name,
      description: data.description,
      categoryIds: data.categoryIds,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice
    })], { type: 'application/json' });

    formData.append('hobby', hobbyBlob);
    formData.append('image', imageFile);

    return fetch(`${API_BASE}/hobbies`, {
      method: 'POST',
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create hobby');
      return res.json();
    });
  },

  update: (id, data, imageFile) => {
    const formData = new FormData();

    // Add hobby data as JSON blob
    const hobbyBlob = new Blob([JSON.stringify({
      name: data.name,
      description: data.description,
      categoryIds: data.categoryIds,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice
    })], { type: 'application/json' });

    formData.append('hobby', hobbyBlob);

    // Only append image if a new one is selected
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return fetch(`${API_BASE}/hobbies/${id}`, {
      method: 'PATCH',
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update hobby');
      return res.json();
    });
  },

  delete: (id) => fetch(`${API_BASE}/hobbies/${id}`, { method: 'DELETE' })
};


export const suggestionApi = {
  getAll: () => fetch(`${API_BASE}/suggestions`).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/suggestions/${id}`, { method: 'DELETE' })
};