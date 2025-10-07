import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "../services/api";
import "../styles/users.css";

const fullName = (u) => {
    const first = u.first_name?.trim();
    const last = u.last_name?.trim();
    if (first || last) return [first, last].filter(Boolean).join(" ");
    return u.username || "Без імені";
};

const avatarAlt = (u) => fullName(u);

export default function AdminUsersList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getAllUsers();
                if (!mounted) return;
                setItems(Array.isArray(data.users) ? data.users : []);
            } catch (e) {
                setErr(e.message || "Помилка завантаження");
            } finally {
                setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const empty = !loading && !err && items.length === 0;

    return (
        <div className="users-page">
            <h2 className="users-title">Учні</h2>

            {loading && <p>Завантаження...</p>}
            {err && <p className="error-text">{err}</p>}
            {empty && <p>Користувачів поки немає.</p>}

            {!loading && !err && items.length > 0 && (
                <ul className="users-list">
                    {items.map((u) => (
                        <li key={u.id} className="users-item">
                            <Link to={`/admin/users/${u.id}`} className="users-item__link">
                                <div className="users-item__avatar">
                                    {u.profile_picture ? (
                                        <img src={u.profile_picture} alt={avatarAlt(u)} />
                                    ) : (
                                        <span className="avatar-placeholder" aria-hidden />
                                    )}
                                </div>

                                <div className="users-item__meta">
                                    <span className="users-item__name">{fullName(u)}</span>
                                    <span className="users-item__sub"> · {u.role}</span>

                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
