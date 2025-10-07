
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { fetchCourseSlugs } from '../services/api';
import '../styles/AdminPageStyles.css';

const CATEGORY_META = {
    1: { slug: 'math',    label: 'Математика' },
    2: { slug: 'ukr',     label: 'Українська мова' },
    3: { slug: 'history', label: 'Історія' },
};

const AdminPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCatId, setActiveCatId] = useState(1); // за замовчуванням: Математика

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchCourseSlugs({ onlyPublished: false });
                setCourses(data);
            } catch (e) {
                setError(e.message || 'Помилка завантаження');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const coursesByCategory = useMemo(() => {
        const map = new Map();
        for (const c of courses) {
            if (!map.has(c.category_id)) map.set(c.category_id, []);
            map.get(c.category_id).push(c);
        }
        return map;
    }, [courses]);

    const items = coursesByCategory.get(activeCatId) || [];
    const themeSlug = CATEGORY_META[activeCatId]?.slug ?? 'default';

    if (loading) {
        return (
            <div className={`list-page theme-${themeSlug}`}>
                <div className="tabs-row">
                    <div className="tabs">
                        <button className={`tab tab--math is-active`} disabled>Математика</button>
                        <button className={`tab tab--ukr`} disabled>Українська мова</button>
                        <button className={`tab tab--history`} disabled>Історія</button>
                    </div>
                    <button className="add-btn" disabled>+</button>
                </div>
                <div className="course-cards">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="course-card skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="list-page"><p className="error">{error}</p></div>;

    return (
        <div className={`list-page theme-${themeSlug}`}>
            <div className="tabs-row">
                <div className="tabs">
                    {[1, 2, 3].map((id) => {
                        const meta = CATEGORY_META[id];
                        return (
                            <button
                                key={id}
                                className={`tab tab--${meta.slug} ${activeCatId === id ? 'is-active' : ''}`}
                                onClick={() => setActiveCatId(id)}
                            >
                                {meta.label}
                            </button>
                        );
                    })}
                </div>
                <button className="add-btn" onClick={() => navigate('/admin/create-course')}>+</button>
            </div>

    <div className="course-cards">
        {items.map((c) => (
            <Link key={c.slug} to={`/admin/courses/${c.slug}/edit`} className="course-card-link">
                <article className="course-card">
                    <div className="course-card__media" />
                    <div className="course-card__body">
                        <div className="course-card__head">
                            <h3 className="course-card__title">{c.title}</h3>
                            <span className="course-card__more">Редагувати ↗</span>
                        </div>
                        <p className="course-card__desc">{c.description || 'Без опису'}</p>
                        <div className="skeleton-pill" />
                    </div>
                </article>
            </Link>
        ))}
        {!items.length && <div className="empty">Курсів у цій категорії поки немає.</div>}
    </div>
</div>
);
};

export default AdminPage;
