/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { postService } from "../services/postServices";
import useAuthContext from "./AuthContext"; // Asegúrate de que la ruta de importación sea correcta

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthContext(); // Extrae el estado del usuario
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const fetchAllPosts = useCallback(async () => {
    if (!user || !hasMore) return; // No realiza llamadas si no hay usuario o no hay más posts por cargar
    try {
      const response = await postService.fetchAllPosts(page);
      const postsFromResponse = response.data; // Asigna los nuevos posts desde la respuesta

      if (postsFromResponse.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          // Crea un nuevo conjunto de posts para asegurar la unicidad
          const postsById = new Map(prevPosts.map((post) => [post.id, post]));
          postsFromResponse.forEach((post) => postsById.set(post.id, post));
          return Array.from(postsById.values());
        });
        setPage((prevPage) => prevPage + 1); // Incrementa la página para la próxima carga
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [user, page]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);


  const fetchAllRecommendedPosts = useCallback(async (page) => {
    if (!user) return;
    try {
      const response = await postService.fetchAllRecommendedPosts(page);

      return response.data
    } catch (error) {
      console.error("Error fetching recommended posts:", error.message);
    }
  }, [user, page, hasMore]);


     

  const uploadPost = useCallback(async (formData) => {
    if (!user) return;
    try {
      const response = await postService.uploadPost(formData);
      if (response && response.data) {
        const newPost = response.data;
        console.log("Nuevo post:", newPost);
        setPosts(prevPosts => [newPost, ...prevPosts]);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  }, [user, setPosts]);
  

  const likePost = useCallback(
    async (postId) => {
      if (!user) return;
      try {
        await postService.likePost(postId);
        await fetchAllPosts();
      } catch (error) {
        console.error("Error liking post:", error);
      }
    },
    [fetchAllPosts, user]
  );

  const commentOnPost = useCallback(
    async (postId, text) => {
      if (!user) return null; // Cambia para devolver null en caso de que no haya usuario
      try {
        const response = await postService.commentOnPost(postId, text);
        return response; // Devuelve la respuesta que contiene el comentario creado
      } catch (error) {
        console.error("Error commenting on post:", error);
        return null; // Devuelve null en caso de error para manejar este caso en el componente
      }
    },
    [user]
  );

  const deleteComment = useCallback(
    async (commentId) => {
      if (!user) return;
      try {
        await postService.deleteComment(commentId);
        await fetchAllPosts();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
    [fetchAllPosts, user]
  );

  // Dentro de tu contexto, ajusta la función para aceptar y pasar el número de página
  const fetchAllPublicPosts = async (page) => {

    try {
      const response = await postService.fetchAllPublicPosts(page);
      return response.data; // Asegúrate de que esto coincida con la estructura de tu respuesta
    } catch (error) {
      console.error("Error fetching public posts:", error.message);
      return []; // Devolvemos un arreglo vacío en caso de error
    }
  };



  const deletePost = useCallback(
    async (postId) => {
      if (!user) return;
      try {
        await postService.deletePost(postId);
        // Opcional: Actualizar el estado local de posts aquí si es necesario,
        // por ejemplo, filtrando el post eliminado del arreglo de posts.
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [user, setPosts]
  );

  const pinPost = useCallback(
    async (postId) => {
      if (!user) return;
      try {
        const updatedPost = await postService.pinPost(postId);
    

        // Opcional: Actualizar el estado local de posts aquí si es necesario,
        // por ejemplo, actualizando el post específico a permanente.
        return updatedPost.data;
      } catch (error) {
        console.error("Error pinning post:", error);
      }
    },
    [user, setPosts]
  );
  const likeComment = useCallback(
    async (postId, commentId) => {
      console.log(postId,commentId)
      if (!user) return;
      try {
        
        const response = await postService.likeComment(postId, commentId);
     
        return response; // Devuelve la respuesta para poder usarla en el componente
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    },
    [user]
  );


  const fetchCommentsForPost = useCallback(async (postId) => {
    try {
      const comments = await postService.fetchAllCommentsForPost(postId);
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return []; // Devuelve un arreglo vacío en caso de error
    }
  }, []);

  const value = {
    posts,
    uploadPost,
    likePost,
    fetchAllPosts,
    deletePost,
    pinPost,
    fetchAllPublicPosts,
    fetchAllRecommendedPosts,
    commentOnPost,
    deleteComment,
    likeComment,
    fetchCommentsForPost
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostContext = () => useContext(PostContext);
