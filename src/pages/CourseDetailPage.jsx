import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCourseBySlugs, enrollInCourse } from '../services/api';
import '../styles/CourseDetail.css';

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

export default function CourseDetailPage() {
    const { categorySlug, courseSlug } = useParams();
    const navigate = useNavigate();
    const loc = useLocation();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true); setError('');
        getCourseBySlugs(categorySlug, courseSlug)
            .then(c => { if (!cancelled) setCourse(c); })
            .catch(e => { if (!cancelled) setError(e.message || 'Помилка завантаження'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [categorySlug, courseSlug]);

    const handleEnroll = async () => {
        if (!course?.id || enrolling || enrolled) return;

        const token = localStorage.getItem('token');
        if (!token) {
            const from = encodeURIComponent(loc.pathname + loc.search); // ← вместо location
            return navigate(`/login?from=${from}`);
        }
        setEnrolling(true); setNotice(''); setError('');
        try {
            const res = await enrollInCourse(course.id);


            setEnrolled(true);
            setNotice(res?.message || 'Успішна реєстрація на курс.');
        } catch (e) {
            const msg = e.message || 'Не вдалося записатись';
            setError(msg);
        } finally {
            setEnrolling(false);
        }
    };

    const coverUrl = extractImageUrl(course?.img_data);

    return (
        <div className="course-detail">
            <aside className="course-left">
                <div
                    className="course-cover"
                    aria-label="Обкладинка курсу"
                    style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
                />
                <section className="syllabus">
                    <span className="syllabus-badge">План</span>
                    {loading && <div className="muted">Завантаження…</div>}
                    {error && !course && <div className="error">{error}</div>}
                    {!loading && course && (
                        <ol className="syllabus-list">
                            {course.lessons?.length
                                ? course.lessons.map(l => <li key={l.id}>{l.title}</li>)
                                : <li className="muted">Поки немає уроків</li>}
                        </ol>
                    )}
                </section>
            </aside>

            <main className="course-right">
                <h1 className="course-title">{course?.title || (loading ? 'Завантаження…' : 'Курс')}</h1>

                <p className="course-desc">{course?.description || 'Опис курсу з’явиться тут.'}</p>

                {course?.price && <div className="course-price">Ціна: {course.price}</div>}

                <button
                    className="buy-btn"
                    onClick={handleEnroll}
                    disabled={enrolling || enrolled}
                    aria-busy={enrolling ? 'true' : 'false'}
                >
                    {enrolled ? 'ВЖЕ ЗАПИСАНО' : (enrolling ? 'ЗАПИС...' : 'КУПИТИ')}
                </button>

                {notice && <div className="notice success" style={{marginTop: 12}}>{notice}</div>}
                {error && course && <div className="notice error" style={{marginTop: 12}}>{error}</div>}
            </main>
        </div>
    );
}
