import {Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import RegistrationPage from "../pages/RegistrationPage";
import AccountPage from "../pages/AccountPage";
import MainShopPage from "../pages/MainShopPage";
import AdminPage from "../pages/AdminPage";
import CreateCategoryPage from "../pages/CreateCategoryPage";
import MathCoursesPage from "../pages/MathCoursesPage";
import HistoryCoursesPage from "../pages/HistoryCoursesPage";
import UkrainianCoursesPage from "../pages/UkrainianCoursesPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import CoursesPage from "../pages/CoursesPage";
import ModulePage from "../pages/ModulePage";
import LessonPage from "../pages/LessonPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/registration" element={<RegistrationPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/account" element={<AccountPage/>}/>
            <Route path="/admin/courses" element={<AdminPage/>}/>
            <Route path="/admin/create-category" element={<CreateCategoryPage/>}/>
            <Route path="/shop" element={<MainShopPage/>}/>
            <Route path="/" element={<MainShopPage/>}/>

            <Route path="/MathCourses" element={<MathCoursesPage/>}/>
            <Route path="/HistoryCourses" element={<HistoryCoursesPage/>}/>
            <Route path="/UkrainianCourses" element={<UkrainianCoursesPage/>}/>

            <Route path="/CourseDetailPage" element={<CourseDetailPage/>}/>
                <Route path="/courses" element={<CoursesPage/>}/>

            <Route path="/modules/:moduleId" element={<ModulePage />} />
            <Route path="/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />

        </Routes>
    );
};

export default AppRouter;
