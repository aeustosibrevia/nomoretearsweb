import { Link } from 'react-router-dom';
import '../styles/loginStyle.css';
import logo from '../assets/logo.png';


const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>З поверненням</h2>
        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Пароль" required />
          <div className="forgot-link">
            <Link to="/forgot-password">Забули пароль?</Link>
          </div>
          <button type="submit" className="login-btn">Увійти</button>
          <button type="button" className="google-btn">Увійти через Google</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
