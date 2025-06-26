import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import '../styles/headerStyle.css';

const Header = () => {
    return (
        <header className='Header'>
            <img src={logo} alt='Logo' className='logo' />
            <nav>
                <Link to='/'>Мої курси</Link>
                <Link to='/shop'>Магазин</Link>
            </nav>
            <div className='myAccount'>
                Мій аккаунт <span role="img" aria-label="user">👤</span>
            </div>
        </header>
    )
}

export default Header