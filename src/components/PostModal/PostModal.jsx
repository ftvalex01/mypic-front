import React, { useState } from "react";
import ReactDOM from "react-dom";
import './PostModal.css';
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { IoHeartSharp } from "react-icons/io5";
import { usePostContext } from "../../context/PostContext";
import { useUserContext } from "../../context/UserContext"; // Importa el contexto del usuario

const PostModal = ({ isOpen, onClose, post }) => {

    const { commentOnPost, deleteComment, likePost, likeComment } = usePostContext();
    const { user } = useUserContext(); // Usa el contexto del usuario para acceder al usuario actual
    const [newCommentText, setNewCommentText] = useState("");
    const [comments, setComments] = useState(post?.comments || []);
    const baseUrl = import.meta.REACT_APP_API_URL || "http://localhost:8000";

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            const newComment = await commentOnPost(post.id, newCommentText);
            if (newComment && newComment.data) {
                setComments([...comments, { ...newComment.data, user: { username: "Tú" } }]); // Ajusta según la respuesta de tu backend
                setNewCommentText("");
            }
        } catch (error) {
            console.error("Error al enviar comentario:", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await likeComment(post.id, commentId);
            // Actualiza el estado local si es necesario para reflejar el cambio de "Me gusta"
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

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex">
                    {/* Contenedor de la imagen */}
                    <div className="flex-none">
                    <img src={`${baseUrl}` + post.url} alt="Post" className="object-cover modal-image" />

                    </div>

                    {/* Contenedor de los comentarios */}
                    <div className="flex-grow p-4"> {/* Ajusta el maxWidth según tu preferencia */}
                        <h1>Comentarios</h1>
                        <div className="comments-container overflow-y-auto" > {/* Ajusta el maxHeight según tu preferencia */}
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
                        {/* Formulario para nuevos comentarios */}
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
