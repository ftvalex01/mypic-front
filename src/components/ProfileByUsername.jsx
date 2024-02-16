import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { useSocialInteractions } from "../context/SocialInteractionContext"; // Importa el hook correcto
import { useUserContext } from "../context/UserContext";

const ProfileByUsername = () => {
  const { username } = useParams();
  const { fetchUserByUsername } = useAuthContext();
  const { getUserImages } = useUserContext();
  const { followUser, getFollowData } = useSocialInteractions(); // Utiliza useSocialInteractions aquí
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [followData, setFollowData] = useState({ followers: 0, following: 0 });
  const [followStatus, setFollowStatus] = useState("");

  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserByUsername(username);
        if (userData) {
          setProfile(userData);
          const images = await getUserImages(userData.id);
          setUserImages(Array.isArray(images) ? images : []);
  
          // Renombrado para evitar confusiones
          const followInfo = await getFollowData(userData.id);
          console.log(followInfo);
          if (followInfo) {
            setIsFollowing(followInfo.isFollowing);
            setFollowData({
              followers: followInfo.followersCount,
              following: followInfo.followingCount,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    if (username) {
      loadUserProfile();
    }
  }, [username, fetchUserByUsername, getUserImages, getFollowData]);
  
  const handleFollowClick = async () => {
    try {
      const result = await followUser(profile.id);
      if (result.message === "Follow request sent") {
        setFollowStatus("pending");
      } else if (typeof result.isFollowing !== 'undefined') {
        setIsFollowing(result.isFollowing);
        // Considera usar un valor diferente o manejar este estado de manera diferente
        setFollowStatus(result.isFollowing ? "following" : "not following");
      } else {
        console.error("Unexpected response from followUser:", result);
      }
  
      const updatedFollowInfo = await getFollowData(profile.id);
      if (updatedFollowInfo) {
        setFollowData({
          followers: updatedFollowInfo.followersCount,
          following: updatedFollowInfo.followingCount,
        });
      }
    } catch (error) {
      console.error("Error trying to follow/unfollow:", error);
    }
  };
  

  const profileImageUrl =
    profile && profile.profile_picture
      ? `http://localhost:8000/storage/${profile.profile_picture}`
      : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";

  return (
    <div className="container mx-auto p-4">
      {profile ? (
        <>
          <div className="flex flex-col justify-center md:flex-row md:items-center">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="rounded-full w-20 h-20 md:w-40 md:h-40"
            />
            <div className="md:ml-4">
              <h1 className="text-xl font-bold">{profile.username}</h1>
              <div className="flex space-x-4 my-2">
                <button
                  onClick={handleFollowClick}
                  className={`px-4 py-2 rounded text-white ${
                    isFollowing ? "bg-red-500" : "bg-blue-500"
                  }`}
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
        </>
      ) : (
        <div>Cargando perfil...</div>
      )}
    </div>
  );
};

export default ProfileByUsername;
