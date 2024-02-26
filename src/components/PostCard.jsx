/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiTrash2,
} from "react-icons/fi";
import { IoHeartSharp } from "react-icons/io5";
import { usePostContext } from "../context/PostContext";
import { useUserContext } from "../context/UserContext"; // Asumiendo que necesitas datos del usuario para la autenticación y otras operaciones
import "./style.css";
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(
    post.reactions ? post.reactions.length : 0
  );
  const { likePost, commentOnPost, deleteComment, likeComment } =
    usePostContext();

  const { user } = useUserContext(); // Acceso a datos del usuario autenticado
  const baseUrl = import.meta.REACT_APP_API_URL || "http://localhost:8000"; // Utiliza variables de entorno para definir URLs base
  const [remainingHours, setRemainingHours] = useState(null);

  useEffect(() => {
    const calculateRemainingHours = () => {
      return post.life_time;
    };
    setRemainingHours(calculateRemainingHours());
  }, [post.publish_date, post.life_time]);

  const toggleLike = async () => {
    try {
      await likePost(post.id);
      setIsLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Error al dar like al post:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error al intentar borrar el comentario:", error);
    }
  };
  // Función para resaltar hashtags
const highlightHashtags = (text) => {
  // Expresión regular para encontrar hashtags
  const hashtagRegex = /#(\w+)/g;
  // Dividir el texto en partes y hashtags
  const parts = text.split(hashtagRegex);

  return parts.map((part, index) => {
    // Si la parte es un hashtag, devolvemos un span con una clase especial
    if (index % 2 === 1) {
      return (
        <span key={index} className="hashtag">
          #{part}
        </span>
      );
    }
    // Si no, devolvemos la parte del texto tal como está
    return part;
  });
};

  const handleLikeComment = async (commentId) => {
    try {
      // Espera la respuesta de la función likeComment del contexto
      const { likesCount, isLiked } = await likeComment(post.id, commentId);

      setComments((comments) =>
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: isLiked,
                likesCount: likesCount,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error al intentar dar like al comentario:", error);
    }
  };

  function calculateTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " años";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " meses";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " días";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " horas";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutos";
    }
    return Math.floor(seconds) + " segundos";
  }
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Evita enviar comentarios vacíos

    try {
      const newComment = await commentOnPost(post.id, commentText);
      if (newComment && newComment.data) {
        setComments((prevComments) => [...prevComments, newComment.data]); // Actualiza el estado de comentarios con el nuevo comentario
        setCommentText(""); // Limpia el campo de entrada después de enviar
      } else {
        console.error("No se pudo obtener una respuesta válida del servidor.");
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  return (
    <div className="bg-misty-rose rounded-lg shadow-lg max-w-md mx-auto my-5">
      {/* Post Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
          <Link  to={user && post.user_id === user.data.id ? `/profile` : `/profile/${post.user?.username || post.user_id}`} className="font-semibold hover:underline">
      {post.user.username}
    </Link>
            {/* Condición para mostrar las horas restantes si el post no es permanente */}
            {!post.permanent && (
              <p className="text-sm text-gray-500">
                {remainingHours}h restantes
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Post Image */}
      {post.media && (
        <img
          src={`${baseUrl}${post.media.url}`}
          alt={post.description || "imagen"}
          className="w-full object-cover"
          style={{ maxHeight: "500px" }}
        />
      )}

{post.description && (
  <p className="post-description">{highlightHashtags(post.description)}</p>
)}

      {/* Post Actions */}
      <div className="border-bottom flex justify-between items-center p-4">
        <div className="flex space-x-4">
          <button onClick={toggleLike}>
            {isLiked ? (
              <IoHeartSharp className="w-6 h-6 text-red-500" />
            ) : (
              <FiHeart className="w-6 h-6 text-gray-500" />
            )}
          </button>
          <span>{likesCount} Likes</span>
          <button>
            <FiMessageCircle className="w-6 h-6 text-gray-500" />
          </button>
          <span>{comments.length} comentarios</span>
        </div>
      </div>

      {/* Post Comments & Comment Input */}
      <div className="px-4 pb-2 comments-container ">
        {comments.map((comment) => (
          <div key={comment.id} className="comment my-2 flex justify-between">
            <div>
              <p className="comment-text">
                {comment.text} - <span>por {comment.user.username}</span>{" "}
                <span className="text-gray-400">
                  {calculateTimeAgo(new Date(comment.comment_date * 1000))}
                </span>
              </p>
              <div className="flex items-center">
                <button onClick={() => handleLikeComment(comment.id)}>
                  {comment.isLiked ? (
                    <IoHeartSharp className="w-6 h-6 text-red-500" />
                  ) : (
                    <FiHeart className="w-6 h-6 text-gray-500" />
                  )}
                </button>
                {/* Coloca el contador de likes justo al lado del icono del corazón */}
                <span className="ml-2">{comment.likesCount}</span>
              </div>
            </div>
            {/* Si el usuario es el autor del comentario, muestra el icono de basura a la derecha */}
            {user && user.data.id === comment.user_id && (
              <button onClick={() => handleDelete(comment.id)}>
                <FiTrash2 className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
        ))}
      </div>

      <form className="p-4 border-top" onSubmit={handleSubmitComment}>
        <input
          type="text"
          className="comment-input w-full  border p-2 text-sm"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="comment-submit-button text-sm font-semibold mt-2"
        >
          Enviar comentario
        </button>
      </form>
    </div>
  );
};

export default PostCard;
