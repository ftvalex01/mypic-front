/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom/";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [posts, setPosts] = useState([]);


  const navigate = useNavigate();

  const csrf = () => axios.get("http://localhost:8000/sanctum/csrf-cookie");

  const getUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/user");
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  const login = async ({ ...data }) => {
    await csrf();
    setErrors([]);
    try {
      await axios.post("/api/login", data);
      await getUser();
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error during login:", error.message);
        setErrors({
          general: [
            "An unexpected error occurred during login. Please try again.",
          ],
        });
      }
    }
  };

  const register = async ({ ...data }) => {
    await csrf();
    setErrors([]);
    try {
      await axios.post("/api/register", data);
      await getUser();
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error during registration:", error.message);
        setErrors({
          general: [
            "An unexpected error occurred during registration. Please try again.",
          ],
        });
      }
    }
  };

  const forgotPassword = async (email) => {
    await csrf();
    setErrors([]);
    try {
      const response = await axios.post("/api/forgot-password", { email });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 422 || error.response.status === 429)
      ) {
        setErrors(
          error.response.data.errors || { email: [error.response.data.message] }
        );
      } else {
        console.error("Error during password reset request:", error.message);
        setErrors({
          general: ["An unexpected error occurred. Please try again."],
        });
      }
      throw error;
    }
  };

  const resetPassword = async (
    { email, token, password, password_confirmation },
    onSuccess
  ) => {
    await csrf();
    setErrors([]);
    try {
      const response = await axios.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });
      setTimeout(() => {
        onSuccess(response.data);
      }, 2000);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 422 || error.response.status === 429)
      ) {
        setErrors(
          error.response.data.errors || { email: [error.response.data.message] }
        );
      } else {
        console.error("Error during password reset:", error.message);
        setErrors({
          general: ["An unexpected error occurred. Please try again."],
        });
      }
      throw error;
    }
  };
  const updateProfile = async (formData) => {
    await csrf();
    setErrors([]);
    try {
      const response = await axios.post(`/api/user/${user.data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUser = response.data;

      setUser(updatedUser); // Actualizar el usuario en el contexto
      navigate("/profile"); // Redirigir al perfil o donde sea apropiado
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error during profile update:", error.message);
        setErrors({
          general: [
            "An unexpected error occurred during profile update. Please try again.",
          ],
        });
      }
    }
  };
  const uploadPost = async (formData) => {
    await csrf();
    try {
      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error during post upload:", error.message);
      throw error;
    }
  };
  const getUserImages = async (userId) => {
    await csrf();
    try {
      const response = await axios.get(`/api/user/${userId}/images`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user images:", error.message);
      throw error;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('api/users'); // Actualiza esta línea para usar la nueva ruta

      return response.data;
    } catch (error) {
      console.error("Error while fetching all users:", error.message);
      throw error;
    }
  };
  const verifyEmail = async (email) => {
    try {
      const response = await axios.get(`/api/verify-email/${email}`);
      return response.data.available; // Suponiendo que el backend devuelve un objeto con una propiedad 'available' que indica si el correo electrónico está disponible o no
    } catch (error) {
      console.error("Error verifying email:", error.message);
      throw error;
    }
  };

  const fetchUserByUsername = async (username) => {
    try {
      const response = await axios.get(`api/user/${username}`); // Actualiza esta línea para usar la nueva ruta

      return response.data;
    } catch (error) {
      console.error("Error while fetching all users:", error.message);
      throw error;
    }
  };

  const followUser = async (userId) => {
    await csrf();
    try {
      const response = await axios.post(`http://localhost:8000/api/user/${userId}/follow`);
      // Suponiendo que tu endpoint devuelve el estado actualizado de seguimiento (seguido o no seguido)
      return response.data;
    } catch (error) {
      console.error("Error during follow/unfollow action:", error.message);
      throw error;
    }
  };

  const getFollowData = async (userId) => {
    try {
      const response = await axios.get(`/api/user/${userId}/follow-data`);

      return response.data;
    } catch (error) {
      console.error("Error fetching follow data:", error);
      throw error;
    }
  };

  const likePost = async (postId) => {

    await csrf();
    try {
      const response = await axios.post(`/api/post/${postId}/reactions`, {
        reactable_id: postId,
        reactable_type: 'Post' // Asegúrate de que el backend pueda interpretar correctamente este tipo
      });
      // Supongamos que la respuesta incluye el estado actualizado del like y el conteo total de likes
      const { liked, likesCount } = response.data;

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          // Actualizamos el post con la nueva información
          return { ...post, isLiked: liked, likesCount: likesCount };
        }
        return post;
      });

      setPosts(updatedPosts); // Actualizamos el estado global de los posts

    } catch (error) {
      console.error("Error during post like:", error.message);
      throw error;
    }
  };

  const commentOnPost = async (postId, text) => {
    // Para asegurarte de que los valores son correctos
    await csrf(); // Obtiene el token CSRF para la petición

    try {
      const commentDate = new Date().toISOString(); // Genera la fecha actual en formato ISO 8601
      const response = await axios.post(`/api/post/${postId}/comments`, {
        text: text,
        comment_date: commentDate, // Incluye la fecha del comentario
      });

      response.data;
      console.log('Comment created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error during post comment:", error.message);
      throw error;
    }
  };


  const fetchAllPosts = async () => {
    await csrf();
    try {
      const response = await axios.get('/api/post');
      const posts = response.data.data;  // Asegúrate de que esta ruta coincida con la configurada en tu backend
      return posts; // Esta será una lista de posts
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      throw error;
    }
  };
  const likeComment = async (postId, commentId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comments/${commentId}/likes`);
      // Aquí podrías actualizar el estado con la respuesta del backend si es necesario
      console.log(response.data); // Suponiendo que el backend responde con algún dato relevante
    } catch (error) {
      console.error('Error al dar like al comentario:', error);
    }
  };

  const updateProfilePrivacy = async (isPrivate) => {
    await csrf();
    try {
      const response = await axios.patch(`/api/user/${user.data.id}/privacy`, { isPrivate });
      setUser({ ...user, data: { ...user.data, isPrivate: response.data.isPrivate } });
    } catch (error) {
      console.error("Error updating profile privacy:", error.message);
    }
  };


  const deleteComment = async (commentId) => {
    await csrf();
    try {
      await axios.delete(`/api/comments/${commentId}`);
      // Puedes agregar lógica aquí si necesitas actualizar algo en el estado global después de borrar un comentario
      console.log(`Comment ${commentId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getNotifications = async () => {
    await csrf();
    try {
      const response = await axios.get("/api/notifications"); // Asume este endpoint
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      throw error;
    }
  };



  const logout = async () => {
    try {
      await axios.post("/api/logout");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        errors,
        getUser,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        uploadPost,
        getUserImages,
        updateProfilePrivacy,
        fetchAllUsers,
        fetchUserByUsername,
        followUser,
        getFollowData,
        likePost,
        verifyEmail,
        commentOnPost,
        fetchAllPosts,
        likeComment,
        deleteComment,
        getNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
