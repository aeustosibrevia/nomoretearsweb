import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import phoneLogo from '../assets/phone_logo.png';
import telegramLogo from '../assets/telegram_logo.png';
import instagramLogo from '../assets/instagram_logo.png';
import tiktokLogo from '../assets/tiktok_logo.png';
import { getProfile, updateProfile, changePassword } from '../services/api';



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

const toYMD = (val) => {
    if (!val) return '';
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const InfoForm = () => {
    const [profile, setProfile] = useState(null);
    const [savingKey, setSavingKey] = useState(null);
    const [msgs, setMsgs] = useState({});

    const refresh = async () => {
        const me = await getProfile();
        setProfile(me || {});
    };

    useEffect(() => {
        refresh().catch(() => {});
    }, []);

    const save = async (payload, key) => {
        setMsgs((m) => ({ ...m, [key]: '' }));
        try {
            setSavingKey(key);
            const res = await updateProfile(payload);
            setMsgs((m) => ({ ...m, [key]: res?.message || 'Збережено' }));
            await refresh();
        } catch (e) {
            setMsgs((m) => ({ ...m, [key]: e?.message || 'Помилка збереження' }));
        } finally {
            setSavingKey(null);
        }
    };

    const isSaving = (k) => savingKey === k;

    if (!profile) return null;

    return (
        <div className="info-form-container">
            <h2 className="info-title">Основна інформація</h2>

            <div className="info-content">
                {/* Фото */}
                <div className="info-photo">
                    <div className="photo-placeholder">
                        {profile.profile_picture ? (
                            <img src={profile.profile_picture} alt="profile" />
                        ) : (
                            <i className="icon-user" />
                        )}
                    </div>
                    <button
                        className="change-photo"
                        onClick={
                            isSaving('profile_picture')
                                ? undefined
                                : async () => {
                                    const url = prompt('Вставте URL фото:', profile.profile_picture || '');
                                    if (url != null) await save({ profile_picture: url.trim() }, 'profile_picture');
                                }
                        }
                    >
                        {isSaving('profile_picture') ? '...' : 'Змінити фото'}
                    </button>
                    {msgs.profile_picture && <div className="field-msg">{msgs.profile_picture}</div>}
                </div>

                <div className="info-fields">
                    <label className="with-edit">
                        Ім’я користувача
                        <div className="input-wrapper">
                            <input type="text" value={profile.username || ''} readOnly />
                            <span className="edit-link edit-link--disabled">змінити</span>
                        </div>
                    </label>

                    <label className="with-edit">
                        Ім'я
                        <div className="input-wrapper">
                            <input type="text" value={profile.first_name || ''} readOnly placeholder="Ім'я" />
                            <span
                                className="edit-link"
                                onClick={
                                    isSaving('first_name')
                                        ? undefined
                                        : async () => {
                                            const v = prompt("Введіть ім'я", profile.first_name || '');
                                            if (v != null) await save({ first_name: v.trim() }, 'first_name');
                                        }
                                }
                            >
                {isSaving('first_name') ? '...' : 'змінити'}
              </span>
                        </div>
                        {msgs.first_name && <div className="field-msg">{msgs.first_name}</div>}
                    </label>

                    <label className="with-edit">
                        Прізвище
                        <div className="input-wrapper">
                            <input type="text" value={profile.last_name || ''} readOnly placeholder="Прізвище" />
                            <span
                                className="edit-link"
                                onClick={
                                    isSaving('last_name')
                                        ? undefined
                                        : async () => {
                                            const v = prompt('Введіть прізвище', profile.last_name || '');
                                            if (v != null) await save({ last_name: v.trim() }, 'last_name');
                                        }
                                }
                            >
                {isSaving('last_name') ? '...' : 'змінити'}
              </span>
                        </div>
                        {msgs.last_name && <div className="field-msg">{msgs.last_name}</div>}
                    </label>

                    <label className="with-edit">
                        Дата народження
                        <div className="input-wrapper">
                            <input type="date" value={toYMD(profile.birthday)} readOnly />
                            <span
                                className="edit-link"
                                onClick={
                                    isSaving('birthday')
                                        ? undefined
                                        : async () => {
                                            const v = prompt('YYYY-MM-DD', toYMD(profile.birthday));
                                            if (v != null) await save({ birthday: v }, 'birthday');
                                        }
                                }
                            >
                {isSaving('birthday') ? '...' : 'змінити'}
              </span>
                        </div>
                        {msgs.birthday && <div className="field-msg">{msgs.birthday}</div>}
                    </label>

                    <label className="with-edit">
                        Номер телефону
                        <div className="input-wrapper">
                            <input type="tel" value={profile.phone_number || ''} readOnly placeholder="+380..." />
                            <span
                                className="edit-link"
                                onClick={
                                    isSaving('phone_number')
                                        ? undefined
                                        : async () => {
                                            const v = prompt('Введіть номер телефону', profile.phone_number || '');
                                            if (v != null) await save({ phone_number: v.trim() }, 'phone_number');
                                        }
                                }
                            >
                {isSaving('phone_number') ? '...' : 'змінити'}
              </span>
                        </div>
                        {msgs.phone_number && <div className="field-msg">{msgs.phone_number}</div>}
                    </label>

                    <label className="with-edit">
                        Пошта
                        <div className="input-wrapper">
                            <input type="email" value={profile.email || ''} readOnly />
                            <span
                                className="edit-link"
                                onClick={
                                    isSaving('email')
                                        ? undefined
                                        : async () => {
                                            const v = prompt('Введіть email', profile.email || '');
                                            if (v != null) await save({ email: v.trim() }, 'email');
                                        }
                                }
                            >
                {isSaving('email') ? '...' : 'змінити'}
              </span>
                        </div>
                        {msgs.email && <div className="field-msg">{msgs.email}</div>}
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
