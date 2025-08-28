import { useParams } from "react-router-dom";
import { users } from "../data/users";
import "../styles/users.css";


const AdminUserDetail = () => {
    const { userId } = useParams();
    const u = users.find((x) => x.id === userId) || users[0];

    return (
        <div className="user-detail-page">
            <div className="user-detail__left">
                <div className="detail-avatar">
                    {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} /> : <span className="avatar-silhouette" />}
                </div>
                <div className="detail-name">{u.name}</div>
            </div>

            <div className="user-detail__right">
                <div className="pill-box">{u.course || "Курс/предмет: —"}</div>
                <div className="pill-box">Прогрес у курсі: {u.progress || "—"}</div>
                <div className="pill-box">{u.lastTest || "Оцінки / результат останнього тесту: —"}</div>
                <div className="pill-box">Стан оплати: {u.payment || "—"}</div>
                <div className="pill-box">{u.teacherComment || "Коментар викладача: —"}</div>
            </div>
        </div>
    );
}
export default AdminUserDetail;

