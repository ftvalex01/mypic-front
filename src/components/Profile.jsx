import { useEffect, useState } from "react";
import { FaCog, FaPlusCircle, FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useSocialInteractions } from "../context/SocialInteractionContext";
import { usePostContext } from "../context/PostContext";
import BlockModal from "./BlocksModal/BlockModal"; // Asume que este es tu componente de Modal correcto
import PostModal from "./PostModal/PostModal";
const Profile = () => {
  const { user, getUserImages, updateProfilePrivacy } = useUserContext();
  const { getFollowData, getBlockedUsers, unblockUser } = useSocialInteractions();
  const { fetchCommentsForPost } = usePostContext();
  const [userImages, setUserImages] = useState([]);
  const [followData, setFollowData] = useState({ followers: 0, following: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [isProfilePrivate, setIsProfilePrivate] = useState(user?.data?.isPrivate || false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false); // Estado para la visibilidad del modal
  const [comments, setComments] = useState([]);

  const baseUrl = import.meta.REACT_APP_BASE_URL || "http://localhost:8000";

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
    const loadPosts = async () => {
      const newPosts = await fetchPosts(); // Asume que esta función recupera los posts
      setPosts(newPosts);
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
    const handleSelectPost = (postId) => {
      const post = posts.find((p) => p.id === postId);
      setSelectedPost(post);
    };
    const fetchBlockedUsers = async () => {
      const data = await getBlockedUsers();
      setBlockedUsers(data);
    };

    fetchUserImages();
    fetchFollowData();
    fetchBlockedUsers();
  }, [user, getUserImages, getFollowData, getBlockedUsers]);

  const toggleProfilePrivacy = async () => {
    const newPrivacySetting = !isProfilePrivate;
    setIsProfilePrivate(newPrivacySetting);
    await updateProfilePrivacy(user.data.id, newPrivacySetting); // Asegúrate de pasar el ID del usuario y el nuevo estado de privacidad
    setShowSettings(false);
  };

  const handleUnblockUser = async (userId) => {
    await unblockUser(userId);
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
  };
  const openPostModal = async (post) => {
    try {
      const comments = await fetchCommentsForPost(post.id);
      setSelectedPost({ ...post, comments }); // Asume que `post` ya contiene la URL de la imagen y otros datos necesarios.
      setIsPostModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Función para cerrar el modal
  const closePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };
  const profilePicture = user?.data.profile_picture || "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";

  console.log("Modal Open:", isPostModalOpen, "Selected Post:", selectedPost);

  return (
    <div className="pt-16 flex-1 flex flex-col overflow-auto">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <img
            src={profilePicture}
            alt="Profile"
            className="rounded-full w-20 h-20 md:w-40 md:h-40"
          />
          <div className="md:ml-10 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <div className="flex flex-wrap space-x-4 mt-4">
              <Link to="edit" className="btn">Editar perfil</Link>
              <button className="btn" onClick={() => setShowSettings(!showSettings)}>
                <FaCog />
              </button>
              {showSettings && (
                <div className="settings-dropdown">
                  <button onClick={toggleProfilePrivacy}>
                    {isProfilePrivate ? "Hacer perfil público" : "Hacer perfil privado"}
                  </button>
                  <button onClick={() => setIsBlockedUsersModalOpen(true)}>Ver usuarios bloqueados</button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <span>{userImages.length} publicaciones</span>
              <span>{followData.followers} seguidores</span>
              <span>{followData.following} seguidos</span>
            </div>
            <p className="mt-2">{user?.bio}</p>
          </div>
        </div>

        <div className="flex mt-4 justify-center md:justify-start">
          <FaPlusCircle className="mr-2" />
          <span>Nuevo</span>
        </div>

        <hr className="my-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userImages.map((image, index) => (
            <div key={index} className="w-full h-64 overflow-hidden" onClick={() => openPostModal(image)}>
              <img src={`${baseUrl}${image.url}`} alt={`User Post ${index}`} className="w-full h-full object-cover cursor-pointer" />
            </div>
          ))}
        </div>
        {isPostModalOpen && (
          <PostModal isOpen={isPostModalOpen} onClose={closePostModal} post={selectedPost} />
        )}
      </div>
      <div id="modal-root"></div>


      <BlockModal isOpen={isBlockedUsersModalOpen} onClose={() => setIsBlockedUsersModalOpen(false)}>
        <h2>Usuarios Bloqueados</h2>
        <ul>
          {blockedUsers.map(user => (
            <li key={user.id} className="flex justify-between items-center">
              {user.username}
              <button onClick={() => handleUnblockUser(user.id)} className="btn">
                <FaUnlockAlt /> Desbloquear
              </button>
            </li>
          ))}
        </ul>
      </BlockModal>
    </div>


  );
};

export default Profile;
