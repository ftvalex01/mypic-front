
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import BuscarPerfil from '../components/BuscarPerfil';
import { FaRegHeart } from 'react-icons/fa';

const Layout = () => {
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen overflow-hidden">
      {/* Barra superior para dispositivos móviles */}
      <div className="md:hidden flex justify-between items-center p-2 bg-black text-white fixed top-0 inset-x-0 z-10">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold">MyPic</span>
          <BuscarPerfil />
        </div>
        <FaRegHeart className="text-lg" />
      </div>

      <div className="flex-1 flex flex-col  overflow-auto">
        {/* Sidebar: Menú para pantallas medianas y grandes, oculto en móviles */}
        <div className="hidden md:flex md:flex-col md:w-32 bg-black text-white fixed inset-y-0 z-20">
          <Sidebar />
        </div>

        {/* Contenedor Principal: Aquí va el contenido principal con scroll */}
        <div className="flex-1 flex flex-col overflow-auto md:ml-64 pt-4 pb-16 md:pb-0">
          <div className="pt-4 flex-1">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Barra Lateral Derecha: Barra Lateral de Usuarios/Sugerencias, visible solo en grandes pantallas */}

      {/* Sidebar en el pie de página para dispositivos móviles */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-10">
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
