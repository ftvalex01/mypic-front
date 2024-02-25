// src/services/postServices.js
import axios from '../api/axios';

export const postService = {
  uploadPost: async (formData) => {
    const response = await axios.post("/api/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response)
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
    if (response.data && (response.status === 200 || response.status === 201)) {
      return response.data; // Asegúrate de devolver la parte correcta de la respuesta
    } else {
      throw new Error('Error al enviar comentario');
    }
  },

  fetchAllPublicPosts: async (page = 1) => {
    const response = await axios.get(`/api/explore?page=${page}`);
    return response.data; // Asume que tu API devuelve los datos en este formato
  },

  fetchAllRecommendedPosts: async (page = 1) => {
    const response = await axios.get(`/api/explore/recommended?page=${page}`);
    return response.data; // Asume que tu API devuelve los datos en este formato
  },


  likeComment: async (postId, commentId) => {

    const response = await axios.post(`/api/posts/${postId}/comments/${commentId}/likes`);
    console.log(response)
    return response.data; // L  a respuesta del backend tras dar "me gusta" a un comentario
  },

  deleteComment: async (commentId) => {

    await axios.delete(`/api/comments/${commentId}`);
  },


  fetchAllCommentsForPost: async (postId) => {
    const response = await axios.get(`/api/profile/posts/${postId}/comments`);
    return response.data; // Suponiendo que la API devuelve directamente un array de comentarios
  },
  
  deletePost: async (postId) => {
    const response = await axios.delete(`/api/post/${postId}`);
   
    return response.data; // O maneja la respuesta como sea apropiado
  },
  
  pinPost: async (postId) => {
    const response = await axios.patch(`/api/post/${postId}/pin`);
    return response.data;

  },
};
