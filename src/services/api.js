const API_BASE = 'http://localhost:3000';

export async function register({ username, email, password}) {
    const response = await fetch(`${API_BASE}/register`, {
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
    const response = await fetch(`${API_BASE}/login`, {
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