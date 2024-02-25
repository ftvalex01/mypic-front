import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusSquare, FaEllipsisH, FaRegCompass } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import useAuthContext from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta
import UploadModal from './UploadModal/UploadModal'; // Asegúrate de que la ruta sea correcta

const MobileNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { logout } = useAuthContext(); // Asumiendo que esta es la forma de acceder a tu función de logout

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <>
      <nav className="flex items-center justify-around text-2xl bg-white w-full fixed bottom-0 inset-x-0 z-50 lg:hidden">
        <Link to="/" className="text-gray-700"><FaHome /></Link>
        <Link to="/explore" className="text-gray-700"><FaRegCompass /></Link>
        {/* Botón para abrir el modal de crear post, colocado en el centro */}
        <button className="text-gray-700 position-relative" onClick={toggleModal}>
          <FaPlusSquare />
        </button>
        <Link to="/profile" className="text-gray-700"><CgProfile /></Link>
        <button onClick={() => setShowMenu(!showMenu)} className="text-gray-700 relative">
          <FaEllipsisH />
          {showMenu && (
            <div className="absolute right-0 bottom-full mb-2 bg-white border rounded shadow-lg">
              <ul>
                <li className="p-2 hover:bg-gray-100">
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </button>
      </nav>
      {/* Renderiza condicionalmente UploadModal basado en isModalOpen */}
      <UploadModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default MobileNav;
