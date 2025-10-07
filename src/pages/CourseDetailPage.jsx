import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCourseBySlugs, enrollInCourse, getProfile } from '../services/api'; // <— добавили getProfile
import '../styles/CourseDetail.css';

function extractImageUrl(img_data) { /* без изменений */ }

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
    const [username, setUsername] = useState(''); // <— добавили

    // грузим курс
    useEffect(() => {
        let cancelled = false;
        setLoading(true); setError('');
        getCourseBySlugs(categorySlug, courseSlug)
            .then(c => { if (!cancelled) setCourse(c); })
            .catch(e => { if (!cancelled) setError(e.message || 'Помилка завантаження'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [categorySlug, courseSlug]);

    useEffect(() => {
        let cancelled = false;
        const token = localStorage.getItem('token');
        if (!token) return; // не авторизован — username не нужен до клика
        getProfile()
            .then(p => { if (!cancelled) setUsername(p?.username || ''); })
            .catch(() => {}); // молча
        return () => { cancelled = true; };
    }, []);

    const handleEnroll = async () => {
        if (!course?.id || enrolling || enrolled) return;

        const token = localStorage.getItem('token');
        if (!token) {
            const from = encodeURIComponent(loc.pathname + loc.search);
            return navigate(`/login?from=${from}`);
        }
        let u = username;
        if (!u) {
            try {
                const p = await getProfile();
                u = p?.username || '';
                setUsername(u);
            } catch {}
        }
        if (!u) {
            return setError('Не вдалось визначити імʼя користувача. Спробуйте ще раз.');
        }

        setEnrolling(true); setNotice(''); setError('');
        try {
            const res = await enrollInCourse(u, course.id); // <— передаём username
            setEnrolled(true);
            setNotice(res?.message || 'Успішна реєстрація на курс.');
        } catch (e) {
            setError(e.message || 'Не вдалося записатись');
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
