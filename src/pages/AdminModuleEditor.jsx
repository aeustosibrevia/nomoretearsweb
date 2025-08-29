import { useParams, Link } from "react-router-dom";
import { modules } from "../data/courses";
import '../styles/admin-module.css';

export default function AdminModuleEditor() {
    const { moduleId } = useParams();
    const mod = modules.find(m => m.id === moduleId) || modules[0];

    return (
        <div className="admin-module">
            <h2 className="admin-title">Деталі курсу</h2>

            <div className="admin-grid">
                <aside className="admin-left">
                    <img
                        className="cover-img"
                        src={mod.coverUrl}
                        alt={mod.title}
                        onError={(e)=>{e.currentTarget.style.display='none'}}
                    />
                    {!mod.coverUrl && <div className="cover-placeholder">фото</div>}
                    <button className="link-like">Змінити</button>
                </aside>

                <section className="admin-main">
                    <div className="block gray">
                        <div className="block-header">
                            <span className="block-title">Опис</span>
                            <button className="link-like">Змінити</button>
                        </div>
                        <div className="block-body">{mod.desc || "—"}</div>
                    </div>

                    <div className="block gray">
                        <div className="block-header">
                            <span className="block-title">План</span>
                            <button className="link-like">Змінити</button>
                        </div>
                        <div className="block-body">
                            {mod.plan?.length ? (
                                <ol className="plan-list">
                                    {mod.plan.map((p, i)=> <li key={i}>{p}</li>)}
                                </ol>
                            ) : "—"}
                        </div>
                    </div>
                </section>
            </div>

            <section className="lessons-section">
                <div className="lessons-col">
                    <div className="lessons-col-title">Уроки <button className="add-btn" >+</button></div>

                    <div className="lesson-tiles">
                        {mod.lessons.map((l) => (
                            <article key={l.id} className="lesson-tile">
                                <header className="lesson-tile-head">
                                    <span className="lesson-name">{l.title}</span>
                                </header>
                                <div className="tile-meta">YouTube: {l.youtubeId || "—"}</div>
                                <div className="tile-meta">Опис:—</div>

                                <div className="tile-meta">Конспект: {l.notesUrl ? "є" : "—"}</div>
                                <div className="tile-actions">
                                    <button className="tile-btn">Змінити відео</button>
                                    <button className="tile-btn">Змінити Опис</button>

                                    <button className="tile-btn">Змінити конспект</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}