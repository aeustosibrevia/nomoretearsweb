const API_BASE = 'http://localhost:3000';

function authHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}
export async function getProfile() {
    const resp = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'GET',
        headers: authHeaders()
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.errors?.[0] || data.error || 'Не вдалося отримати профіль');
    return data;
}

export async function updateProfileEmail(email) {
    const resp = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ email })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.errors?.[0] || data.error || 'Не вдалося оновити email');
    return data;
}

export async function changePassword({ currentPassword, newPassword }) {
    const resp = await fetch(`${API_BASE}/api/auth/changePassword`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.errors?.[0] || data.error || 'Не вдалося змінити пароль');
    return data;
}
export async function register({ username, email, password}) {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password})
    });

    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.errors?.[0] || data.error || 'Помилка реєстрації')
    }

    return data;
}

export async function login({ email, password}) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.errors?.[0] || data.error || 'Помилка авторизації')
    }

    return data;
}








export async function createCategory(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/categories/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const resData = await response.json();

    if(!response.ok) {
        throw new Error(resData.errors?.[0] || resData.error || 'Помилка створення категорії');
    }

    return resData;
}

export async function fetchCategories() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/api/categories/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Не вдалося отримати категорії');
    }

    return data.categories || data;
}
