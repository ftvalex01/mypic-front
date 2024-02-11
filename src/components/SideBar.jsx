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
      {/* Sidebar para pantallas medianas y grandes */}
      <aside className="hidden lg:flex flex-col bg-gray-700 fixed inset-y-0 left-0 z-30 w-64">
        <div className="flex flex-col space-y-6 p-4">
          <h1 className="text-3xl font-bold mb-4 text-white">MyPic</h1>
          <nav className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <FaHome className="text-lg" />
              <span>Inicio</span>
            </Link>
            <Link to="#" onClick={openSearchModal} className="flex items-center space-x-2 text-white">
              <FaSearch className="text-lg" />
              <span>Búsqueda</span>
            </Link>
            <Link to="/explore" className="flex items-center space-x-2 text-white">
              <FaRegCompass className="text-lg" />
              <span>Explorar</span>
            </Link>
            <Link to="/reels" className="flex items-center space-x-2 text-white">
              <RiLiveLine className="text-lg" />
              <span>Reels</span>
            </Link>
            <Link to="/messages" className="flex items-center space-x-2 text-white">
              <MdMessage className="text-lg" />
              <span>Mensajes</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-2 text-white">
              <FaRegHeart className="text-lg" />
              <span>Notificaciones</span>
            </Link>
            <Link to="#" onClick={openModal} className="flex items-center space-x-2 text-white">
              <FaPlusSquare className="text-lg" />
              <span>Crear</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 text-white">
              <CgProfile className="text-lg" />
              <span>{user?.data.username}</span>
            </Link>
            <Link onClick={logout} to="/" className="flex items-center space-x-2 text-white">
              <MdOutlineMoreHoriz className="text-lg" />
              <span>Logout</span>
            </Link>
            <Link to="/more" className="flex items-center space-x-2 text-white">
              <MdOutlineMoreHoriz className="text-lg" />
              <span>Más</span>
            </Link>
          </nav>
        </div>
      </aside>

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
