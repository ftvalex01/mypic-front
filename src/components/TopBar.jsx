import BuscarPerfil from '../components/BuscarPerfil';
import { FaRegHeart } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="flex justify-between items-center p-2 bg-black text-white fixed top-0 inset-x-0 z-30 lg:hidden">
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold">MyPic</span>
        <BuscarPerfil />
      </div>
      <FaRegHeart className="text-lg" />
    </div>
  );
};

export default TopBar;
