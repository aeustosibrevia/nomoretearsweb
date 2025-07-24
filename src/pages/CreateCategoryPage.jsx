import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {createCategory} from "../services/api";

const CreateCategoryPage = () => {
    const [formData, setFormData] = useState({
        name: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const user = JSON.parse(localStorage.getItem("user"));
            await createCategory(formData, user.token);
            navigate("/admin/courses");
        }
        catch(err){
            console.log(err.message);
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Назва категорії" required />
            <button type="submit">Створити категорію</button>
        </form>
    );
};

export default CreateCategoryPage;
