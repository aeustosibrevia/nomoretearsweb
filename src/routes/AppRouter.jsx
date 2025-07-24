import {Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import RegistrationPage from "../pages/RegistrationPage";
import AccountPage from "../pages/AccountPage";
import MainPage from "../pages/MainPage";
import AdminPage from "../pages/AdminPage";
import CreateCategoryPage from "../pages/CreateCategoryPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/registration" element={<RegistrationPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/account" element={<AccountPage/>}/>
            <Route path="/admin/courses" element={<AdminPage/>}/>
            <Route path="/admin/create-category" element={<CreateCategoryPage/>}/>
            <Route path="/" element={<MainPage/>}/>
        </Routes>
    );
};

export default AppRouter;
