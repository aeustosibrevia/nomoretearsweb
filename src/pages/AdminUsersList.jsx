import { Link } from "react-router-dom";
import { users } from "../data/users";
import "../styles/users.css";



const AdminUsersList = () => {
    return (
        <div className="users-page">
            <h2 className="users-title">Учні</h2>

            <ul className="users-list">
                {users.map((u) => (
                    <li key={u.id} className="users-item">
                        <Link to={`/admin/users/${u.id}`} className="users-item__link">
                            <div className="users-item__avatar">
                                {u.avatarUrl ? (
                                    <img src={u.avatarUrl} alt={u.name} />
                                ) : (
                                    <span className="avatar-placeholder" />
                                )}
                            </div>
                            <span className="users-item__name">{u.name}</span>
                        </Link>


                    </li>
                ))}
            </ul>
        </div>
    );
}
export default AdminUsersList;
