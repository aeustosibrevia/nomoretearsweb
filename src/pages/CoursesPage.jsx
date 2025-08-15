import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Courses.css';

const data = {
    math: [
        { id: "m1", title: "Назва курсу ", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
        { id: "m2", title: "Назва курсу", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
    ],
    history: [
        { id: "h1", title: "Назва курсу", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
        { id: "h2", title: "Назва курсу", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
    ],
    ukr: [
        { id: "u1", title: "Назва курсу", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
        { id: "u2", title: "Назва курсу", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
    ],
};

const CoursesPage = () => {
    const [tab, setTab] = useState("math");
    const items = data[tab];

    return (
        <div className={`list-page theme-${tab}`}>
            <div className="tabs">
                <button
                    className={`tab tab--math ${tab === "math" ? "is-active" : ""}`}
                    onClick={() => setTab("math")}
                >
                    Математика
                </button>
                <button
                    className={`tab tab--history ${tab === "history" ? "is-active" : ""}`}
                    onClick={() => setTab("history")}
                >
                    Історія
                </button>
                <button
                    className={`tab tab--ukr ${tab === "ukr" ? "is-active" : ""}`}
                    onClick={() => setTab("ukr")}
                >
                    Українська мова
                </button>
            </div>

            <div className="course-cards">
                {items.map((c) => (
                    <Link key={c.id} to={`/courses/${c.id}`} className="course-card-link">
                        <article className="course-card">
                            <div className="course-card__media" />
                            <div className="course-card__body">
                                <div className="course-card__head">
                                    <h3 className="course-card__title">{c.title}</h3>
                                    <span className="course-card__more">детальніше</span>
                                </div>
                                <p className="course-card__desc">{c.desc}</p>
                                <div className="skeleton-pill" />
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

        </div>
    );
}
export default CoursesPage;
