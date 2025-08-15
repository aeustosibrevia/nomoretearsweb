import '../styles/App.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainShopStyle.css';

import historyphoto from '../assets/historyphoto.png';
import mathphoto from '../assets/mathphoto.png';
import ukrphoto from '../assets/ukrphoto.png';


const MainShopPage = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, '', '/');
        }
    }, []);
    return (

        <div className="courses-container">
            <h1 className="courses-title">МАГАЗИН КУРСІВ</h1>

            <div className="cards">

                <Link to="/HistoryCourses">

                <div className="card-wrap">
                    <div className="card card--history">
                        <img className="card__photo" src={historyphoto} alt="history" />
                    </div>
                    <span className="card__label card__label--history">ІСТОРІЯ УКРАЇНИ</span>
                </div>
                </Link>


                <Link to="/MathCourses">
                <div className="card-wrap" >
                    <div className="card card--math">
                        <img className="card__photo" src={mathphoto} alt="math" />
                    </div>

                        <span className="card__label card__label--math">МАТЕМАТИКА</span>
                </div>
                </Link>

                <Link to="/UkrainianCourses">
                <div className="card-wrap" >
                    <div className="card card--ukr">
                        <img className="card__photo" src={ukrphoto} alt="ukr" />
                    </div>
                    <span className="card__label card__label--ukr">УКРАЇНСЬКА МОВА</span>
                </div>
                </Link>
            </div>

        </div>
    );
};

export default MainShopPage;