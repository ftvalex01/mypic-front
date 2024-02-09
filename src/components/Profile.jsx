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
  
      const images = response.data;

          setUserImages(images);
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
    setShowSettings(false); // Opcional: cerrar menú tras cambiar la configuración
    await updateProfilePrivacy(newPrivacySetting); // Usa la función de contexto para actualizar
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-center md:flex-row md:items-center">
        <img
          src={user.data.profile_picture || "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}
          alt="Profile"
          className="rounded-full w-20 h-20 md:w-40 md:h-40"
        />
        <div className="md:ml-4">
          <h1 className="text-xl font-bold">{user.data.username}</h1>
          <div className="flex space-x-4 my-2">
            <Link to="edit" className="border px-2 py-1 rounded">
              Editar perfil
            </Link>
            <div className="relative">
              <button
                className="border px-2 py-1 rounded flex items-center"
                onClick={() => setShowSettings(!showSettings)}
              >
                <FaCog />
              </button>
              {showSettings && (
                <div className="absolute bg-white shadow-md rounded-lg py-2 mt-2 z-10">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={toggleProfilePrivacy}
                  >
                    Hacer perfil {isProfilePrivate ? "público" : "privado"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-4">
              <span>{userImages.length} publicaciones</span>
              <span>{followData.followers} seguidores</span>
              <span>{followData.following} seguidos</span>
            </div>
          </div>
          <p>{user.data.bio}</p>
        </div>
      </div>
      <div className="flex mt-4 justify-center">
        <FaPlusCircle className="mr-2" />
        <span>Nuevo</span>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-3 gap-3 justify-center">
        {userImages.map((image, index) => (
          <div key={index} className="w-full h-64 overflow-hidden"> {/* Ajusta el tamaño según necesites */}
            <img
              src={`${baseUrl}${image.url}`}
              alt={`User Post ${index}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Profile;
