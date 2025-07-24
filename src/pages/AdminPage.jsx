import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {fetchCategories} from "../services/api";
import '../styles/AdminPageStyles.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div>
            <button
                onClick={() => navigate('/admin/create-category')}
                aria-label="Додати категорію"
                title="Додати категорію"
                className="add-category-button"
            >
                +
            </button>

            <h2>Категорії:</h2>
            {loading ? (
                <p>Завантаження...</p>
            ) : error ? (
                <p style={{color: 'red'}}>{error}</p>
            ) : (
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminPage;
