/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { IoHeartSharp } from "react-icons/io5";
import useAuthContext from "../context/AuthContext";

const PostCard = ({ post }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(
    post.reactions ? post.reactions.length : 0
  );
  const { likePost, commentOnPost, user, likeComment, deleteComment } =
    useAuthContext();
  const baseUrl = "http://localhost:8000";
  const [remainingHours, setRemainingHours] = useState(null);

  useEffect(() => {
    const calculateRemainingHours = () => {
      const publishDate = new Date(post.publish_date * 1000);
      const currentDate = new Date();
      const differenceInHours = Math.abs(currentDate - publishDate) / 36e5;
      const remaining = post.life_time - differenceInHours;

      return remaining > 0 ? Math.floor(remaining) : 0;
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
      setComments(currentComments => currentComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error al intentar borrar el comentario:", error);
    }
  };
  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(post.id, commentId);
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, isLiked: !comment.isLiked, likesCount: comment.isLiked ? comment.likesCount - 1 : comment.likesCount + 1 };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error al intentar dar like al comentario:', error);
    }
  };
  
  

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const response = await commentOnPost(post.id, commentText);
      setComments(prevComments => [...prevComments, response.data]);
      setCommentText("");
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };
  
console.log(comments)
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto my-5">
      {/* Post Header */}
      <div className="flex items-center space-x-3 p-4 border-b">
        <img
          src={post.user.profile_picture || "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}
          alt={post.user.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold">{post.user.username}</h2>
          <p className="text-sm text-gray-500">{remainingHours}h restantes</p>
        </div>
      </div>

      {/* Post Image */}
      {post.media && (
        <img
          src={`${baseUrl}${post.media.url}`}
          alt={post.description}
          className="w-full object-cover"
          style={{ maxHeight: "500px" }}
        />
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center p-4">
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
        </div>
      </div>

      {/* Post Comments & Comment Input */}
      <div className="px-4 pb-2">
      {comments.map((comment) => (
        <div key={comment.id} className="comment my-2">
    <p>{comment.text} - <span>by {user.data.name}</span></p>
    <div className="comment-actions">
      <button onClick={() => handleLikeComment(comment.id)}>
        {comment.isLiked ? (
          <IoHeartSharp className="w-6 h-6 text-red-500" />
        ) : (
          <FiHeart className="w-6 h-6 text-gray-500" />
        )}
      </button>
      
      {(user && user.data.id === comment.user_id) && (
        <button onClick={() => handleDelete(comment.id)}>
          <FiTrash2 className="icon" />
        </button>
      )}
    </div>
  </div>
))}

      </div>

      <form className="p-4" onSubmit={handleSubmitComment}>
        <input
          type="text"
          className="w-full rounded-full border p-2 text-sm"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="text-blue-500 text-sm font-semibold mt-2"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostCard;
