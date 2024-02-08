import { useState } from 'react';
import useAuthContext from '../context/AuthContext'; 
import Swal from 'sweetalert2';

const EditarPerfil = () => {
    const { user, updateProfile } = useAuthContext();
 
    const [nombre, setNombre] = useState(user.data.name);
    const [bio, setBio] = useState(user.data.bio || '');
    const [profileImage, setProfileImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: nombre,
            bio: bio
        };
        if (profileImage) {
            data.profile_picture = profileImage;
        }
        
        console.log(data);
    
        await updateProfile(data);
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            const fileSize = file.size / 1024; // size in KB
            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
            if (!validMimeTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid file type. Only JPG, JPEG, and PNG are allowed.',
                });
                return;
            }
    
            if (fileSize > 2048) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'File size exceeds limit of 2048KB.',
                });
                return;
            }
    
            setProfileImage(file);
        }
    };
    

    return (
        <div className="max-w-md mx-auto bg-white p-5 border rounded-lg shadow-md mt-5">
            <div className="mb-4 text-center">
                <img className="w-24 h-24 rounded-full mx-auto" src={user.profile_picture || 'path_to_some_default_image'} alt="Foto de perfil" />
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Cambiar foto
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input type="text" id="nombre" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Biografía
                    </label>
                    <textarea id="bio" name="bio" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarPerfil;
