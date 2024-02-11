import { Link } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaRegCompass,
  FaRegHeart,
  FaPlusSquare,
} from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import useAuthContext from '../context/AuthContext';
import { useState } from 'react';
import UploadModal from './UploadModal/UploadModal';
import { MdMessage, MdOutlineMoreHoriz } from 'react-icons/md';
import { RiLiveLine } from 'react-icons/ri';

const Sidebar = () => {
  const { logout, user } = useAuthContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const openSearchModal = () => setSearchModalOpen(true);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <aside className="hidden md:flex md:flex-col justify-between bg-gray-700 h-screen w-60 fixed inset-y-0 left-0 z-30">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">MyPic</h1>
          <nav className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <FaHome className="text-lg" />
              <span>Inicio</span>
            </Link>
            <Link to="#" onClick={openSearchModal} className="flex items-center space-x-2">
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
        <div className="p-4">
          <Link onClick={logout} to="/" className="flex items-center space-x-2">
            <span>Logout</span>
          </Link>
          <Link to="/more" className="flex items-center space-x-2">
            <MdOutlineMoreHoriz className="text-lg" />
            <span>Más</span>
          </Link>
          <div className="flex-grow border-r-2 border-gray-300"></div>
        </div>

      </aside>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white shadow-t-lg py-2 flex justify-around items-center z-10">
      <Link to="/" className="text-lg">
            <FaHome />
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
      <UploadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Sidebar;
