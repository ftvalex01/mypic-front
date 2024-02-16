/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/context/PostContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { postService } from '../services/postServices';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    fetchAllPosts();
  }, []);

  const uploadPost = async (formData) => {
    try {
      const response = await postService.uploadPost(formData);
      // Si la subida fue exitosa, recargamos la lista de posts
      if (response.success) {
        await fetchAllPosts();
      }
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  const likePost = async (postId) => {
    const data = await postService.likePost(postId);
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isLiked: data.liked, likesCount: data.likesCount };
      }
      return post;
    }));
  };

  const fetchAllPosts = async () => {
    try {
      const response = await postService.fetchAllPosts();
      setPosts(response); // Asumiendo que la respuesta del servidor es el array de posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const commentOnPost = async (postId, text) => {
    await postService.commentOnPost(postId, text);
   
  };

  const deleteComment = async (commentId) => {
    await postService.deleteComment(commentId);
  };

  const fetchAllPublicPosts = async () => {
    try {
      const response = await postService.fetchAllPublicPosts();
      return response.data; // Directamente retornamos los datos sin setear un estado que no usamos
    } catch (error) {
      console.error("Error fetching public posts:", error.message);
      return []; // Devolvemos un arreglo vacío en caso de error
    }
  };
  
  
  const likeComment = async (postId, commentId) => {
    try {
      const response = await postService.likeComment(postId, commentId);
      console.log("Comment liked:", response); // Aquí podrías actualizar el estado si es necesario
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <PostContext.Provider value={{ posts, uploadPost, likePost, fetchAllPosts, commentOnPost, deleteComment, fetchAllPublicPosts, likeComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);