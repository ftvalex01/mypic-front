/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// src/context/SocialInteractionContext.jsx
import { createContext, useContext} from 'react';
import { socialInteractionService } from '../services/socialInteractionServices';

const SocialInteractionContext = createContext();

export const SocialInteractionProvider = ({ children }) => {

  
  const followUser = async (userId) => {
    const data = await socialInteractionService.followUser(userId);
    return data;
    // Ejemplo de manejo
  };

  const getFollowData = async (userId) => {

    const data = await socialInteractionService.getFollowData(userId);
    return data; // Actualiza el estado con los datos de seguimiento
  };

  const acceptFollowRequest = async (notificationId) => {
    const data = await socialInteractionService.acceptFollowRequest(notificationId);
    return data;
   
  };

  const rejectFollowRequest = async (notificationId) => {
    const data = await socialInteractionService.rejectFollowRequest(notificationId);
    return data;
  };

  // Asegúrate de proveer todas las funciones y estados necesarios aquí
  return (
    <SocialInteractionContext.Provider value={{
      followUser,
      getFollowData,
      acceptFollowRequest,
      rejectFollowRequest,
    }}>
      {children}
    </SocialInteractionContext.Provider>
  );
};

export const useSocialInteractions = () => useContext(SocialInteractionContext);
