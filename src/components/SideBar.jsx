import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { MdMessage, MdOutlineMoreHoriz } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLiveLine } from "react-icons/ri";
import UploadModal from "./UploadModal/UploadModal";
import BuscarPerfil from "./BuscarPerfil";
import useAuthContext from "../context/AuthContext";
import { useNotificationContext } from "../context/NotificationContext";
import {
  FaHome,
  FaSearch,
  FaRegCompass,
  FaRegHeart,
  FaPlusSquare,
} from "react-icons/fa";

const SideBar = () => {
  const { logout, user, isLoading } = useAuthContext();
  const { hasUnreadNotifications } = useNotificationContext(); // Asegúrate de que esto esté correctamente implementado en tu NotificationContext
  const [isSearchSidebarOpen, setSearchSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);
  const toggleSearchSidebar = () => setSearchSidebarOpen(!isSearchSidebarOpen);

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  if (!user) {
    return <div>No se encontró el usuario.</div>;
  }
  return (
    <>
      <aside className="hidden lg:flex flex-col bg-gray-700 fixed inset-y-0 left-0 z-30 w-64">
        <div className="flex flex-col space-y-6 p-4">
          <h1 className="text-3xl font-bold mb-4 text-white">MyPic</h1>
          <nav className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <FaHome className="text-lg" />
              <span>Inicio</span>
            </Link>
            <button
              onClick={toggleSearchSidebar}
              className="flex items-center space-x-2 text-white"
            >
              <FaSearch className="text-lg" />
              <span>Búsqueda</span>
            </button>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-white"
            >
              <FaRegCompass className="text-lg" />
              <span>Explorar</span>
            </Link>
            <Link
              to="/reels"
              className="flex items-center space-x-2 text-white"
            >
              <RiLiveLine className="text-lg" />
              <span>Reels</span>
            </Link>
            <Link
              to="/messages"
              className="flex items-center space-x-2 text-white"
            >
              <MdMessage className="text-lg" />
              <span>Mensajes</span>
            </Link>
            <Link
              to="/notifications"
              className="flex items-center space-x-2 text-white relative"
            >
              <FaRegHeart className="text-lg" />
              <span>Notificaciones</span>
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
              )}
            </Link>
            <button
              onClick={toggleModal}
              className="flex items-center space-x-2 text-white"
            >
              <FaPlusSquare className="text-lg" />
              <span>Crear</span>
            </button>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-white"
            >
              <CgProfile className="text-lg" />
              <span>{user?.data.username}</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-white"
            >
              <MdOutlineMoreHoriz className="text-lg" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      <UploadModal isOpen={isModalOpen} onClose={toggleModal} />
      <Transition
        as={Fragment}
        show={isSearchSidebarOpen}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4">
            <button
              onClick={toggleSearchSidebar}
              className="text-gray-600 hover:text-gray-800"
            >
              Cerrar
            </button>
            <BuscarPerfil />
          </div>
        </div>
      </Transition>
    </>
  );
};

export default SideBar;
