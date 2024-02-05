import { useEffect, useState } from "react";
import { FaCog, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta

const Profile = () => {
  const { user, getUserImages } = useAuthContext(); // Asume que getUserImages ya está implementado en tu AuthContext
  const [userImages, setUserImages] = useState([]);
  const baseUrl = "http://localhost:8000";
  useEffect(() => {
    const fetchUserImages = async () => {
      if (user && user.data.id) {
        try {
          const images = await getUserImages(user.data.id); 
          setUserImages(images);
          
        } catch (error) {
          console.error("Error fetching user images:", error);
        }
      }
    };

    fetchUserImages();
  }, [user, getUserImages]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-center md:flex-row md:items-center">
        <img
          src={user.data.profile_picture}
          alt="Profile"
          className="rounded-full w-20 h-20 md:w-40 md:h-40"
        />
        <div className="md:ml-4">
          <h1 className="text-xl font-bold">{user.data.username}</h1>
          <div className="flex space-x-4 my-2">
            <Link to="/edit" className="border px-2 py-1 rounded">
              Editar perfil
            </Link>
            <button className="border px-2 py-1 rounded flex items-center">
              <FaCog />
            </button>
          </div>
          <div className="flex space-x-4">
            <span>{user.data.postsCount} publicaciones</span>
            <span>{user.data.followersCount} seguidores</span>
            <span>{user.data.followingCount} seguidos</span>
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
        <img
          key={index}
          src={`${baseUrl}${image.url}`} // Usa la URL base aquí
          alt={`User Post ${index}`}
          className="w-full h-auto"
        />
      ))}
    </div>
    </div>
  );
};

export default Profile;
