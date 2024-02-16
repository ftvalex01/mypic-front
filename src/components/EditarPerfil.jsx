import { useState, useRef } from 'react';
import { useUserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

const EditarPerfil = () => {
    const { user, updateProfile } = useUserContext();
    const [formData, setFormData] = useState({
        nombre: user.data.name,
        bio: user.data.bio || '',
    });
    const profileImageRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateAndSetImage = (file) => {
        const fileSize = file.size / 1024 / 1024; // size in MB
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validMimeTypes.includes(file.type) || fileSize > 2) {
            Swal.fire('Error', 'Archivo no válido. Asegúrate de que sea una imagen (jpg, jpeg, png) y no exceda los 2MB.', 'error');
            profileImageRef.current.value = ''; // Reset input file
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = profileImageRef.current.files[0];
        if (file && !validateAndSetImage(file)) return;

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
    };

    return (
        <div className="max-w-md mx-auto bg-white p-5 border rounded-lg shadow-md mt-5">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        name="nombre" // Asegúrate de que el 'name' coincida con las claves del estado del formulario
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.nombre}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Biografía */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Biografía
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.bio}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                {/* Carga de imagen */}
                {/* Botón para seleccionar la imagen */}
                <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                    Cambiar foto
                    <input
                        type="file"
                        className="hidden"
                        ref={profileImageRef}
                        onChange={(e) => {
                            if (e.target.files[0]) validateAndSetImage(e.target.files[0]);
                        }}
                        accept="image/jpeg, image/png, image/jpg"
                    />
                </label>
                {/* Botón de envío */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="w-full py-2 text-white rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarPerfil;