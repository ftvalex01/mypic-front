import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'; // Ajusta la ruta de importación según tu estructura

const BuscarPerfil = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { fetchAllUsers, user: currentUser } = useAuthContext(); // Obtiene el usuario actual y la función para buscar usuarios
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchAllUsers();
                setAllUsers(response.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setAllUsers([]);
            }
        };

        loadUsers();
    }, [fetchAllUsers]);

    const filteredUsers = searchTerm 
        ? allUsers.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())) 
        : [];

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUserClick = username => {
        if (username === currentUser?.data?.username) {
            navigate("/profile");
        } else {
            navigate(`/profile/${username}`);
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar perfil..."
                onChange={handleChange}
                value={searchTerm}
                className="form-control my-3 w-full px-4 py-2 border rounded"
            />
            {searchTerm && (
                <ul className="absolute w-full bg-white shadow-lg max-h-60 overflow-auto z-10">
                    {filteredUsers.map(user => (
                        <li key={user.id} 
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleUserClick(user.username)}>
                            <img src={user.profile_picture || "https://via.placeholder.com/150"} 
                                alt={user.username} 
                                className="w-8 h-8 mr-2 rounded-full" />
                            <span className="text-gray-700">
                                {user.username}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BuscarPerfil;
