import {Link, useNavigate} from "react-router-dom";
import {useState} from 'react';
import '../styles/registrationStyle.css';
import logo from '../assets/logo.png';
import {register} from '../services/api';

const RegistrationPage = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await register(formData);
            setSuccess(result.message);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="registration-page">
            <div className="registration-container">
                <div className="registration-content">
                    <img src={logo} alt="Logo" className="logo"/>
                    <div className="registration-box">
                        <h2>Реєстрація</h2>
                        <form className="registration-form" onSubmit={handleSubmit}>
                            <input name="username" type="text" placeholder="Ім'я користувача" value={formData.username}
                                   onChange={handleChange} required/>
                            <input name="email" type="email" placeholder="Email" value={formData.email}
                                   onChange={handleChange} required/>
                            <input name="password" type="password" placeholder="Пароль" value={formData.password}
                                   onChange={handleChange} required/>
                            <button type="submit" className="registration-btn">Зареєструватись</button>
                            <button type="button" className="google-btn">Зареєструватись через Google</button>
                            <div className="log-link">
                                <Link to="/login">Вже є аккаунт? Вхід</Link>
                            </div>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            {success && <p style={{color: 'green'}}>{success}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegistrationPage;