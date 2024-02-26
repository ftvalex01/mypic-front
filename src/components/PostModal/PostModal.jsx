/* eslint-disable react/prop-types */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import './PostModal.css';
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { IoHeartSharp } from "react-icons/io5";
import { usePostContext } from "../../context/PostContext";
import { useUserContext } from "../../context/UserContext";
import { Link } from 'react-router-dom';
import './PostModal.css'
const PostModal = ({ isOpen, onClose, post }) => {
    const { commentOnPost, deleteComment, likeComment } = usePostContext();
    const { user } = useUserContext();
    const [newCommentText, setNewCommentText] = useState("");
    const [comments, setComments] = useState(post?.comments || []);
    const baseUrl = import.meta.REACT_APP_API_URL || "http://localhost:8000";
 
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            const newComment = await commentOnPost(post.id, newCommentText);
            if (newComment && newComment.data) {
                setComments([...comments, { ...newComment.data, user}]);
                setNewCommentText("");
            }
        } catch (error) {
            console.error("Error al enviar comentario:", error);
        }
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

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Error al borrar comentario:", error);
        }
    };

    const getPostImageUrl = (post) => {
        if (post.media && post.media.url.startsWith('/storage/uploads')) {
            return `${baseUrl}${post.media.url}`;
        } else if (post.url && post.url.startsWith('/storage/uploads')) {
            return `${baseUrl}${post.url}`;
        } else {
            return post.media?.url || post.url;
        }
    };

    const imageSrc = getPostImageUrl(post);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-icon" onClick={onClose}>X</button>
            <Link
                            to={user && post.user_id === user.data.id ? `/profile` : `/profile/${post.user?.username || post.user_id}`}
                            className="user-profile-link"
                        >
                            <h2>{post.user?.username || ''}</h2>
                        </Link>
                <div className="modal-body">
                    <img src={imageSrc} alt="Post" style={{ width: '100%', borderRadius: '10px' }} />
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="comment-content">
                                <div className="comment-author">{comment.user.username}</div>
                                <div className="comment-text">{comment.text}</div>
                                <div className="comment-actions">
                                    <button className="icon-button" onClick={() => handleLikeComment(comment.id)}>
                                        {comment.isLiked ? <IoHeartSharp /> : <FiHeart />}
                                    </button>
                                    {user && user.data.id === comment.user_id && (
                                        <button className="icon-button" onClick={() => handleDeleteComment(comment.id)}>
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <form onSubmit={handleSubmitComment}>
                        <input
                            type="text"
                            placeholder="Añade un comentario..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="comment-input"
                        />
                        <button  className="submit-comment">Enviar</button>
                    </form>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default PostModal;