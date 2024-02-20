import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { useSocialInteractions } from "../context/SocialInteractionContext";
import { useUserContext } from "../context/UserContext";
import { FaCog, FaPlusCircle } from "react-icons/fa";

const ProfileByUsername = () => {
  const { username } = useParams();
  const { fetchUserByUsername } = useAuthContext();
  const { getUserImages } = useUserContext();
  const { followUser, getFollowData } = useSocialInteractions();
  const [profile, setProfile] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followRequestSent, setFollowRequestSent] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowRequestPending, setIsFollowRequestPending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { blockUser, unblockUser } = useSocialInteractions();
  const { checkIfBlocked } = useSocialInteractions();
  const [isBlocked, setIsBlocked] = useState(false);

  const baseUrl = import.meta.REACT_APP_BASE_URL || "http://localhost:8000";

  const loadUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUserByUsername(username);
      if (userData) {
        setProfile(userData);

        const followInfo = await getFollowData(userData.id);
        const blockedStatus = await checkIfBlocked(userData.id);

        setIsFollowing(followInfo.isFollowing);
        setFollowersCount(followInfo.followersCount);
        setFollowingCount(followInfo.followingCount);
        setFollowRequestSent(followInfo.isRequested);
        setIsFollowRequestPending(followInfo.isRequested);
        setIsBlocked(blockedStatus.isBlocked);

        if (!userData.is_private || followInfo.isFollowing) {
          const imagesResponse = await getUserImages(userData.id);
          setUserImages(imagesResponse.data || []);
        } else {
          setUserImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
    setIsLoading(false);
  }, [username, fetchUserByUsername, getUserImages, getFollowData, checkIfBlocked]);

  useEffect(() => {
    loadUserProfile();
    const fetchBlockStatus = async () => {
      try {
        const result = await checkIfBlocked(profile.id);
        setIsBlocked(result); // Asume que checkIfBlocked devuelve un booleano
      } catch (error) {
        console.error("Error al verificar el estado de bloqueo:", error);
      }
    };

    if (profile) {
      fetchBlockStatus();
    }
  }, [loadUserProfile,checkIfBlocked]);

  const handleFollowClick = async () => {
    try {
      const result = await followUser(profile.id);


      // Manejo de la respuesta del backend
      if (result.message === 'Follow request cancelled') {
        // Si la solicitud de seguimiento se cancela
        setFollowRequestSent(false);
        setIsFollowRequestPending(false);
      } else if (result.message === 'Follow request sent') {
        // Si se envía una solicitud de seguimiento
        setFollowRequestSent(true);
        setIsFollowRequestPending(true);
        setIsFollowing(false); // Asegúrate de que no se marque como siguiendo
      } else if (result.isFollowing !== undefined) {
        // Actualización directa de seguir/dejar de seguir
        setIsFollowing(result.isFollowing);
        setFollowRequestSent(false);
        setIsFollowRequestPending(false);
      }
    } catch (error) {
      console.error("Error trying to follow/unfollow:", error);
    }
  };

  const handleBlockClick = async () => {
    try {
      if (isBlocked) {
        // Intenta desbloquear el usuario
        const result = await unblockUser(profile.id);
        setIsBlocked(false); // Asume desbloqueo exitoso
        // Maneja cualquier lógica adicional aquí, por ejemplo, mostrar un mensaje
        alert('Usuario desbloqueado exitosamente');
      } else {
        // Intenta bloquear el usuario
        const result = await blockUser(profile.id);
        setIsBlocked(true); // Asume bloqueo exitoso
        // Maneja cualquier lógica adicional aquí
        alert('Usuario bloqueado exitosamente');
      }
    } catch (error) {
      console.error("Error al cambiar estado de bloqueo:", error);
      alert('No se pudo cambiar el estado de bloqueo del usuario');
    }
  };

  const profileImageUrl = profile && profile.profile_picture
    ? `${baseUrl}${profile.profile_picture}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  if (isLoading) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {profile ? (
        <>
          <div className="flex flex-col justify-center md:flex-row md:items-center">
            <img src={profileImageUrl} alt="Profile" className="rounded-full w-20 h-20 md:w-40 md:h-40" />
            <div className="md:ml-4">
              <h1 className="text-xl font-bold">{profile.username}</h1>
              <div className="flex space-x-4 my-2">
                <button onClick={handleFollowClick} className={`px-4 py-2 rounded text-white ${isFollowing ? "bg-red-500" : followRequestSent || isFollowRequestPending ? "bg-yellow-500" : "bg-blue-500"}`}>
                  {isFollowing ? "Dejar de seguir" : followRequestSent ? "Solicitud enviada" : isFollowRequestPending ? "Pendiente" : "Seguir"}
                </button>
              </div>
              <button className="btn" onClick={() => setShowSettings(!showSettings)}>
                <FaCog />
              </button>
              {showSettings && (
                <div className="settings-dropdown">
                  {/* Cambia esta parte para incluir la funcionalidad de bloqueo */}
                  <button onClick={handleBlockClick} className={`px-4 py-2 rounded text-white ${isBlocked ? "bg-green-500" : "bg-red-500"}`}>
                    {isBlocked ? "Desbloquear Usuario" : "Bloquear Usuario"}
                  </button>                </div>
              )}
              <div className="flex space-x-4">
                <span>{userImages.length} publicaciones</span>
                <span>{followersCount} seguidores</span>
                <span>{followingCount} seguidos</span>
              </div>
              <p>{profile.bio}</p>
            </div>
          </div>
          <hr className="my-4" />
          {(!profile.is_private || isFollowing) ? (
            <div className="grid grid-cols-3 gap-3">
              {userImages.map((image, index) => (
                <img key={index} src={`${baseUrl}${image.url}`} alt={`Publicación ${index + 1}`} className="w-full h-auto" />
              ))}
            </div>
          ) : (
            <p>Este perfil es privado. Sigue al usuario para ver sus publicaciones.</p>
          )}
        </>
      ) : (
        <div>Cargando perfil...</div>
      )}
    </div>
  );
};

export default ProfileByUsername;
