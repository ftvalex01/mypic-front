
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Columna Izquierda: Menú */}
          <div className="col-span-1 hidden md:block">
            {/* Aquí va el menú lateral */}
          </div>
          {/* Columna Central: Contenido Principal */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            {/* Aquí van las historias y las publicaciones */}
            <Outlet /> {/* Utiliza el Outlet para renderizar el contenido de las rutas anidadas */}
          </div>
          {/* Columna Derecha: Barra Lateral de Usuarios/Sugerencias */}
          <div className="col-span-1 hidden lg:block">
            {/* Aquí va la barra lateral de usuarios y sugerencias */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
