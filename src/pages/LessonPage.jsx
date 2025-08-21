import { Link, useParams } from "react-router-dom";
import { modules } from "../data/courses";
import '../styles/ModuleStyle.css';

export default function LessonPage() {
    const { moduleId, lessonId } = useParams();
    const mod = modules.find(m => m.id === moduleId) || modules[0];
    const lesson = mod.lessons.find(l => l.id === lessonId) || mod.lessons[0];

    return (
        <div className="module-layout">
            <section className="module-main">
                <button className="back-btn" aria-label="Назад" onClick={() => window.history.back()}>
                    <svg viewBox="0 0 24 24"><path d="M15.5 19.5L7 12l8.5-7.5" /></svg>
                </button>
                <div className="video-box">
                    <div className="player-16x9">
                        <iframe
                            src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>


                <div className="lesson-info">
                    <h2 className="pill-title">{lesson.title}</h2>
                    <p className="lesson-desc">{lesson.desc}</p>
                </div>
            </section>

            <aside className="lesson-aside">
                <h3 className="lesson-aside__title">Відео</h3>
                <p className="lesson-desc">{lesson.desc}</p>
                <div className="underline" />
                <Link className="lesson-link" to={lesson.notesUrl}>Конспект</Link>
                <div className="underline" />
            </aside>
        </div>
    );
}
