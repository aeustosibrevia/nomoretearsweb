import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {fetchCategories} from "../services/api";
import '../styles/AdminPageStyles.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const data = {
        math: [
            { id: "math-mod-1", title: "Назва курсу ", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora." },
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

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);
    const [tab, setTab] = useState("math");
    const items = data[tab];

    return (
        <div className={`list-page theme-${tab}`}>
            <div className="tabs-row">
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

                <button className="add-btn" onClick={() => navigate("/admin/add-course")}>+</button>
            </div>

            <div className="course-cards">
                {items.map((c) => (
                    <Link key={c.id} to={`/admin/modules/${c.id}`} className="course-card-link">
                        <article className="course-card">
                            <div className="course-card__media" />
                            <div className="course-card__body">
                                <div className="course-card__head">
                                    <h3 className="course-card__title">{c.title}</h3>
                                    <span className="course-card__more">***</span>
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
};

export default AdminPage;
