import { users } from "../data/users";
import "../styles/comments.css";


const AdminCommentsPage = () => {
    const items = users
        .flatMap(u =>
            (u.comments ?? []).map(c => ({
                ...c,
                userId: u.id,
                userName: u.name,
                avatarUrl: u.avatarUrl,
            }))
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="comments-page">
            <ul className="comments-list">
                {items.map(item => (
                    <li key={item.id} className="comment-item">
                        <div className="comment-left">
                            <div className="comment-avatar">
                                {item.avatarUrl ? (
                                    <img src={item.avatarUrl} alt={item.userName} />
                                ) : (
                                    <span className="avatar-dot" />
                                )}
                            </div>
                            <div className="comment-texts">
                                <div className="comment-name">{item.userName}</div>
                                <div className="comment-course">{item.course}</div>
                                <div className="comment-body">{item.text}</div>
                            </div>
                        </div>


                    </li>
                ))}
            </ul>
        </div>
    );
}
export default AdminCommentsPage;
