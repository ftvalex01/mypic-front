import React from "react";
import { createRoot } from "react-dom/client"; // Importa createRoot desde react-dom/client
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { PostProvider } from "./context/PostContext.jsx";
import { SocialInteractionProvider } from "./context/SocialInteractionContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const container = document.getElementById("root");
const root = createRoot(container); // Utiliza createRoot para crear la raíz.

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <PostProvider>
            <SocialInteractionProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </SocialInteractionProvider>
          </PostProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
