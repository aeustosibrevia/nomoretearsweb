import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import phoneLogo from '../assets/phone_logo.png';
import telegramLogo from '../assets/telegram_logo.png';
import instagramLogo from '../assets/instagram_logo.png';
import tiktokLogo from '../assets/tiktok_logo.png';
import { getProfile, updateProfileEmail, changePassword } from '../services/api';



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
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [savingEmail, setSavingEmail] = useState(false);
    const [msgEmail, setMsgEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const me = await getProfile();
                if (me?.username) setUsername(me.username);
                if (me?.email) setEmail(me.email);
            } catch (e) {
            }
        })();
    }, []);

    const handleSaveEmail = async () => {
        setMsgEmail('');
        if (!email?.trim()) {
            setMsgEmail('Введіть email');
            return;
        }
        try {
            setSavingEmail(true);
            const res = await updateProfileEmail(email.trim());
            setMsgEmail(res.message || 'Пошта оновлена');
        } catch (e) {
            setMsgEmail(e.message || 'Помилка оновлення пошти');
        } finally {
            setSavingEmail(false);
        }
    };

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
                    <label className="with-edit">
                        Ім’я користувача
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder=" "
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <span className="edit-link" onClick={() => {/* TODO: save username */}}>
                                змінити
                            </span>
                        </div>
                    </label>

                    <label className="with-edit">
                        Дата народження
                        <div className="input-wrapper">
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                            <span className="edit-link" onClick={() => {/* TODO: save birthDate */}}>
                                змінити
                            </span>
                        </div>
                    </label>

                    <label className="with-edit">
                        Номер телефону
                        <div className="input-wrapper">
                            <input
                                type="tel"
                                placeholder=" "
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <span className="edit-link" onClick={() => {/* TODO: save phone */}}>
                                змінити
                            </span>
                        </div>
                    </label>

                    <label className="with-edit">
                        Пошта
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="edit-link" onClick={() => {}}>
                                змінити
                            </span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

const PasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [savingPwd, setSavingPwd] = useState(false);
    const [msgPwd, setMsgPwd] = useState('');

    const handleChangePwd = async () => {
        setMsgPwd('');
        if (!currentPassword || !newPassword) {
            setMsgPwd('Заповніть обидва поля');
            return;
        }
        try {
            setSavingPwd(true);
            const res = await changePassword({ currentPassword, newPassword });
            setMsgPwd(res.message || 'Пароль змінено');
            setCurrentPassword('');
            setNewPassword('');
        } catch (e) {
            setMsgPwd(e.message || 'Помилка зміни пароля');
        } finally {
            setSavingPwd(false);
        }
    };

    return (
        <div className="password-form-container">
            <h2 className="password-title">Зміна пароля</h2>
            <div className="password-content">
                <div className="password-fields">
                    <label className="with-edit">
                        Старий пароль
                        <div className="input-wrapper">
                            <input
                                type="password"
                                placeholder=" "
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                    </label>

                    <label className="with-edit">
                        Новий пароль
                        <div className="input-wrapper">
                            <input
                                type="password"
                                placeholder=" "
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span className="edit-link" onClick={savingPwd ? undefined : handleChangePwd}>
                                {savingPwd ? '...' : 'змінити'}
                            </span>
                        </div>
                        {msgPwd && <div className="field-msg">{msgPwd}</div>}
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
