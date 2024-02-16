// src/services/postServices.js
import axios from '../api/axios';

const csrf = async () => {
  await axios.get('/sanctum/csrf-cookie');
};

export const postService = {
  uploadPost: async (formData) => {
    await csrf();
    const response = await axios.post("/api/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Asegúrate de que devuelves un indicador de éxito o el post creado
    return response.data; // { success: true, post: { ... } }
  },

  likePost: async (postId) => {
    await csrf();
    const response = await axios.post(`/api/post/${postId}/reactions`, {
      reactable_id: postId,
      reactable_type: 'Post',
    });
    return response.data;
  },

  fetchAllPosts: async () => {
    await csrf();
    const response = await axios.get('/api/post');
    return response.data.data;
  },

  commentOnPost: async (postId, text) => {
    await csrf();
    const response = await axios.post(`/api/post/${postId}/comments`, {
      text,
      comment_date: new Date().toISOString(),
    });
    return response.data;
  },

  fetchAllPublicPosts: async () => {
    await csrf();
    const response = await axios.get('/api/explore');
    return response.data; // Asumiendo que esto devuelve el objeto completo, incluyendo data, links, y meta
  },

  likeComment: async (postId, commentId) => {
    await csrf();
    const response = await axios.post(`/api/posts/${postId}/comments/${commentId}/likes`);
    return response.data; // La respuesta del backend tras dar "me gusta" a un comentario
  },

  deleteComment: async (commentId) => {
    await csrf();
    await axios.delete(`/api/comments/${commentId}`);
  },
};
