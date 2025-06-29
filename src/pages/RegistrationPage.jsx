import {Link, useNavigate} from "react-router-dom";
import '../styles/registrationStyle.css';
import logo from '../assets/logo.png'

const RegistrationPage = () => {
    return (
        <div className="registration-page">
        <div className="registration-container">
            <div className="registration-content">
                <img src={logo} alt="Logo" className="logo" />
                <div className="registration-box">
                    <h2>Реєстрація</h2>
                    <form className="registration-form">
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Пароль" required />
                        <button type="submit" className="registration-btn">Зареєструватись</button>
                        <button type="button" className="google-btn">Зареєструватись через Google</button>
                        <div className="log-link">
                            <Link to="/login">Вже є аккаунт? Вхід</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}
export default RegistrationPage;