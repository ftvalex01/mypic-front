/* eslint-disable react/prop-types */
// NotificationItem.js

import { useNavigate } from "react-router-dom";
import { FaRegCommentDots, FaRegHeart, FaUserPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSocialInteractions } from "../context/SocialInteractionContext";

const NotificationItem = ({ notification, onMouseEnter }) => {
  const { acceptFollowRequest, rejectFollowRequest } = useSocialInteractions();
  const navigate = useNavigate();

  const renderIcon = () => {
    switch (notification.type) {
      case "reaction":
        return <FaRegHeart className="text-red-500" />;
      case "comment":
        return <FaRegCommentDots className="text-blue-500" />;
      case "follow_request":
        return <FaUserPlus className="text-green-500" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    await acceptFollowRequest(notification.id);
    // Aquí podrías llamar a una función prop para refrescar las notificaciones en el componente padre
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    await rejectFollowRequest(notification.id);
    // Aquí podrías llamar a una función prop para refrescar las notificaciones en el componente padre
  };

  return (
    <div
      className={`notification-item ${notification.read ? "read" : "bg-blue-50"} p-4 mb-2 flex items-start rounded-lg cursor-pointer hover:bg-gray-100`}
      onMouseEnter={() => onMouseEnter(notification.id)}
      onClick={handleClick}
    >
      <div className="notification-icon mr-3 text-lg">{renderIcon()}</div>
      <div className="notification-content flex-1">
        <h4 className="font-bold text-gray-800">
          {notification.related_user.name} {notification.action}
        </h4>
        <p className="text-sm text-gray-600">{notification.message}</p>
      </div>
      {notification.type === "follow_request" && !notification.read && (
        <div className="ml-auto flex items-center space-x-2">
          <button onClick={handleAccept} className="text-green-500 hover:text-green-700">
            <FaCheckCircle />
          </button>
          <button onClick={handleReject} className="text-red-500 hover:text-red-700">
            <FaTimesCircle />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
