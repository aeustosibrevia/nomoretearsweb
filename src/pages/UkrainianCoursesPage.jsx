// pages/UkrainianCoursesPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCoursesByCategorySlug } from '../services/api';
import '../styles/BuyCourses.css';

function extractImageUrl(img_data) {
    if (!img_data) return null;
    if (typeof img_data === 'string') return img_data;
    if (Array.isArray(img_data?.data)) {
        try {
            const text = new TextDecoder().decode(new Uint8Array(img_data.data));
            if (/^https?:\/\//i.test(text)) return text;
            const blob = new Blob([new Uint8Array(img_data.data)], { type: 'image/png' });
            return URL.createObjectURL(blob);
        } catch { return null; }
    }
    return null;
}

export default function UkrainianCoursesPage() {
    const slug = 'ukrainska';
    const themeClass = 'theme-ukr';
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        getCoursesByCategorySlug(slug)
            .then((cat) => { if (!cancelled) setCategory(cat); })
            .catch((e) => { if (!cancelled) setError(e.message || 'Помилка завантаження'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="course-page">
            <header className="course-header">
                <button className="back-btn" aria-label="Назад" onClick={() => window.history.back()}>
                    <svg viewBox="0 0 24 24"><path d="M15.5 19.5L7 12l8.5-7.5" /></svg>
                </button>

                <h1>{category?.name || 'Українська мова'}</h1>

                <div className="search">
                    <input type="search" placeholder="Пошук курсу" />
                </div>
            </header>

            <section className="course-hero">
                <div className="course-info">
                    <h2>Курси категорії</h2>
                    <p>Оберіть курс, щоб переглянути деталі.</p>
                </div>
            </section>

            <main className="params-grid">
                {loading && <div className="muted">Завантаження…</div>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && (category?.courses?.length ? (
                    category.courses.map((c) => {
                        const imgUrl = extractImageUrl(c.img_data);
                        return (
                            <Link
                                key={c.id}
                                className={`param-card ${themeClass}`}
                                to={`/CourseDetailPage/ukrayinska-mova/${c.slug}`}
                                style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}
                            >
                                <span>{c.title}</span>
                            </Link>
                        );
                    })
                ) : (
                    <div className="muted">Курсів поки немає.</div>
                ))}
            </main>
        </div>
    );
}
