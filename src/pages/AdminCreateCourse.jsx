import React, { useState } from "react";
import "../styles/AdminCreateCourse.css";
import { fileToBase64, createCourse } from "../services/api";

const CATEGORY_MAP = [
    { id: 1, label: "Математика" },
    { id: 2, label: "Українська мова" },
    { id: 3, label: "Історія" },
];

export default function AdminCreateCourse() {
    const [categoryId, setCategoryId] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [courseId, setCourseId] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);


    async function handleCreateCourse(e) {
        e.preventDefault();
        setError(null);
        setStatus(null);

        if (!title || !description || !price || !imageFile)
            return setError("Заповніть усі поля");

        try {
            const img_data = await fileToBase64(imageFile);
            const data = {
                title,
                description,
                price: parseFloat(price),
                img_data,
                category_id: categoryId,
            };
            const res = await createCourse(data);
            setCourseId(res.courseId);
            setStatus("Курс успішно створено");
            setTimeout(() => {
                window.location.href = "/admin/courses";
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>Деталі курсу</h1>

                {(status || error) && (
                    <div className="cardz">
                        {status && <div style={{ color: "green" }}>{status}</div>}
                        {error && <div style={{ color: "red" }}>{error}</div>}
                    </div>
                )}

                <div className="cardz">
                    <form className="form-grid" onSubmit={handleCreateCourse}>
                        <div className="form-grid-2">
                            <label className="form-label">
                                <span>Категорія</span>
                                <select
                                    className="form-select"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                >
                                    {CATEGORY_MAP.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-label">
                                <span>Ціна (наприклад 149.00)</span>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="149.00"
                                />
                            </label>
                        </div>

                        <label className="form-label">
                            <span>Назва курсу</span>
                            <input
                                className="form-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Основи історії України"
                            />
                        </label>

                        <label className="form-label">
                            <span>Опис</span>
                            <textarea
                                className="form-textarea"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Повний модуль з історії..."
                            />
                        </label>

                        <label className="form-label">
                            <span>Зображення курсу</span>
                            <input
                                type="file"
                                className="form-input"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </label>

                        <button type="submit" className="form-button">
                            Створити курс
                        </button>
                    </form>
                </div>


            </div>
        </div>
    );
}
