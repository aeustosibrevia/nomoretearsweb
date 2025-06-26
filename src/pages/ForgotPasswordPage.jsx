import { useNavigate } from 'react-router-dom';
import '../styles/forgotStyle.css';
import logo from '../assets/logo.png';


const ForgotPasswordPage = () => {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/success');
    }

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <img src={logo} alt="Logo" className="logo"/>
                <h2>Забули пароль?</h2>
                <form className="forgot-form" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" required/>
                    <p>Вкажіть вашу пошту, ми надішлемо листа з тимчасовим паролем</p>
                    <button type="submit" className="forgot-btn">Відправити</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
