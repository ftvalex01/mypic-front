import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import {
  FaRegCommentDots,
  FaRegHeart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Notifications = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // Opciones de filtro: 'all', 'likes', 'comments', 'follows'
  const {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    acceptFollowRequest,
    rejectFollowRequest,
  } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotifications();
        // Asigna a cada notificación un nuevo campo para indicar si es nueva basado en la propiedad `read`
        const modifiedNotifications = fetchedNotifications.data.map(
          (notification) => ({
            ...notification,
            isNew: !notification.read,
          })
        );
        setNotifications(modifiedNotifications);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    fetchNotifications();
  }, [getNotifications]);
  const handleAcceptFollowRequest = async (notificationId) => {
    try {
      const data = await acceptFollowRequest(notificationId);
      setMessage(
        data.message || "Solicitud de seguimiento aceptada con éxito."
      );
      // Opcional: Actualizar el estado de las notificaciones aquí para reflejar el cambio
    } catch (error) {
      setError("No se pudo aceptar la solicitud de seguimiento.");
    }
  };

  // Modifica la función de manejo para rechazar solicitudes
  const handleRejectFollowRequest = async (notificationId) => {
    try {
      const data = await rejectFollowRequest(notificationId);
      setMessage(
        data.message || "Solicitud de seguimiento rechazada con éxito."
      );
      // Opcional: Actualizar el estado de las notificaciones aquí para reflejar el cambio
    } catch (error) {
      setError("No se pudo rechazar la solicitud de seguimiento.");
    }
  };
  // Manejar el evento onMouseEnter para marcar la notificación como leída
  const handleMouseEnter = async (notificationId) => {
    try {
      // Llamamos a la función del contexto que actualiza la notificación a leída
      await markNotificationAsRead(notificationId);
      // Actualizamos el estado de la notificación en la interfaz de usuario
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // Manejar el clic en la notificación para navegar al post relacionado
  const handleNotificationClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsReadHandler = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
          isNew: false,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Filtrar las notificaciones basadas en el tipo
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.type === filter;
  });

  // Manejar el cambio de filtro
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  console.log(filteredNotifications);
  return (
    <div className="notifications-container max-w-lg mx-auto mt-4 bg-white shadow rounded-lg">
      {/* Encabezado y botón para marcar todas como leídas */}
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
        <button
          onClick={markAllAsReadHandler}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaCheckCircle className="mr-1" /> Marcar todas como leídas
        </button>
      </div>
      {/* Botones de filtro */}
      <div className="flex justify-around p-4">
        <button
          onClick={() => handleFilterChange("all")}
          className={`filter-btn ${filter === "all" ? "active-filter" : ""}`}
        >
          Todos
        </button>
        <button
          onClick={() => handleFilterChange("reaction")}
          className={`filter-btn ${filter === "likes" ? "active-filter" : ""}`}
        >
          Likes
        </button>
        <button
          onClick={() => handleFilterChange("comments")}
          className={`filter-btn ${
            filter === "comments" ? "active-filter" : ""
          }`}
        >
          Comentarios
        </button>
        <button
          onClick={() => handleFilterChange("follows")}
          className={`filter-btn ${
            filter === "follows" ? "active-filter" : ""
          }`}
        >
          Seguidores
        </button>
      </div>
      {/* Listado de notificaciones */}
      <div className="p-4">
        {filteredNotifications.length > 0 ? (
          <>
            <div className="recent-notifications">
              <h3>Este mes</h3>
              {filteredNotifications.map((notification) => {
                if (notification.isNew) {
                  return (
                    <div
                      key={notification.id}
                      onMouseEnter={() => handleMouseEnter(notification.id)}
                      onClick={() =>
                        handleNotificationClick(notification.post_id)
                      }
                      className={`notification-item ${
                        notification.read ? "read" : "bg-blue-50"
                      } p-4 mb-2 flex items-start rounded-lg cursor-pointer hover:bg-gray-100`}
                    >
                      <div className="notification-icon mr-3 text-lg">
                        {notification.type === "reaction" && (
                          <FaRegHeart className="text-red-500" />
                        )}
                        {notification.type === "comment" && (
                          <FaRegCommentDots className="text-blue-500" />
                        )}
                        {notification.type === "follow_request" && (
                          <>
                            <p className="text-sm text-gray-600">
                              {notification.related_user.name} quiere seguirte.
                            </p>
                            <div className="flex space-x-2">
                              <button
                                className="text-green-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptFollowRequest(notification.id);
                                }}
                              >
                                Aceptar
                              </button>
                              <button
                                className="text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectFollowRequest(notification.id);
                                }}
                              >
                                Rechazar
                              </button>
                              <div>
                                {message && <div>{message}</div>}
                                {error && <div>{error}</div>}
                              </div>
                            </div>
                          </>
                        )}
                        {/* FaUserPlus debe ser importado si vas a usarlo */}
                        {/* Añadir más iconos o lógica de visualización según los tipos de notificación que tengas */}
                      </div>
                      <div className="notification-content flex-1">
                        <h4 className="font-bold text-gray-800">
                          {notification.related_user.name} {notification.action}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      {notification.read ? (
                        <FaCheckCircle className="text-gray-300 text-lg ml-auto pl-4 cursor-pointer" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-lg ml-auto pl-4 cursor-pointer" />
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className="older-notifications">
              <h3>Anteriores</h3>
              {filteredNotifications.map((notification) => {
                if (!notification.isNew) {
                  return (
                    <div
                      key={notification.id}
                      onMouseEnter={() => handleMouseEnter(notification.id)}
                      onClick={() =>
                        handleNotificationClick(notification.post_id)
                      }
                      className={`notification-item ${
                        notification.read ? "read" : ""
                      } p-4 mb-2 flex items-start rounded-lg cursor-pointer hover:bg-gray-100`}
                    >
                      <div className="notification-icon mr-3 text-lg">
                        {notification.type === "reaction" && (
                          <FaRegHeart className="text-red-500" />
                        )}
                        {notification.type === "comment" && (
                          <FaRegCommentDots className="text-blue-500" />
                        )}
                        {notification.type === "follow_request" && (
                          <>
                            <p className="text-sm text-gray-600">
                              {notification.related_user.name} quiere seguirte.
                            </p>
                            <div className="flex space-x-2">
                              <button
                                className="text-green-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptFollowRequest(notification.id);
                                }}
                              >
                                Aceptar
                              </button>
                              <button
                                className="text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectFollowRequest(notification.id);
                                }}
                              >
                                Rechazar
                              </button>
                              <div>
                                {message && <div>{message}</div>}
                                {error && <div>{error}</div>}
                              </div>
                            </div>
                          </>
                        )}
                        {/* Añadir más iconos o lógica de visualización según los tipos de notificación que tengas */}
                      </div>
                      <div className="notification-content flex-1">
                        <h4 className="font-bold text-gray-800">
                          {notification.related_user.name} {notification.action}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      {notification.read ? (
                        <FaCheckCircle className="text-gray-300 text-lg ml-auto pl-4 cursor-pointer" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-lg ml-auto pl-4 cursor-pointer" />
                      )}
                    </div>
                    
                  );
                }
                return null;
              })}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            No tienes nuevas notificaciones.
          </p>
        )}
      </div>
    </div>
  );
};
export default Notifications;
