import '../styles/CourseDetail.css';

const CourseDetailPage = () => {
    return (
        <div className="course-detail">
            <aside className="course-left">
                <div className="course-cover" aria-label="Обкладинка курсу"></div>

                <section className="syllabus">
                    <span className="syllabus-badge">План</span>
                    <ol className="syllabus-list">
                        <li>План</li>
                        <li>План</li>
                        <li>План</li>
                        <li>План</li>
                        <li>План</li>
                        <li>План </li>
                    </ol>
                </section>
            </aside>

            <main className="course-right">
                <h1 className="course-title">Назва курсу</h1>

                <p className="course-desc">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat et sapiente dolor possimus illum culpa provident iure atque, ex ut laboriosam cumque repellendus voluptate iste aliquam omnis? Voluptatibus, dolorem tempora.
                </p>

                <button className="buy-btn">КУПИТИ</button>
            </main>
        </div>
    );
};

export default CourseDetailPage;

