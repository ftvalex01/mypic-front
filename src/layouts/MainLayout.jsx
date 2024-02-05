import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const Layout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen overflow-hidden">
      {/* Sidebar: Menú para pantallas medianas y grandes, oculto en móviles */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-black text-white fixed inset-y-0 z-20">
        <Sidebar />
      </div>
      {/* Contenedor Principal: Aquí va el contenido principal con scroll */}
      <div className="flex-1 flex flex-col overflow-auto md:ml-64 pt-4 pb-16 md:pb-0">
   
        <div className="pt-4 flex-1">
          <Outlet />
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
