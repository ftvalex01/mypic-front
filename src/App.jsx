import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthLayout from "./layouts/AuthLayout";
import GuestLayout from "./layouts/GuestLayout";
import Profile from "./components/Profile";
import EditarPerfil from "./components/EditarPerfil";
import BuscarPerfil from "./components/BuscarPerfil";
import ProfileByUsername from "./components/ProfileByUsername";
import Feed from "./components/Feed";
import ExploreView from "./pages/ExploreView";
import Notificaciones from './components/Notificaciones'


function App() {
  return (
    <div className="bg-slate-100 ">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditarPerfil />} />
            <Route path="/profile/:username" element={<ProfileByUsername />} />
            <Route path="search" element={<BuscarPerfil/>}/>
            <Route path="/explore" element={<ExploreView/>}/>
            <Route path="/notifications" element={<Notificaciones />} />
            

            <Route index element={<Feed />}/>
          </Route>
        </Route>
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route
            path="/password-reset/:token"
            element={<ResetPassword />}
          ></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

