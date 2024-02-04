


// Sidebar.js
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaRegCompass, FaRegHeart, FaPlusSquare } from 'react-icons/fa';
import { MdMessage, MdOutlineMoreHoriz } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { RiLiveLine } from 'react-icons/ri';

const Sidebar = () => {
  return (
    <aside className="md:flex md:flex-col space-y-4">
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-4"></h1>
      </div>
      <nav className="flex flex-col space-y-3  hidden md:block">
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
        <Link to="/create" className="flex items-center space-x-2">
          <FaPlusSquare className="text-lg" />
          <span>Crear</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-2">
          <CgProfile className="text-lg" />
          <span>Perfil</span>
        </Link>
        <Link to="/threads" className="flex items-center space-x-2">
          <MdOutlineMoreHoriz className="text-lg" />
          <span>Threads</span>
        </Link>
        <Link to="/more" className="flex items-center space-x-2">
          <MdOutlineMoreHoriz className="text-lg" />
          <span>Más</span>
        </Link>
      </nav>
      <nav className="flex justify-around text-2xl md:hidden">
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
  );
};

export default Sidebar;
