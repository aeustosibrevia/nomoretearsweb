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

export async function updateProfile(payload) {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Помилка оновлення профілю');
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



export async function getCoursesByCategorySlug(slug) {
    const res = await fetch(`${API_BASE}/courses/${slug}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Не вдалося завантажити курси');
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


export async function getCourseBySlugs(categorySlug, courseSlug) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/courses/${categorySlug}/${courseSlug}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Не вдалося завантажити курс');
    }
    return data;
}

export async function enrollInCourse(courseId) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Потрібен вхід у систему.');

    const res = await fetch(`${API_BASE}/api/enrollments/${Number(courseId)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
        const msg = data?.error || data?.message || `Помилка ${res.status}`;
        throw new Error(msg);
    }
    return data;
}