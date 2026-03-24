const API_BASE = "/api";

const getToken = () => localStorage.getItem("accessToken");

const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
});

let refreshPromise = null;

const tryRefresh = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    })
        .then(async (res) => {
            if (!res.ok) throw new Error("Session expired");
            const data = await res.json();
            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
};

const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, options);

    if (res.status !== 401) return res;

    try {
        await tryRefresh();
    } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("session-expired"));
        return res;
    }

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

const handleResponse = async (res) => {
    if (!res.ok) {
        const text = await res.text();
        let body = {};
        try { body = JSON.parse(text); } catch {}
        const err = new Error(body.message || text || `Request failed with status ${res.status}`);
        err.status = res.status;
        err.body = body;
        throw err;
    }

    if (res.status === 204) return null;
    return res.json();
};

export const authApi = {
    register: (username, email, password) =>
        fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
            credentials: "include",
        }).then(handleResponse),

    login: (email, password) =>
        fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        }).then(handleResponse),

    me: () =>
        fetchWithAuth(`${API_BASE}/auth/me`, { headers: authHeaders() })
            .then(handleResponse),

    logout: () =>
        fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).then((res) => res.ok),
};

export const categoryApi = {
    getAll: () =>
        fetchWithAuth(`${API_BASE}/categories`, { headers: authHeaders() }).then(handleResponse),

    create: (name) =>
        fetchWithAuth(`${API_BASE}/categories`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ name }),
        }).then(handleResponse),

    delete: (id) =>
        fetchWithAuth(`${API_BASE}/categories/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        }).then(handleResponse),
};

export const hobbyApi = {
    getAll: () =>
        fetch(`${API_BASE}/hobbies`).then(handleResponse),

    getById: (id) =>
        fetchWithAuth(`${API_BASE}/hobbies/${id}`, { headers: authHeaders() }).then(handleResponse),

    create: (data, imageFile) => {
        const formData = new FormData();
        formData.append("hobby", new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append("image", imageFile);
        return fetchWithAuth(`${API_BASE}/hobbies`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        }).then(handleResponse);
    },

    update: (id, data, imageFile) => {
        const formData = new FormData();
        formData.append("hobby", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (imageFile) formData.append("image", imageFile);
        return fetchWithAuth(`${API_BASE}/hobbies/${id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        }).then(handleResponse);
    },

    delete: (id) =>
        fetchWithAuth(`${API_BASE}/hobbies/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        }).then(handleResponse),
};

export const suggestionApi = {
    getAll: () =>
        fetchWithAuth(`${API_BASE}/suggestions`, { headers: authHeaders() }).then(handleResponse),

    create: (data) =>
        fetchWithAuth(`${API_BASE}/suggestions`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        }).then(handleResponse),

    delete: (id) =>
        fetchWithAuth(`${API_BASE}/suggestions/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        }).then(handleResponse),
};

export const wishlistApi = {
    getAll: () =>
        fetchWithAuth(`${API_BASE}/users/me/wishlist`, { headers: authHeaders() }).then(handleResponse),

    add: (hobbyId) =>
        fetchWithAuth(`${API_BASE}/users/me/wishlist/${hobbyId}`, {
            method: "POST",
            headers: authHeaders(),
        }).then(handleResponse),

    remove: (hobbyId) =>
        fetchWithAuth(`${API_BASE}/users/me/wishlist/${hobbyId}`, {
            method: "DELETE",
            headers: authHeaders(),
        }).then(handleResponse),
};
