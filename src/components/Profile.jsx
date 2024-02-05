import { FaCog, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'; 

const Profile = () => {
  const { user } = useAuthContext(); 
  console.log(user.data.profile_picture)
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
            <Link to="edit" className="border px-2 py-1 rounded">
              Editar perfil
            </Link>
            <FaCog />
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

      <div className="grid grid-cols-3 gap-3 justify-center ">
        {/* {userPosts.map((post, index) => (
          <img key={index} src={post} alt={`Post ${index}`} className="w-80" />
        ))} */}
      </div>
    </div>
  );
};

export default Profile;
