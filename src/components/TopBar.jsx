import { Link } from 'react-router-dom';
import BuscarPerfil from '../components/BuscarPerfil';
import { FaRegHeart } from 'react-icons/fa';
import { useNotificationContext } from '../context/NotificationContext';
import './style.css'
const TopBar = () => {
  const { hasUnreadNotifications } = useNotificationContext();

  return (
    <div className=" topbar flex items-center justify-between py-3 px-4  text-white fixed top-0 inset-x-0 z-50 shadow-lg lg:hidden">
      <Link to="/" className="flex-shrink-0">
        <span className="text-lg font-bold">MyPic</span>
      </Link>
      <div className="flex-1 px-2 max-w-[calc(80%-6rem)]"> {/* Ajusta el tamaño máximo para permitir espacio a los lados */}
        <BuscarPerfil />
      </div>
      <Link to="/notifications" className="relative flex-shrink-0">
        <FaRegHeart className="text-lg" />
        {hasUnreadNotifications && (
          <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-600 border border-white"></span>
        )}
      </Link>
    </div>
  );
};

export default TopBar;
