import { useState } from 'react';
import logo from '../assets/logo.png';
import '../styles/accountStyle.css';

const AccountPage = () => {
    const [selectedTab, setSelectedTab] = useState('info');

    const renderContent = () => {
        switch (selectedTab) {
            case 'info':
                return <p>інформація користувача</p>;
            case 'contacts':
                return <p>Контактні дані</p>;
            case 'password':
                return <p>Форма зміни паролю</p>;
            case 'faq':
                return (
                    <ul className="faq-list">
                        <li>Чи можна проходити курс лише з одного предмета?</li>
                        <li>У якому форматі проходить навчання на платформі?</li>
                        <li>Чи підходить курс тим, хто починає з нуля?</li>
                        <li>Який рівень знань потрібен, щоб почати навчання?</li>
                        <li>Чи надаються знижки або акційні пропозиції?</li>
                    </ul>
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
