import { useState, useEffect } from 'react';
import { useUserContext } from "../context/UserContext"; // Cambiado a useUserContext
import Swal from 'sweetalert2'; // Para un mejor feedback al usuario

const ProfileEditForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        password_confirmation: '',
        birth_date: '',
        bio: '',
        profile_picture: null, // Cambiado a null para manejar como file
        available_pines: '',
        accumulated_points: '',
    });

    const { user, updateUserProfile } = useUserContext(); // Asumiendo que existe una función para actualizar el perfil

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                password: '',
                password_confirmation: '',
                birth_date: user.birth_date,
                bio: user.bio,
                profile_picture: null,
                available_pines: user.available_pines,
                accumulated_points: user.accumulated_points,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prevState => ({ ...prevState, [name]: files[0] }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación simple para el ejemplo
        if (!formData.name || !formData.password || formData.password !== formData.password_confirmation) {
            Swal.fire('Error', 'Por favor, rellena todos los campos obligatorios y confirma correctamente tu contraseña.', 'error');
            return;
        }

        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) { // Evitar añadir campos nulos
                dataToSend.append(key, formData[key]);
            }
        });

        try {
            await updateUserProfile(dataToSend); // Asumiendo que updateUserProfile maneja FormData
            Swal.fire('¡Éxito!', 'Perfil actualizado con éxito.', 'success');
        } catch (error) {
            console.error('Error al actualizar el perfil', error);
            Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
        }
    };

    // Asumiendo que existe un componente Input y Button personalizado para manejar la consistencia del diseño
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
            <button type="submit" className="btn-primary">Actualizar Perfil</button>
        </form>
    );
};


export default ProfileEditForm;
