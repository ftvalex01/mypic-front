import { useEffect, useState } from "react";

import BlockModal from "./BlocksModal/BlockModal"; // Asume que este es tu componente de Modal correcto
import PostModal from "./PostModal/PostModal";
import { FaCog, FaPlusCircle, FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { usePostContext } from "../context/PostContext";
import { useSocialInteractions } from "../context/SocialInteractionContext";
import { FiMoreHorizontal } from "react-icons/fi";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, getUserImages, updateProfilePrivacy } = useUserContext();
  const { getFollowData, getBlockedUsers, unblockUser } =
    useSocialInteractions();
  const { deletePost, pinPost, fetchCommentsForPost } = usePostContext();
  const [livePosts, setLivePosts] = useState([]); // Almacenar publicaciones vivas
  const [permanentPosts, setPermanentPosts] = useState([]); // Almacenar publicaciones permanentes
  const [followData, setFollowData] = useState({ followers: 0, following: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("postVivos");
  const [isProfilePrivate, setIsProfilePrivate] = useState(
    user?.data?.isPrivate || false
  );
  const [showMenu, setShowMenu] = useState({});

  const [isPostModalOpen, setIsPostModalOpen] = useState(false); // Estado para la visibilidad del modal

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false);

  const baseUrl = import.meta.REACT_APP_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUserImages = async () => {
      if (user && user.data.id) {
        try {
          const response = await getUserImages(user.data.id);

          setLivePosts(response.liveImages || []);
          setPermanentPosts(response.permanentImages || []);
        } catch (error) {
          console.error("Error fetching user images:", error);
        }
      }
    };
  

    const fetchFollowData = async () => {
      if (user && user.data.id) {
        try {
          const data = await getFollowData(user.data.id);
          setFollowData({
            followers: data.followersCount,
            following: data.followingCount,
          });
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      }
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
    setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
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
  const profilePicture =
    user?.data.profile_picture ||
    "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";

  const calculateGradientStyle = (lifeTime) => {
    if (lifeTime >= 24) {
      return { background: "none" }; // No aplicar efecto si life_time es 24 o más
    }
    const opacity = lifeTime / 24;
    // Gradiente de transparente a gris, ajustado basado en life_time
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `${(1 - opacity) * 100}%`,
      backgroundImage:
        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
    };
  };

  const handleDeletePost = async (postId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar post",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePost(postId);
          // Remueve el post del estado correspondiente
          if (activeTab === "postVivos") {
            setLivePosts(livePosts.filter((post) => post.post.id !== postId));
          } else {
            setPermanentPosts(
              permanentPosts.filter((post) => post.post.id !== postId)
            );
          }
          Swal.fire("Eliminado", "El post ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error eliminando el post:", error);
          Swal.fire("Error", "No se pudo eliminar el post.", "error");
        }
      }
    });
  };

  const handlePinPost = async (postId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Quieres hacer este post permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, hacer permanente",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedPost = await pinPost(postId);
          if (updatedPost) {
            // Filtra el post actualizado de livePosts
            const newLivePosts = livePosts.filter(
              (post) => post.post.id !== postId
            );
            setLivePosts(newLivePosts);

            // Construye transformedPost asegurándote de acceder a 'media' para 'type', 'url', y 'upload_date'
            const transformedPost = {
              id: updatedPost.id,
              user_id: updatedPost.user_id,
              type: updatedPost.media.type, // Accede a 'type' desde 'media'
              url: updatedPost.media.url, // Accede a 'url' desde 'media'
              upload_date: updatedPost.media.upload_date, // Accede a 'upload_date' desde 'media'
              post: {
                ...updatedPost,
                permanent: true, // Asegura que 'permanent' esté establecido en true
              },
            };

            // Añade el post transformado a permanentPosts
            setPermanentPosts((prevPosts) => [...prevPosts, transformedPost]);
            Swal.fire("Pineado", "El post ahora es permanente.", "success");
          }
        } catch (error) {
          console.error("Error pineando el post:", error);
          Swal.fire("Error", "No se pudo hacer permanente el post.", "error");
        }
      }
    });
  };

  const handleToggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Cambia el estado de visibilidad basado en el ID del post
    }));
  };

  const handlePostVivosTab = () => setActiveTab("postVivos");
  const handleMuroTab = () => setActiveTab("muro");

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
              <Link to="edit" className="btn">
                Editar perfil
              </Link>
              <button
                className="btn"
                onClick={() => setShowSettings(!showSettings)}
              >
                <FaCog />
              </button>
              {showSettings && (
                <div className="settings-dropdown">
                  <button onClick={toggleProfilePrivacy}>
                    {isProfilePrivate
                      ? "Hacer perfil público"
                      : "Hacer perfil privado"}
                  </button>
                  <button onClick={() => setIsBlockedUsersModalOpen(true)}>
                    Ver usuarios bloqueados
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <span className="mr-3">
                {livePosts.length + permanentPosts.length} publicaciones
              </span>
              <span className="mr-3">{followData.followers} seguidores</span>
              <span className="mr-3">{followData.following} seguidos</span>
              <span className="mr-3">
                Pins disponibles{user.data.available_pines}
              </span>
            </div>
            <p className="mt-2">{user?.bio}</p>
          </div>
        </div>

        <div className="flex mt-4 justify-center md:justify-start">
          <button
            className={`btn ${activeTab === "postVivos" ? "btn-active" : ""}`}
            onClick={handlePostVivosTab}
          >
            Post vivos
          </button>
          <button
            className={`btn ${activeTab === "muro" ? "btn-active" : ""}`}
            onClick={handleMuroTab}
          >
            Muro
          </button>
        </div>

        <hr className="my-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(activeTab === "postVivos" ? livePosts : permanentPosts).map(
            (post) => (
              <div
                key={post.post.id}
                className="w-full h-64 overflow-hidden relative"
                onClick={() => openPostModal(post)}
              >
                <img
                  src={`${baseUrl}${post.url}`}
                  alt="Post"
                  className="w-full h-full object-cover cursor-pointer"
                />
                {!post.post.permanent && (
                  <div
                    style={{ ...calculateGradientStyle(post.post.life_time) }}
                  ></div>
                )}
                {!post.post.permanent && (
                  <div className="absolute top-3 left-0 w-full flex items-center justify-center text-white font-bold p-2">
                    {post.post.life_time}h restantes
                  </div>
                )}
                {user && user.data.id === post.user_id && (
                  <FiMoreHorizontal
                    className="cursor-pointer absolute top-0 right-0 m-2" // Posiciona el ícono en la esquina superior derecha
                    onClick={() => handleToggleMenu(post.post.id)}
                  />
                )}
                {showMenu[post.post.id] && ( // Usa el ID del post para controlar la visualización del menú
                  <div className="absolute bg-white shadow-lg rounded-lg py-1 right-4 top-12 z-10">
                    <ul>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        onClick={() => handleDeletePost(post.post.id)}
                      >
                        Eliminar post
                      </li>
                      {!post.post.permanent &&
                        user &&
                        user.data.available_pines > 0 && ( // Solo muestra esta opción si el post no es permanente
                          <li
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                            onClick={() => handlePinPost(post.post.id)}
                          >
                            Pinear post
                          </li>
                        )}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </div>
        {isPostModalOpen && (
          <PostModal
            isOpen={isPostModalOpen}
            onClose={closePostModal}
            post={selectedPost}
          />
        )}
      </div>
      <div id="modal-root"></div>

      <BlockModal
        isOpen={isBlockedUsersModalOpen}
        onClose={() => setIsBlockedUsersModalOpen(false)}
      >
        <h2>Usuarios Bloqueados</h2>
        <ul>
          {blockedUsers.map((user) => (
            <li key={user.id} className="flex justify-between items-center">
              {user.username}
              <button
                onClick={() => handleUnblockUser(user.id)}
                className="btn"
              >
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
