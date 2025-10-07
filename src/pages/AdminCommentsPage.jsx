import { useEffect, useMemo, useState } from "react";
import { fetchAllReviews } from "../services/api";
import "../styles/comments.css";

function formatDate(dt) {
    if (!dt) return "";
    const d = new Date(dt);
    return d.toLocaleString(); // за потреби: uk-UA
}

function userDisplayName(user) {
    if (!user) return "Користувач";
    const { first_name, last_name, username, email } = user;
    const fn = [first_name, last_name].filter(Boolean).join(" ").trim();
    return fn || username || email || "Користувач";
}

export default function AdminCommentsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const data = await fetchAllReviews();
                if (!cancelled) {
                    setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
                }
            } catch (e) {
                if (!cancelled) setError(e.message || "Не вдалося завантажити відгуки");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const items = useMemo(() => {
        return reviews
            .map(r => ({
                id: r.id,
                userName: userDisplayName(r.user),
                avatarUrl: null,
                course: r.course?.title || `Курс #${r.course_id}`,
                text: r.comment,
                rating: r.rating,
                createdAt: r.created_at,
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [reviews]);

    if (loading) {
        return (
            <div className="comments-page">
                <div className="comments-loading">Завантаження відгуків…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comments-page">
                <div className="comments-error">
                    Помилка: {error}
                    <div className="hint">Переконайся, що ти залогінений як адміністратор і маєш валідний токен.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="comments-page">
            <ul className="comments-list">
                {items.map(item => (
                    <li key={item.id} className="comment-item">
                        <div className="comment-left">
                            <div className="comment-avatar">
                                {item.avatarUrl ? (
                                    <img src={item.avatarUrl} alt={item.userName} />
                                ) : (
                                    <span className="avatar-dot" />
                                )}
                            </div>

                            <div className="comment-texts">
                                <div className="comment-header">
                                    <div className="comment-name">{item.userName}</div>
                                    <div className="comment-date">{formatDate(item.createdAt)}</div>
                                </div>

                                <div className="comment-course">{item.course}</div>

                                <div className="comment-body">{item.text}</div>

                                {typeof item.rating === "number" && (
                                    <div className="comment-rating">
                                        {"★".repeat(item.rating)}{"☆".repeat(Math.max(0, 5 - item.rating))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {items.length === 0 && (
                <div className="comments-empty">Поки що немає відгуків.</div>
            )}
        </div>
    );
}
