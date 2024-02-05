import { FaCog, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'; // Importa el contexto de autenticación

const Profile = () => {
  const { user } = useAuthContext(); // Obtiene los datos del usuario del contexto
  console.log(user.data.profile_picture)
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-center md:flex-row md:items-center">
        <img
          src={user.data.profile_picture} // Utiliza el avatar del usuario autenticado
          alt="Profile"
          className="rounded-full w-20 h-20 md:w-40 md:h-40"
        />
        <div className="md:ml-4">
          <h1 className="text-xl font-bold">{user.data.username}</h1> {/* Utiliza el nombre de usuario del usuario autenticado */}
          <div className="flex space-x-4 my-2">
            <Link to="edit" className="border px-2 py-1 rounded">
              Editar perfil
            </Link>
            <FaCog />
          </div>
          <div className="flex space-x-4">
            <span>{user.data.postsCount} publicaciones</span> {/* Utiliza la cantidad de publicaciones del usuario autenticado */}
            <span>{user.data.followersCount} seguidores</span> {/* Utiliza la cantidad de seguidores del usuario autenticado */}
            <span>{user.data.followingCount} seguidos</span> {/* Utiliza la cantidad de seguidos del usuario autenticado */}
          </div>
          <p>{user.data.bio}</p> {/* Utiliza la biografía del usuario autenticado */}
        </div>
      </div>
      <div className="flex mt-4 justify-center">
        <FaPlusCircle className="mr-2" />
        <span>Nuevo</span>
      </div>
      <hr className="my-4" />
      {/* A continuación, puedes cargar las publicaciones del usuario */}
      <div className="grid grid-cols-3 gap-3 justify-center ">
        {/* {userPosts.map((post, index) => (
          <img key={index} src={post} alt={`Post ${index}`} className="w-80" />
        ))} */}
      </div>
    </div>
  );
};

export default Profile;
