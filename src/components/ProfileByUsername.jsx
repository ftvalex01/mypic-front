import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const ProfileByUsername = () => {
  const { username } = useParams();
  const { fetchUserByUsername, getUserImages, getFollowData, followUser } =
    useAuthContext();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [followData, setFollowData] = useState({ followers: 0, following: 0 });
  const [followStatus, setFollowStatus] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserByUsername(username);
        setProfile(userData); // Esto establece el perfil.
        // Se asume que getFollowData ya está implementado para devolver si el usuario actual está siguiendo al perfil visitado
        const followStatus = await getFollowData(userData.id);
        setIsFollowing(followStatus.isFollowing);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    loadUserProfile();
  }, [username, fetchUserByUsername, getFollowData]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (profile && profile.id) {
        try {
          const images = await getUserImages(profile.id);
          setUserImages(images.data || []);
          const data = await getFollowData(profile.id);
          setFollowData({
            followers: data.followersCount || 0,
            following: data.followingCount || 0,
          });
        } catch (error) {
          console.error("Error fetching additional data:", error);
        }
      }
    };

    if (profile) {
      fetchAdditionalData();
    }
  }, [profile, getUserImages, getFollowData]);

  const handleFollowClick = async () => {
    try {
      const result = await followUser(profile.id);
      if (result.message === "Follow request sent") {
        // Suponiendo que el servidor responda con este mensaje para solicitudes pendientes
        setFollowStatus("pending");
      } else {
        setIsFollowing(result.isFollowing);
        setFollowStatus(result.isFollowing ? "following" : "");
        // Ajusta la lógica para actualizar followData si es necesario
      }
    } catch (error) {
      console.error("Error al intentar seguir/dejar de seguir:", error);
    }
  };

  const changedUrl =
    profile && profile.profile_picture
      ? `http://localhost:8000/storage/${profile.profile_picture}`
      : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";

  return (
    <div className="container mx-auto p-4">
      {profile ? (
        <div className="flex flex-col justify-center md:flex-row md:items-center">
          <img
            src={changedUrl}
            alt="Profile"
            className="rounded-full w-20 h-20 md:w-40 md:h-40"
          />
          <div className="md:ml-4">
            <h1 className="text-xl font-bold">{profile.username}</h1>
            <div className="flex space-x-4 my-2">
              <button
                onClick={handleFollowClick}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                {followStatus === "pending"
                  ? "Pendiente"
                  : isFollowing
                  ? "Dejar de seguir"
                  : "Seguir"}
              </button>
            </div>
            <div className="flex space-x-4">
              <span>{userImages.length} publicaciones</span>
              <span>{followData.followers} seguidores</span>
              <span>{followData.following} seguidos</span>
            </div>
            <p>{profile.bio}</p>
          </div>
        </div>
      ) : (
        <div>Cargando perfil...</div>
      )}

      <hr className="my-4" />

      <div className="grid grid-cols-3 gap-3 justify-center">
        {userImages.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:8000${image.url}`}
            alt={`User Post ${index}`}
            className="w-full h-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileByUsername;
