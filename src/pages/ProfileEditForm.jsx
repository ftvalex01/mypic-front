import { useState, useEffect } from 'react';
import axios from '../api/axios'; 
import useAuthContext from "../context/AuthContext"; 

const ProfileEditForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        password_confirmation: '',
        birth_date: '',
        bio: '',
        profile_picture: '',
        available_pines: '',
        accumulated_points: '',
    });

    const { user, getUser } = useAuthContext(); 

    useEffect(() => {
        if (user) {

            setFormData(prevState => ({
                ...prevState,
                name: user.name,
                birth_date: user.birth_date,
                bio: user.bio,
                profile_picture: user.profile_picture,
                available_pines: user.available_pines,
                accumulated_points: user.accumulated_points,
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            password_confirmation: formData.password, 
        };
        try {
            await axios.put('/api/user/{user}', dataToSend); 
            getUser(); 
            alert('Perfil actualizado con éxito');
        } catch (error) {
            console.error('Error al actualizar el perfil', error);
           
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
            />
            {/* Repite para los demás campos */}
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
            />
            <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirmar Contraseña"
            />
            {/* Añade los demás campos aquí */}
            <button type="submit">Actualizar Perfil</button>
        </form>
    );
};

export default ProfileEditForm;
