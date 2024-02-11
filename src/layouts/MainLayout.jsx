import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SideBar from '../components/SideBar';
import BuscarPerfil from '../components/BuscarPerfil';
import { FaRegHeart } from 'react-icons/fa';

const Layout = () => {
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const toggleSearchPanel = () => {
    setShowSearchPanel(!showSearchPanel);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen overflow-hidden">
      {/* Sidebar for large and medium screens */}
      <SideBar onSearchClick={toggleSearchPanel} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top bar for small screens */}
        <div className="sm:hidden flex justify-between items-center p-2 bg-black text-white fixed top-0 inset-x-0 z-10">
          <span className="text-3xl font-bold">MyPic</span>
          <BuscarPerfil />
          <Link to="/notifications" className="text-lg">
            <FaRegHeart />
          </Link>
        </div>

        {/* Outlet - Main content */}
        <div className="pt-16 sm:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
