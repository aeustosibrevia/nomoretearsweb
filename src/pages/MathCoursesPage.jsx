import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Courses.css';


const MathCoursesPage = () => {

    return (
            <div className="course-page">
                <header className="course-header">
                    <button className="back-btn" aria-label="Назад" onClick={() => window.history.back()}>
                        <svg viewBox="0 0 24 24"><path d="M15.5 19.5L7 12l8.5-7.5" /></svg>
                    </button>

                    <h1>Математика</h1>

                    <div className="search">
                        <input type="search" placeholder="Пошук курсу" />
                    </div>
                </header>

                <section className="course-hero">
                    <div className="course-info">
                        <h2>Назва</h2>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                            Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis?
                            Voluptatibus, dolorem tempora.
                        </p>
                    </div>
                </section>

                <main className="params-grid">
                    <Link className="param-card theme-math" to="/CourseDetailPage">
                        <span>ПАРАМЕТР</span>
                    </Link>
                    <button className="param-card theme-math"></button>
                    <button className="param-card theme-math"></button>
                    <button className="param-card theme-math"></button>
                    <button className="param-card theme-math"></button>
                    <button className="param-card theme-math"></button>

                </main>
            </div>
    );
}
export default MathCoursesPage;
