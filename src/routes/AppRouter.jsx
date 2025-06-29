import {Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import RegistrationPage from "../pages/RegistrationPage";
import AccountPage from "../pages/AccountPage";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/registration" element={<RegistrationPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/account" element={<AccountPage/>}/>

        </Routes>
    );
};

export default AppRouter;
