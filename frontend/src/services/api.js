const API_BASE = "http://localhost:8080/api";
const token = localStorage.getItem("accessToken");

export const categoryApi = {
  getAll: () => fetch(`${API_BASE}/categories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()),

  create: (name) => fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  }).then(res => res.json()),

  delete: (id) => fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })
};

export const hobbyApi = {
  getAll: () => fetch(`${API_BASE}/hobbies`).then(res => res.json()),
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/hobbies/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error("Hobby not found");
    return response.json();
  },

  create: (data, imageFile) => {
    const formData = new FormData();

    const hobbyBlob = new Blob([JSON.stringify({
      name: data.name,
      description: data.description,
      categoryIds: data.categoryIds,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      difficulty: data.difficulty
    })], { type: 'application/json' });

    formData.append('hobby', hobbyBlob);
    formData.append('image', imageFile);

    return fetch(`${API_BASE}/hobbies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create hobby');
      return res.json();
    });
  },

  update: (id, data, imageFile) => {
    const formData = new FormData();

    const hobbyBlob = new Blob([JSON.stringify({
      name: data.name,
      description: data.description,
      categoryIds: data.categoryIds,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      difficulty: data.difficulty
    })], { type: 'application/json' });

    formData.append('hobby', hobbyBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return fetch(`${API_BASE}/hobbies/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update hobby');
      return res.json();
    });
  },

  delete: (id) => fetch(`${API_BASE}/hobbies/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
};

export const suggestionApi = {
  getAll: () => fetch(`${API_BASE}/suggestions`).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/suggestions/${id}`, { method: 'DELETE' })
};

export const authApi = {
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    return response.ok;
  },

  refreshToken: async () => {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }
};