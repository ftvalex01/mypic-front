import { useEffect, useState } from 'react';
import useAuthContext from '../context/AuthContext'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos
import { Link } from 'react-router-dom';

const BuscarPerfil = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { fetchAllUsers } = useAuthContext(); // Asume que tienes esta función disponible en tu contexto
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchAllUsers(); // Llama a la función que hace la petición a la API
                // Accediendo directamente al arreglo de usuarios dentro de la propiedad 'data' de la respuesta
                setAllUsers(response.data); // Aquí ajustas para usar response.data
                setFilteredUsers(response.data); // Igual aquí
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        loadUsers();
    }, [fetchAllUsers]); // Dependencia 'fetchAllUsers' para asegurar que la función está disponible

    const handleChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        // Filtra basándose en el término de búsqueda y actualiza el estado
        const filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredUsers(filtered);
    };

    return (
        <>
            <input
                type="text"
                onChange={handleChange}
                className="form-control my-3"
                alt="Buscador"
                value={searchTerm}
            />
            <ul className="list-group">
                {filteredUsers.map(user => (
                    <li key={user.id} className="list-group-item" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={user.profile_picture} alt={user.username} style={{ width: '15px', marginRight: '10px' }} />
                        <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>{user.username}</Link>
                    </li>
                ))}
            </ul>


        </>
    );
};

export default BuscarPerfil;
