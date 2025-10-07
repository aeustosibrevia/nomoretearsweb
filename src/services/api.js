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


export async function register({ username, first_name, last_name, email, password}) {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, first_name, last_name, email, password})
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

export async function enrollInCourse(username, courseId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/enrollments/${encodeURIComponent(username)}/${courseId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || data.message || 'Не вдалося записатись');
    }
    return data;
}


export async function getMyEnrollments() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/enrollments/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Не вдалося отримати список записів на курси');
    }
    return data;
}


export async function getAllUsers() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/auth/getAllUsers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    });

    if (!res.ok) {
        let msg = 'Не вдалося отримати користувачів';
        try {
            const err = await res.json();
            if (err?.message) msg = err.message;
        } catch (_) {}
        throw new Error(msg);
    }

    return res.json();
}



export async function fetchCourseSlugs({ onlyPublished = false } = {}) {
    const qs = new URLSearchParams({ onlyPublished: String(!!onlyPublished) });
    const res = await fetch(`${API_BASE}/api/courses/slugs?${qs.toString()}`);
    if (!res.ok) throw new Error('Помилка завантаження курсів');
    return res.json();
}


export async function fileToBase64(file) {
    if (!file) return null;
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function createCourse(payload) {
    const resp = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `Помилка створення курсу (${resp.status})`);
    return data;
}

export async function createLesson(payload) {
    const resp = await fetch(`${API_BASE}/api/lessons`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `Помилка створення уроку (${resp.status})`);
    return data;
}


export async function createReview({ course_id, rating, comment }) {
    const resp = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ course_id, rating, comment }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message || `Помилка створення відгуку (${resp.status})`);
    return data;
}


export async function fetchAllReviews() {
    const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "GET",
        headers: authHeaders(),
    });
    if (!res.ok) {
        let details = "";
        try { details = JSON.stringify(await res.json()); } catch (_) {}
        throw new Error(`GET /reviews failed: ${res.status} ${res.statusText} ${details}`);
    }
    return res.json();
}