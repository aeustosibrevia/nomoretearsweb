import '../styles/App.css';
import { useEffect } from 'react';

const MainPage = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, '', '/');
        }
    }, []);

    return <h1>Скебоб</h1>;
};

export default MainPage;