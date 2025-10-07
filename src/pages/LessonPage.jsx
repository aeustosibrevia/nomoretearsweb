import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/ModuleStyle.css";
import { getCourseBySlugs } from "../services/api";

function toYoutubeId(url = "") {
    try {
        const m1 = url.match(/youtu\.be\/([^?&#/]+)/i);
        if (m1) return m1[1];
        const u = new URL(url);
        if (u.hostname.includes("youtube.com")) {
            return u.searchParams.get("v") || "";
        }
    } catch {}
    return "";
}

export default function LessonPage() {
    const { categorySlug, courseSlug, lessonSlug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const lesson = useMemo(() => {
        if (!course?.lessons) return null;
        return (
            course.lessons.find(l => l.slug === lessonSlug) ||
            course.lessons.find(l => String(l.id) === String(lessonSlug)) ||
            course.lessons[0]
        );
    }, [course, lessonSlug]);

    const youtubeId = toYoutubeId(lesson?.video_data || "");

    if (loading) {
        return (
            <div className="module-layout">
                <section className="module-main">
                    <div className="video-box"><div className="player-16x9 skeleton" /></div>
                    <div className="lesson-info">
                        <h2 className="pill-title">Завантаження…</h2>
                    </div>
                </section>
            </div>
        );
    }
    if (error) return <div className="module-layout"><div className="error-block">{error}</div></div>;
    if (!course || !lesson) return null;

    return (
        <div className="module-layout">
            <section className="module-main">
                <button className="back-btn" aria-label="Назад" onClick={() => window.history.back()}>
                    <svg viewBox="0 0 24 24"><path d="M15.5 19.5L7 12l8.5-7.5" /></svg>
                </button>

                <div className="video-box">
                    <div className="player-16x9">
                        {youtubeId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        ) : (
                            <div className="no-video">Відео відсутнє</div>
                        )}
                    </div>
                </div>

                <div className="lesson-info">
                    <h2 className="pill-title">{lesson.title}</h2>
                    {lesson.content && <p className="lesson-desc">{lesson.content}</p>}
                </div>
            </section>

            <aside className="lesson-aside">
                <h3 className="lesson-aside__title">Відео</h3>
                {lesson.content && <p className="lesson-desc">{lesson.content}</p>}
                <div className="underline" />
                <Link
                    className="lesson-link"
                    to={`/courses/${categorySlug}/${courseSlug}/lessons/${lesson.slug}/notes`}
                >
                    Конспект
                </Link>
                <div className="underline" />
            </aside>
        </div>
    );
}
