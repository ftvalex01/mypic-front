import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';

const ProfileByUsername = () => {
    const { username } = useParams();
    const { fetchUserByUsername, getUserImages, getFollowData } = useAuthContext();
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState();
    const { followUser } = useAuthContext();
    const [userImages, setUserImages] = useState([]);
    const [followData, setFollowData] = useState({});

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userData = await fetchUserByUsername(username);
                setProfile(userData); // Esto establece el perfil.
                setIsFollowing(userData.isFollowing); // Asume que userData incluye isFollowing.
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        loadUserProfile();
    }, [username, fetchUserByUsername]);

    // Este useEffect depende de que 'profile' se actualice, por lo que se ejecutará después
    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (profile && profile.id) {
                try {
                    const images = await getUserImages(profile.id);
                    if (images.message) {
                        // Manejar el caso en que no se puedan cargar las imágenes.
                        console.log(images.message); // O mostrar un mensaje en la UI.
                        setUserImages([]); // O manejar de otra manera según necesites.
                    } else {
                        
                        setUserImages(images.data);
                    }
                    const data = await getFollowData(profile.id);
                    setFollowData({ followers: data.followersCount, following: data.followingCount });
                } catch (error) {
                    console.error("Error fetching additional data:", error);
                }
            }
        };
    
        if (profile) {
            fetchAdditionalData();
        }
    }, [profile, getUserImages, getFollowData]);
    

    if (!profile) {
        // Aquí puedes manejar el estado de carga o mostrar un mensaje si el perfil no existe
        return <div>Cargando perfil...</div>;
    }
 
    const handleFollowClick = async () => {
        try {
            const result = await followUser(profile.id);
            // Asume que `result` tiene una propiedad `isFollowing` que indica el nuevo estado de seguimiento
            if (result && typeof result.isFollowing !== 'undefined') {
                setIsFollowing(result.isFollowing);
            } else {
                console.error("La respuesta no incluye el estado de seguimiento esperado.");
            }
        } catch (error) {
            console.error("Error al intentar seguir/dejar de seguir:", error);
        }
    };


    let changedUrl = 'http://localhost:8000/storage/' + profile.profile_picture || "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";
    let followButton;

    if (isFollowing) {
        followButton = (
            <button onClick={() => handleFollowClick()} className="px-4 py-2 rounded bg-blue-500 text-white">
                Siguiendo
            </button>
        );
    } else {
        followButton = (
            <button onClick={() => handleFollowClick()} className="px-4 py-2 rounded bg-blue-500 text-white">
                Seguir
            </button>
        );
    }
  
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col justify-center md:flex-row md:items-center">
                <img
                    src={changedUrl}
                    alt="Profile"
                    className="rounded-full w-20 h-20 md:w-40 md:h-40"
                />

                <div className="md:ml-4">
                    <h1 className="text-xl font-bold">{profile.username}</h1>
                    <div className="flex space-x-4 my-2">
                        {followButton}

                    </div>
                    <div className="flex space-x-4">
                        <span> publicaciones</span>
                        <span>{followData.followers} seguidores</span> {/* Actualizado para usar followData */}
                        <span>{followData.following} seguidos</span> {/* Actualizado para usar followData */}
                    </div>
                    <p>{profile.bio}</p>
                </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-3 gap-3 justify-center">
                {userImages.map((image, index) => (
                    <img
                        key={index}
                        src={`http://localhost:8000${image.url}`} // Asegúrate de usar image.url aquí
                        alt={`User Post ${index}`}
                        className="w-full h-auto"
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileByUsername;
