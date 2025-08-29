import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "../styles/headerStyle.css";

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const readUser = () => {
        const storedUser = localStorage.getItem("user");
        try {
            setUser(storedUser ? JSON.parse(storedUser) : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        readUser();
        const onStorage = (e) => {
            if (e.key === "user" || e.key === "token") readUser();
        };
        const onAuthChanged = () => readUser();
        window.addEventListener("storage", onStorage);
        window.addEventListener("auth-changed", onAuthChanged);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("auth-changed", onAuthChanged);
        };
    }, []);

    const token = localStorage.getItem("token");
    const isAuthed = !!token && !!user;


    return (
        <header className="Header">
            <div className="left-block">
                <img src={logo} alt="Logo" className="logo" />
                <nav>
                    <Link to="/courses">Мої курси</Link>
                    <Link to="/shop">Магазин</Link>

                    {user?.role === "admin" && (
                        <>
                            <Link to="/admin/courses">Панель курсів</Link>
                            <Link to="/admin/users">Користувачі</Link>
                            <Link to="/admin/comments">Відгуки</Link>
                        </>
                    )}
                </nav>
            </div>

            <div className="myAccount">
                {isAuthed ? (
                    <>
                        <Link to="/account" className="link-btn">Мій акаунт</Link>
                        <Link
                            to="/login"
                            className="link-btn"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.dispatchEvent(new Event('auth-changed'));
                            }}
                        >
                            Вийти
                        </Link>
                    </>
                ) : (
                    <Link to="/registration" className="link-btn">Увійти</Link>
                )}
            </div>

        </header>
    );
};

export default Header;
