import {Link, useNavigate} from 'react-router-dom';
import '../styles/loginStyle.css';
import logo from '../assets/logo.png';
import {useState} from 'react';
import {login} from '../services/api';


const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('')
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
            const result = await login(formData);
            setSuccess(result.message);
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-content">
                    <img src={logo} alt="Logo" className="logo"/>
                    <div className="login-box">
                        <h2>З поверненням</h2>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <input name="email" type="email" placeholder="Email" value={formData.email}
                                   onChange={handleChange} required/>
                            <input name="password" type="password" placeholder="Пароль" value={formData.password}
                                   onChange={handleChange} required/>
                            <div className="forgot-link">
                                <Link to="/forgot-password">Забули пароль?</Link>
                            </div>
                            <button type="submit" className="login-btn">Увійти</button>
                            <button
                                type="button"
                                className="google-btn"
                                onClick={() => {
                                    window.location.href = 'http://localhost:3000/auth/google';
                                }}
                            >
                                Увійти через Google
                            </button>

                            <div className="reg-link">
                                <Link to="/registration">Немає аккаунту? Зареєструватись</Link>
                            </div>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            {success && <p style={{color: 'green'}}>{success}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default LoginPage;
