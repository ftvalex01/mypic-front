
import { FaCog, FaPlusCircle } from 'react-icons/fa';

const Profile = () => {
  // Datos ficticios para simular los datos del usuario y sus publicaciones
  const userData = {
    username: 'ftv_alex',
    profilePicture: '/images/mypic-logo.png',
    postsCount: 44,
    followersCount: 238,
    followingCount: 391,
    bio: 'Alex',
  };

  const userPosts = [
    '/images/mypic-logo.png',
    '/images/mypic-logo.png',
    '/images/mypic-logo.png',
    // ...más publicaciones
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-center md:flex-row md:items-center">
        <img
          src={userData.profilePicture}
          alt="Profile"
          className="rounded-full w-20 h-20 md:w-40 md:h-40"
        />
        <div className="md:ml-4">
          <h1 className="text-xl font-bold">{userData.username}</h1>
          <div className="flex space-x-4 my-2">
            <button className="border px-2 py-1 rounded">Editar perfil</button>
            <FaCog />
          </div>
          <div className="flex space-x-4">
            <span>{userData.postsCount} publicaciones</span>
            <span>{userData.followersCount} seguidores</span>
            <span>{userData.followingCount} seguidos</span>
          </div>
          <p>{userData.bio}</p>
        </div>
      </div>
      <div className="flex mt-4 justify-center">
        <FaPlusCircle className="mr-2" />
        <span>Nuevo</span>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-3 gap-3 justify-center ">
        {userPosts.map((post, index) => (
          <img key={index} src={post} alt={`Post ${index}`} className="w-80" />
        ))}
      </div>
    </div>
  );
};

export default Profile;
