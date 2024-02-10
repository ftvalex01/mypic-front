import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'; // Ajusta la ruta de importación según tu estructura

const BuscarPerfil = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { fetchAllUsers, user: currentUser } = useAuthContext(); // Obtiene el usuario actual y la función para buscar usuarios
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();
    console.log(currentUser)
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchAllUsers();
                // Asume que la respuesta incluye una propiedad 'data' que es un arreglo de usuarios
                setAllUsers(response.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setAllUsers([]); // Maneja errores asegurando que allUsers sea un arreglo
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

    // Maneja el clic en el nombre de usuario para redirigir correctamente
    const handleUserClick = username => {
        // Asegúrate de acceder a currentUser.data.username para la comparación
        if (username === currentUser?.data?.username) {
            navigate("/profile"); // Redirige al perfil del usuario actual
        } else {
            navigate(`/profile/${username}`); // Redirige al perfil por nombre de usuario
        }
    };

    return (
        <>
            <input
                type="text"
                placeholder="Buscar perfil..."
                onChange={handleChange}
                value={searchTerm}
                className="form-control my-3"
            />
            <ul className="list-group">
                {filteredUsers.map(user => (
                    <li key={user.id} 
                        className="list-group-item" 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => handleUserClick(user.username)}>
                        <img src={user.profile_picture || "https://via.placeholder.com/150"} 
                             alt={user.username} 
                             style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />
                        <span style={{ textDecoration: 'none', color: 'inherit' }}>
                            {user.username}
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default BuscarPerfil;
