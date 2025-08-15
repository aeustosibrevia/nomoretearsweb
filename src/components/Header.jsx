import {Link} from "react-router-dom";
import logo from '../assets/logo.png';
import '../styles/headerStyle.css';
import {useEffect, useState} from 'react';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Invalid user in localStorage');
            }
        }
    }, []);

    return (
        <header className='Header'>
            <div className="left-block">
                <img src={logo} alt='Logo' className='logo'/>
                <nav>
                    {user?.role === 'admin' ? (
                        <>
                            <Link to="/admin/courses">Панель</Link>
                            <Link to="/admin/users">Користувачі</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/courses">Мої курси</Link>
                            <Link to="/shop">Магазин</Link>
                        </>
                    )}
                </nav>
            </div>
            <div className='myAccount'>
                <Link to='/account'>
                    {user ? user.username : 'Мій аккаунт'} <span role="img"></span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
