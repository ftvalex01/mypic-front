// Sidebar.js
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaRegCompass, FaRegHeart, FaPlusSquare } from 'react-icons/fa';
import { MdMessage, MdOutlineMoreHoriz } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { RiLiveLine } from 'react-icons/ri';
import useAuthContext from "../context/AuthContext";
import { useState } from 'react';
import UploadModal from './UploadModal/UploadModal';

const Sidebar = () => {
  const {  logout, user } = useAuthContext(); 
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
    <aside className="flex flex-col justify-between bg-gray-700 md:h-screen">
      <div className="hidden md:flex md:flex-col space-y-6 p-4">
        {/* Logo o título del sitio */}
        <h1 className="text-3xl font-bold mb-4">MyPic</h1>
        {/* Navegación principal */}
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="text-lg" />
            <span>Inicio</span>
          </Link>
          <Link to="/search" className="flex items-center space-x-2">
            <FaSearch className="text-lg" />
            <span>Búsqueda</span>
          </Link>
          <Link to="/explore" className="flex items-center space-x-2">
            <FaRegCompass className="text-lg" />
            <span>Explorar</span>
          </Link>
          <Link to="/reels" className="flex items-center space-x-2">
            <RiLiveLine className="text-lg" />
            <span>Reels</span>
          </Link>
          <Link to="/messages" className="flex items-center space-x-2">
            <MdMessage className="text-lg" />
            <span>Mensajes</span>
          </Link>
          <Link to="/notifications" className="flex items-center space-x-2">
            <FaRegHeart className="text-lg" />
            <span>Notificaciones</span>
          </Link>
          <Link to="#" onClick={openModal} className="flex items-center space-x-2">
          <FaPlusSquare className="text-lg" />
          <span>Crear</span>
        </Link>
          <Link to="/profile" className="flex items-center space-x-2">
            <CgProfile className="text-lg" />
            <span>{user.data.username}</span>
          </Link>
        </nav>
      </div>
      {/* Enlaces inferiores y línea divisoria para pantallas medianas y grandes */}
      <div className="hidden md:flex md:flex-col space-y-6 p-4 mb-4">
        <Link onClick={logout} to="/" className="flex items-center space-x-2">
          <MdOutlineMoreHoriz className="text-lg" />
          <span> Logout</span>
        </Link>
        <Link to="/more" className="flex items-center space-x-2">
          <MdOutlineMoreHoriz className="text-lg" />
          <span>Más</span>
        </Link>
        <div className="flex-grow border-r-2 border-gray-300"></div>
      </div>
      {/* Barra de navegación para pantallas pequeñas */}
      <nav className="md:hidden flex justify-around text-2xl bg-white w-full fixed inset-x-0 bottom-0 border-t-2 border-gray-200 py-2">
        <Link to="/" className="text-lg">
          <FaHome />
        </Link>
        <Link to="/search" className="text-lg">
          <FaSearch />
        </Link>
        <Link to="/create" className="text-lg">
          <FaPlusSquare />
        </Link>
        <Link to="/notifications" className="text-lg">
          <FaRegHeart />
        </Link>
        <Link to="/profile" className="text-lg">
          <CgProfile />
        </Link>
      </nav>
    </aside>
    <UploadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Sidebar;
