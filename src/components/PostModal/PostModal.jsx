/* eslint-disable react/prop-types */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import './PostModal.css';
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { IoHeartSharp } from "react-icons/io5";
import { usePostContext } from "../../context/PostContext";
import { useUserContext } from "../../context/UserContext";
import { Link } from 'react-router-dom';

const PostModal = ({ isOpen, onClose, post }) => {
    const { commentOnPost, deleteComment, likePost, likeComment } = usePostContext();
    const { user } = useUserContext();
    const [newCommentText, setNewCommentText] = useState("");
    const [comments, setComments] = useState(post?.comments || []);
    const baseUrl = import.meta.REACT_APP_API_URL || "http://localhost:8000";
    console.log(post)
    console.log(user)
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            const newComment = await commentOnPost(post.id, newCommentText);
            if (newComment && newComment.data) {
                setComments([...comments, { ...newComment.data, user: { username: "Tú" } }]);
                setNewCommentText("");
            }
        } catch (error) {
            console.error("Error al enviar comentario:", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await likeComment(post.id, commentId);
            // Opcional: Actualiza el estado local para reflejar el cambio de "Me gusta"
        } catch (error) {
            console.error("Error al dar 'Me gusta' al comentario:", error);
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
                <div className="flex">
                    <div className="flex-none">
                        <img src={imageSrc} alt="Post" className="object-cover modal-image" />
                    </div>
                    <div className="flex-grow p-4">
                        {/* Enlace al perfil del usuario */}

                        <Link
                            to={user && post.user_id === user.data.id ? `/profile` : `/profile/${post.user?.username || post.user_id}`}
                            className="user-profile-link"
                        >
                            <h2>{post.user?.username || ''}</h2>
                        </Link>
                        <h1>Comentarios</h1>
                        <div className="comments-container overflow-y-auto">
                            {comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <strong>{comment.user.username || comment.user.name}:</strong> {comment.text}
                                    <div>
                                        <button onClick={() => handleLikeComment(comment.id)}>
                                            {comment.isLiked ? <IoHeartSharp /> : <FiHeart />}
                                        </button>
                                        {user && user.data.id === comment.user_id && (
                                            <button onClick={() => handleDeleteComment(comment.id)}>
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmitComment}>
                            <input
                                type="text"
                                placeholder="Añade un comentario..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                className="w-full p-2"
                            />
                            <button type="submit" className="p-2">Comentar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default PostModal;
