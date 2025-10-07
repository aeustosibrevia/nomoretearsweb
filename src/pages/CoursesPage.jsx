import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Courses.css";
import { getMyEnrollments } from "../services/api";
import { getCourseBySlugs } from "../services/api";


const CATEGORY_ID_TO_SLUG = {
    1: "matematika",
    2: "ukrainska-mova",
    3: "istoriya",
};

const TAB_LABELS = {
    math: "Математика",
    history: "Історія",
    ukr: "Українська мова",
};
const CATEGORY_TO_TAB = { 1: "math", 2: "ukr", 3: "history" };

const CoursesPage = () => {
    const [tab, setTab] = useState("math");
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await getMyEnrollments(); // /api/enrollments/me
                setEnrollments(Array.isArray(data) ? data : []);
                setError("");
            } catch (e) {
                setError(e.message || "Помилка завантаження");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const grouped = useMemo(() => {
        const acc = { math: [], history: [], ukr: [] };
        for (const item of enrollments) {
            const c = item.course;
            if (!c) continue;
            const tabKey = CATEGORY_TO_TAB[c.category_id];
            if (!tabKey) continue;
            acc[tabKey].push({
                id: c.id,
                title: c.title,
                slug: c.slug,
                categoryId: c.category_id,
                description: c.description || "",        // <-- додали
                enrolled_at: item.enrolled_at,
            });
        }
        Object.values(acc).forEach(list =>
            list.sort((a, b) => new Date(b.enrolled_at) - new Date(a.enrolled_at))
        );
        return acc;
    }, [enrollments]);

    const items = grouped[tab] || [];

    return (
        <div className={`list-page theme-${tab}`}>
            <div className="tabs">
                <button className={`tab tab--math ${tab === "math" ? "is-active" : ""}`} onClick={() => setTab("math")}>{TAB_LABELS.math}</button>
                <button className={`tab tab--history ${tab === "history" ? "is-active" : ""}`} onClick={() => setTab("history")}>{TAB_LABELS.history}</button>
                <button className={`tab tab--ukr ${tab === "ukr" ? "is-active" : ""}`} onClick={() => setTab("ukr")}>{TAB_LABELS.ukr}</button>
            </div>

            {loading && <div className="course-cards"><article className="course-card is-skeleton"><div className="course-card__media"/><div className="course-card__body"><div className="skeleton-line"/><div className="skeleton-line"/><div className="skeleton-pill"/></div></article></div>}
            {!loading && error && <div className="error-block">{error}</div>}

            {!loading && !error && (
                <div className="course-cards">
                    {items.length === 0 ? (
                        <div className="empty-block">Немає курсів у категорії “{TAB_LABELS[tab]}”.</div>
                    ) : (
                        items.map((c) => {
                            const categorySlug = CATEGORY_ID_TO_SLUG[c.categoryId] || "unknown";
                            return (
                                <Link
                                    key={c.id}
                                    to={`/courses/${categorySlug}/${c.slug}`} // перехід на деталі курсу
                                    className="course-card-link"
                                >
                                    <article className="course-card">
                                        <div className="course-card__media" />
                                        <div className="course-card__body">
                                            <div className="course-card__head">
                                                <h3 className="course-card__title">{c.title}</h3>
                                                <span className="course-card__more">детальніше</span>
                                            </div>
                                            <p className="course-card__desc">
                                                {c.description || "Опис буде додано пізніше"}
                                            </p>
                                            <div className="skeleton-pill" />
                                        </div>
                                    </article>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
