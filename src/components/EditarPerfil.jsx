import React, { useState, useRef, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import './style.css'; // Asegúrate de tener un archivo CSS con este nombre

const EditarPerfil = () => {
    const { user, updateProfile } = useUserContext();
    const [formData, setFormData] = useState({
        nombre: user.data.name,
        bio: user.data.bio || '',
    });
    const [previewImage, setPreviewImage] = useState(user.data.profile_picture || '');
    const profileImageRef = useRef(null);

    useEffect(() => {
        if (user.data.profile_picture) {
            setPreviewImage(user.data.profile_picture);
        }
    }, [user.data.profile_picture]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && validateAndSetImage(file)) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateAndSetImage = (file) => {
        const fileSize = file.size / 1024 / 1024; // size in MB
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validMimeTypes.includes(file.type) || fileSize > 2) {
            Swal.fire('Error', 'Archivo no válido. Asegúrate de que sea una imagen (jpg, jpeg, png) y no exceda los 2MB.', 'error');
            profileImageRef.current.value = ''; // Reset input file
            setPreviewImage(user.data.profile_picture || ''); // Reset preview image
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estás a punto de actualizar tu perfil.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const file = profileImageRef.current.files[0];
                const data = new FormData();
                data.append('name', formData.nombre);
                data.append('bio', formData.bio);
                if (file) {
                    data.append('profile_picture', file);
                }

                try {
                    await updateProfile(data);
                    Swal.fire('¡Éxito!', 'Perfil actualizado correctamente.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
                }
            }
        });
    };

    return (
        <div className="editar-perfil-container md:mt-4 sm:mt-4">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Biografía</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group image-upload">
                    <label htmlFor="image-upload" className="image-label">Selecciona una imagen</label>
                    <input
                        type="file"
                        id="image-upload"
                        ref={profileImageRef}
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {previewImage && <img src={previewImage} alt="Vista previa" className="image-preview" />}
                </div>
                <button  className="submit-btn">Actualizar perfil</button>
            </form>
        </div>
    );
};

export default EditarPerfil;
