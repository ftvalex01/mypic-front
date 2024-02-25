import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import MobileNav from '../components/MobileNav'; // Componente de barra de navegación inferior para dispositivos móviles
import TopBar from '../components/TopBar'; // Componente de barra superior para dispositivos móviles


const Layout = () => {
  return (

     <div className="bg-bittersweet min-h-screen overflow-hidden">
      <div className='mt-3'>
        <TopBar />
      </div>
      <Sidebar />
      <main className="pt-16 lg:pl-64 flex flex-col flex-1 overflow-auto ">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
