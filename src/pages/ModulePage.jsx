import { Link, useParams } from "react-router-dom";
import { modules } from "../data/courses";
import '../styles/ModuleStyle.css';


export default function ModulePage() {
    const { moduleId } = useParams();
    const mod = modules.find(m => m.id === moduleId) || modules[0];
    const first = mod.lessons[0];

    return (
        <div className="module-layout">
            <section className="module-main">
                <button className="back-btn" aria-label="Назад" onClick={() => window.history.back()}>
                    <svg viewBox="0 0 24 24"><path d="M15.5 19.5L7 12l8.5-7.5" /></svg>
                </button>
                <div className="video-box">
                    <div className="player-16x9">
                        <iframe
                            src={`https://www.youtube.com/embed/${first.youtubeId}?rel=0&modestbranding=1`}
                            title={first.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="lesson-info">
                    <h2 className="pill-title">{first.title}</h2>
                    <p className="lesson-desc">{first.desc}</p>
                </div>
            </section>

            <aside className="module-aside">
                <div className="aside-head">
                    <button className="arrow-btn" aria-label="Попередній модуль">‹</button>
                    <h3 className="aside-title">{mod.title}</h3>
                    <button className="arrow-btn" aria-label="Наступний модуль">›</button>
                </div>

                <ul className="lesson-list">
                    {mod.lessons.map((lsn, i) => (
                        <li key={lsn.id}>
                            <Link
                                to={`/modules/${mod.id}/lessons/${lsn.id}`}
                                className={`lesson-item ${i === 0 ? "is-active" : ""}`}
                            >
                                <span className="lesson-item__title">{lsn.title}</span>
                                <span className="lesson-item__desc">{lsn.desc}</span>
                            </Link>
                            <div className="lesson-divider" />
                        </li>
                    ))}

                    <li>
                        <Link to={`/modules/${mod.id}/notes`} className="lesson-extra__link">
                            Конспект
                        </Link>
                        <div className="lesson-divider" />
                    </li>
                    <li>
                        <Link to={`/modules/${mod.id}/test`} className="lesson-extra__link">
                            Тест
                        </Link>
                        <div className="lesson-divider" />
                    </li>
                </ul>



                <div className="aside-actions">
                    <button className="mark-btn">Позначити як виконане</button>
                    <button className="link-btn">Залишити відгук</button>
                </div>
            </aside>
        </div>
    );
}