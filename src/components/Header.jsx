import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import '../styles/headerStyle.css';

const Header = () => {
    return (
        <header className='Header'>
            <div className="left-block">
            <img src={logo} alt='Logo' className='logo' />
            <nav>
                <Link to='/'>Мої курси</Link>
                <Link to='/shop'>Магазин</Link>
            </nav>
            </div>
            <div className='myAccount'>
                <Link to='/account'> Мій аккаунт <span role="img" aria-label="user">👤</span></Link>
            </div>
        </header>
    )
}

export default Header