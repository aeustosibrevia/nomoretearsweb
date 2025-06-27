import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forgotStyle.css';
import logo from '../assets/logo.png';

const ForgotPasswordPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="forgot-container">
            <div className="forgot-content">
                <img src={logo} alt="Logo" className="logo" />
                <div className="forgot-box">
                    {!submitted ? (
                        <>
                            <h2>Забули пароль?</h2>
                            <form className="forgot-form" onSubmit={handleSubmit}>
                                <input type="email" placeholder="Email" required />
                                <p>Вкажіть вашу пошту, ми надішлемо листа з тимчасовим паролем</p>
                                <button type="submit" className="send-btn">Надіслати</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Лист відправлено!</h2>
                            <p>Перевірте пошту — ми надіслали тимчасовий пароль.</p>
                            <Link to="/login">
                                <button className="send-btn">Повернутись до входу</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
