import { useEffect, useState } from "react";
import { FaCog, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const Profile = () => {
  const { user, getUserImages, getFollowData, updateProfilePrivacy } = useAuthContext();
  const [userImages, setUserImages] = useState([]);
  const [followData, setFollowData] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [isProfilePrivate, setIsProfilePrivate] = useState(user?.data?.isPrivate || false);
  const baseUrl = "http://localhost:8000";
  useEffect(() => {
    const fetchUserImages = async () => {
      if (user && user.data.id) {
        try {
          const response = await getUserImages(user.data.id);
          setUserImages(response.data);
        } catch (error) {
          console.error("Error fetching user images:", error);
        }
      }
    };

    const fetchFollowData = async () => {
      if (user && user.data.id) {
        try {
          const data = await getFollowData(user.data.id);
          setFollowData({ followers: data.followersCount, following: data.followingCount });
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      }
    };

    fetchUserImages();
    fetchFollowData();
  }, [user, getUserImages, getFollowData]);

  const toggleProfilePrivacy = async () => {
    const newPrivacySetting = !isProfilePrivate;
    setIsProfilePrivate(newPrivacySetting);
    await updateProfilePrivacy(newPrivacySetting);
    setShowSettings(false); // Opcional: cerrar menú tras cambiar la configuración
  };

  return (
    <div className="pt-16 flex-1 flex flex-col overflow-auto">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <img
            src={user?.data.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-full w-20 h-20 md:w-40 md:h-40"
          />
          <div className="md:ml-10 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{user?.data.username}</h1>
            <div className="flex flex-wrap space-x-4 mt-4">
              <Link to="edit" className="btn">
                Editar perfil
              </Link>
              <button className="btn" onClick={() => setShowSettings(!showSettings)}>
                <FaCog />
              </button>
              {showSettings && (
                <div className="settings-dropdown">
                  <button onClick={toggleProfilePrivacy}>
                    {isProfilePrivate ? "Hacer perfil público" : "Hacer perfil privado"}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <span>{userImages.length} publicaciones</span>
              <span>{followData.followers} seguidores</span>
              <span>{followData.following} seguidos</span>
            </div>
            <p className="mt-2">{user?.data.bio}</p>
          </div>
        </div>

        <div className="flex mt-4 justify-center md:justify-start">
          <FaPlusCircle className="mr-2" />
          <span>Nuevo</span>
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userImages.map((image, index) => (
            <div key={index} className="w-full h-64 overflow-hidden">
              <img
                src={`${baseUrl}${image.url}`}
                alt={`User Post ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;