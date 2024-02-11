import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMessage, MdOutlineMoreHoriz } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { RiLiveLine } from 'react-icons/ri';
import UploadModal from './UploadModal/UploadModal';
import BuscarPerfil from './BuscarPerfil';
import useAuthContext from "../context/AuthContext";
import {
  FaHome,
  FaSearch,
  FaRegCompass,
  FaRegHeart,
  FaPlusSquare
} from 'react-icons/fa';
const SideBar = () => {
  const { logout, user } = useAuthContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const openSearchModal = () => setSearchModalOpen(true);
  const closeSearchModal = () => setSearchModalOpen(false);

  return (
    <>
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden sm:flex flex-col bg-gray-700 fixed inset-y-0 left-0 z-30 transition-width duration-300 w-16 md:w-40 lg:w-64 xl:w-72">
        <div className="flex flex-col space-y-6 p-4">
          <h1 className="text-3xl font-bold mb-4 hidden lg:block text-white">MyPic</h1>
          <nav className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <FaHome className="text-lg" />
              <span className="hidden md:inline">Inicio</span>
            </Link>
            <Link to="#" onClick={openSearchModal} className="flex items-center space-x-2 text-white">
              <FaSearch className="text-lg" />
              <span className="hidden md:inline">Búsqueda</span>
            </Link>
            <Link to="/explore" className="flex items-center space-x-2 text-white">
              <FaRegCompass className="text-lg" />
              <span className="hidden md:inline">Explorar</span>
            </Link>
            <Link to="/reels" className="flex items-center space-x-2 text-white">
              <RiLiveLine className="text-lg" />
              <span className="hidden md:inline">Reels</span>
            </Link>
            <Link to="/messages" className="flex items-center space-x-2 text-white">
              <MdMessage className="text-lg" />
              <span className="hidden md:inline">Mensajes</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-2 text-white">
              <FaRegHeart className="text-lg" />
              <span className="hidden md:inline">Notificaciones</span>
            </Link>
            <Link to="#" onClick={openModal} className="flex items-center space-x-2 text-white">
              <FaPlusSquare className="text-lg" />
              <span className="hidden md:inline">Crear</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 text-white">
              <CgProfile className="text-lg" />
              <span className="hidden md:inline">{user?.data.username}</span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col space-y-6 p-4 mb-4">
          <Link onClick={logout} to="/" className="flex items-center space-x-2 text-white">
            <MdOutlineMoreHoriz className="text-lg" />
            <span className="hidden md:inline">Logout</span>
          </Link>
          <Link to="/more" className="flex items-center space-x-2 text-white">
            <MdOutlineMoreHoriz className="text-lg" />
            <span className="hidden md:inline">Más</span>
          </Link>
        </div>
      </aside>

      {/* Barra de navegación para pantallas pequeñas */}
      <nav className="sm:hidden flex justify-around text-2xl bg-white w-full fixed inset-x-0 bottom-0 border-t-2 border-gray-200 py-2">
        <Link to="/" className="text-gray-700">
          <FaHome />
        </Link>
        <Link to="/create" className="text-gray-700">
          <FaPlusSquare />
        </Link>
        <Link to="/notifications" className="text-gray-700">
          <FaRegHeart />
        </Link>
        <Link to="/profile" className="text-gray-700">
          <CgProfile />
        </Link>
      </nav>

      {/* Modal para subir */}
      <UploadModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Modal de búsqueda */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeSearchModal}></div>
          <div className="bg-white p-4 rounded-md">
            <BuscarPerfil />
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
