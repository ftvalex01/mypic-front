import { Link } from 'react-router-dom';
import { FaHome, FaPlusSquare, FaRegHeart } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';

const MobileNav = () => {
  return (
    <nav className="flex justify-around text-2xl bg-white w-full fixed bottom-0 inset-x-0 z-30 lg:hidden">
      <Link to="/" className="text-gray-700"><FaHome /></Link>
      <Link to="/create" className="text-gray-700"><FaPlusSquare /></Link>
      <Link to="/notifications" className="text-gray-700"><FaRegHeart /></Link>
      <Link to="/profile" className="text-gray-700"><CgProfile /></Link>
    </nav>
  );
};

export default MobileNav;
