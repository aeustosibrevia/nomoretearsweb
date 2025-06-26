import {Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/success" element={<div>Ми надіслали листа</div>}/>
        </Routes>
    );
};

export default AppRouter;
