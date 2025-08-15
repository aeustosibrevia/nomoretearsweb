import { useState } from 'react';
import logo from '../assets/logo.png';
import phoneLogo from '../assets/phone_logo.png';
import telegramLogo from '../assets/telegram_logo.png';
import instagramLogo from '../assets/instagram_logo.png';
import tiktokLogo from '../assets/tiktok_logo.png';



import '../styles/accountStyle.css';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );
};

const InfoForm = () => {
    return (
        <div className="info-form-container">
            <h2 className="info-title">Основна інформація</h2>
            <div className="info-content">
                <div className="info-photo">
                    <div className="photo-placeholder">
                        <i className="icon-user" />
                    </div>
                    <button className="change-photo">Змінити фото</button>
                </div>

                <div className="info-fields">
                    <label>
                        Прізвище Ім’я
                        <input type="text" placeholder=" " />
                    </label>

                    <label>
                        Дата народження
                        <input type="date" />
                    </label>

                    <label className="with-edit">
                        Номер телефону
                        <span className="edit-link">змінити</span>
                        <input type="tel" placeholder=" " />
                    </label>

                    <label className="with-edit">
                        Пошта
                        <span className="edit-link">змінити</span>
                        <input type="email" placeholder=" " />
                    </label>
                </div>
            </div>
        </div>
    );
};


const PasswordForm = () => {
    return (
        <div className="password-form-container">
            <h2 className="password-title">Налаштування</h2>
            <div className="password-content">

                <div className="password-fields">
                    <label className="with-edit">
                        Ваш пароль
                        <div className="input-wrapper">
                            <span className="edit-link">змінити</span>
                            <input type="password" placeholder=" " />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};



const Contacts = () => {
    return (
        <div className="password-form-container">
            <h2 className="password-title">Контакти</h2>
            <div className="contact-block">
                <div className="contact-item">
                    <img className="contact-icon" src={phoneLogo} alt="phone" />
                    <div className="contact-text">
                        <span>+380 75 271 20 75</span>
                    </div>
                </div>

                <div className="contact-item">
                    <img className="contact-icon" src={telegramLogo} alt="telegram" />
                    <div className="contact-text">
                        <span>NoMoreTearsMath</span>
                        <span>NoMoreTearsHistory</span>
                        <span>NoMoreTearsUkrMova</span>
                    </div>
                </div>

                <div className="contact-item">
                    <img className="contact-icon" src={instagramLogo} alt="instagram" />
                    <div className="contact-text">
                        <span>nomoretears_school</span>
                    </div>
                </div>

                <div className="contact-item">
                    <img className="contact-icon" src={tiktokLogo} alt="tiktok" />
                    <div className="contact-text">
                        <span>nomoretears_math</span>
                        <span>nomoretears_ukr</span>
                        <span>nomoretears_history</span>
                    </div>
                </div>
            </div>

        </div>
    );
};


const AccountPage = () => {
    const [selectedTab, setSelectedTab] = useState('info');

    const renderContent = () => {
        switch (selectedTab) {
            case 'info':
                return <InfoForm/>;
            case 'contacts':
                return <Contacts/>;
            case 'password':
                return <PasswordForm/>;
            case 'faq':
                const faqData = [
                    {
                        question: 'Чи можна проходити курс лише з одного предмета?',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    },
                    {
                        question: 'У якому форматі проходить навчання на платформі?',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    },
                    {
                        question: 'Чи підходить курс тим, хто починає з нуля?',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    },
                    {
                        question: 'Який рівень знань потрібен, щоб почати навчання?',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    },
                    {
                        question: 'Чи надаються знижки або акційні пропозиції?',
                        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    },
                ];

                return (
                    <div className="faq-list">
                        {faqData.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="account-container">
            <aside className="sidebar">
                <img src={logo} alt="Logo" className="sidebar-logo" />
                <nav className="sidebar-nav">
                    <button
                        onClick={() => setSelectedTab('info')}
                        className={selectedTab === 'info' ? 'active' : ''}
                    >
                        | Основна інформація
                    </button>
                    <button
                        onClick={() => setSelectedTab('contacts')}
                        className={selectedTab === 'contacts' ? 'active' : ''}
                    >
                        | Контакти
                    </button>
                    <button
                        onClick={() => setSelectedTab('password')}
                        className={selectedTab === 'password' ? 'active' : ''}
                    >
                        | Пароль
                    </button>
                    <button
                        onClick={() => setSelectedTab('faq')}
                        className={selectedTab === 'faq' ? 'active' : ''}
                    >
                        | FAQ
                    </button>
                </nav>

            </aside>

            <main className="account-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default AccountPage;
