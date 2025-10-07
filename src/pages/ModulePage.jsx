import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/ModuleStyle.css";
import { getCourseBySlugs, createReview } from "../services/api";

function toYoutubeId(url = "") {
    try {
        const m1 = url.match(/youtu\.be\/([^?&#/]+)/i);
        if (m1) return m1[1];
        const u = new URL(url);
        if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
    } catch (_) {}
    return "";
}

export default function ModulePage() {
    const { categorySlug, courseSlug } = useParams(); // /courses/:categorySlug/:courseSlug
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [revOpen, setRevOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [revBusy, setRevBusy] = useState(false);
    const [revOk, setRevOk] = useState("");
    const [revErr, setRevErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await getCourseBySlugs(categorySlug, courseSlug);
                setCourse(data);
                setError("");
            } catch (e) {
                setError(e.message || "Не вдалося завантажити курс");
            } finally {
                setLoading(false);
            }
        })();
    }, [categorySlug, courseSlug]);

    const firstLesson = useMemo(() => (course?.lessons?.[0] || null), [course]);
    const firstYoutubeId = useMemo(
        () => toYoutubeId(firstLesson?.video_data || ""),
        [firstLesson]
    );

    function toggleReview(open = !revOpen) {
        setRevOpen(open);
        if (open) {
            setRevOk("");
            setRevErr("");
        }
    }
    function handlePickStars(n) {
        setRating(n);
    }
    async function submitReview() {
        if (!course?.id) return;
        if (!rating) {
            setRevErr("Оцініть курс від 1 до 5.");
            return;
        }
        setRevBusy(true);
        setRevErr("");
        setRevOk("");
        try {
            await createReview({
                course_id: course.id,
                rating: Number(rating),
                comment: comment.trim(),
            });
            setRevOk("Відгук надіслано!");
            setTimeout(() => {
                setComment("");
                setRating(0);
                setRevOk("");
                setRevOpen(false);
            }, 1500);
        } catch (e) {
            setRevErr(e.message || "Не вдалося створити відгук");
        } finally {
            setRevBusy(false);
        }
    }

    if (loading) {
        return (
            <div className="module-layout">
                <section className="module-main">
                    <div className="video-box">
                        <div className="player-16x9 skeleton" />
                    </div>
                    <div className="lesson-info">
                        <h2 className="pill-title">Завантаження…</h2>
                        <p className="lesson-desc">Будь ласка, зачекайте</p>
                    </div>
                </section>
            </div>
        );
    }
    if (error)
        return (
            <div className="module-layout">
                <div className="error-block">{error}</div>
            </div>
        );
    if (!course) return null;

    return (
        <div className="module-layout">
            <section className="module-main">
                <button
                    className="back-btn"
                    aria-label="Назад"
                    onClick={() => window.history.back()}
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 19.5L7 12l8.5-7.5" />
                    </svg>
                </button>

                <div className="video-box">
                    <div className="player-16x9">
                        {firstYoutubeId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${firstYoutubeId}?rel=0&modestbranding=1`}
                                title={firstLesson?.title || course.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        ) : (
                            <div className="no-video">Відео для першого уроку відсутнє</div>
                        )}
                    </div>
                </div>

                <div className="lesson-info">
                    <h1 className="pill-title">{course.title}</h1>
                    {course.description && (
                        <p className="lesson-desc">{course.description}</p>
                    )}

                </div>
            </section>

            <aside className="module-aside">
                <div className="aside-head">
                    <button className="arrow-btn" aria-label="Попередній модуль">
                        ‹
                    </button>
                    <h3 className="aside-title">{course.title}</h3>
                    <button className="arrow-btn" aria-label="Наступний модуль">
                        ›
                    </button>
                </div>

                <ul className="lesson-list">
                    {course.lessons?.map((lsn) => (
                        <li key={lsn.id}>
                            <Link
                                to={`/courses/${categorySlug}/${courseSlug}/lessons/${lsn.slug}`}
                                className="lesson-item"
                            >
                                <span className="lesson-item__title">{lsn.title}</span>
                                {lsn.content && (
                                    <span className="lesson-item__desc">
                    {String(lsn.content).slice(0, 80)}
                                        {String(lsn.content).length > 80 ? "…" : ""}
                  </span>
                                )}
                            </Link>
                            <div className="lesson-divider" />
                        </li>
                    ))}

                    <li>
                        <Link
                            to={`/courses/${categorySlug}/${courseSlug}/notes`}
                            className="lesson-extra__link"
                        >
                            Конспект
                        </Link>
                        <div className="lesson-divider" />
                    </li>
                    <li>
                        <Link
                            to={`/courses/${categorySlug}/${courseSlug}/test`}
                            className="lesson-extra__link"
                        >
                            Тест
                        </Link>
                        <div className="lesson-divider" />
                    </li>
                </ul>

                <div className="aside-actions">
                    <button className="mark-btn">Позначити як виконане</button>
                    <button className="link-btn" onClick={() => toggleReview(true)}>
                        Залишити відгук
                    </button>
                </div>
            </aside>

            <div
                className={`review-panel ${revOpen ? "open" : ""}`}
                role="dialog"
                aria-label="Відгук про курс"
            >
                <div className="review-body">
                    <div className="review-head">
                        <h4 className="review-title">Ваш відгук</h4>
                        <button
                            className="review-close"
                            aria-label="Закрити"
                            onClick={() => toggleReview(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="stars" aria-label="Оцінка">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                className="star-btn"
                                aria-pressed={n <= rating}
                                onClick={() => handlePickStars(n)}
                                title={`${n} з 5`}
                            >
                                {n <= rating ? "★" : "☆"}
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="review-textarea"
                        placeholder="Коротко опишіть враження від курсу…"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {revOk && <div className="review-msg-ok">{revOk}</div>}
                    {revErr && <div className="review-msg-err">{revErr}</div>}

                    <div className="review-actions">
                        <button className="btn-primary" onClick={submitReview} disabled={revBusy}>
                            {revBusy ? "Надсилаю…" : "Надіслати"}
                        </button>
                        <button className="btn-ghost" onClick={() => toggleReview(false)}>
                            Скасувати
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
