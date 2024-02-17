// src/services/postServices.js
import axios from '../api/axios';

export const postService = {
  uploadPost: async (formData) => {
    const response = await axios.post("/api/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Asegúrate de que devuelves un indicador de éxito o el post creado
    return response.data; // { success: true, post: { ... } }
  },

  likePost: async (postId) => {
  
    const response = await axios.post(`/api/post/${postId}/reactions`, {
      reactable_id: postId,
      reactable_type: 'Post',
    });
    return response.data;
  },

  fetchAllPosts: async (page = 1) => {
    const response = await axios.get(`/api/post?page=${page}`);
    return response.data; // Asegúrate de ajustar esto según la estructura de tu respuesta
  },

  commentOnPost: async (postId, text) => {
  const response = await axios.post(`/api/post/${postId}/comments`, { text });
  return response.data;
},

  fetchAllPublicPosts: async (page = 1) => { // Añade un parámetro de página con un valor por defecto
    const response = await axios.get(`/api/explore?page=${page}`);
    return response.data; // Este objeto debería incluir tanto los posts como la información de paginación
  },

  likeComment: async (postId, commentId) => {

    const response = await axios.post(`/api/posts/${postId}/comments/${commentId}/likes`);
    return response.data; // La respuesta del backend tras dar "me gusta" a un comentario
  },

  deleteComment: async (commentId) => {

    await axios.delete(`/api/comments/${commentId}`);
  },
};
