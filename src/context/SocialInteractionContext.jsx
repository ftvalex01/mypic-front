/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// src/context/SocialInteractionContext.jsx
import React, { createContext, useContext, useCallback } from 'react';
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
  const blockUser = async (userId) => {
    const data = await socialInteractionService.blockUser(userId);
    // Manejar la respuesta, por ejemplo, actualizando el estado local o notificando al usuario
    return data;
  };

  const unblockUser = useCallback(async (userId) => {
    try {
      const result = await socialInteractionService.unblockUser(userId);
      // Manejar la respuesta adecuadamente
      return result;
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  }, []);

  const checkIfBlocked = async (userId) => {
    try {
      const isBlocked = await socialInteractionService.checkIfBlocked(userId);
      return isBlocked; // Simplemente retorna el valor
    } catch (error) {
      console.error("Error checking if user is blocked from context:", error);
      throw error; // Lanza el error para que el componente llamador pueda manejarlo
    }
  };
  // Asegúrate de proveer todas las funciones y estados necesarios aquí
  return (
    <SocialInteractionContext.Provider value={{
      followUser,
      getFollowData,
      acceptFollowRequest,
      rejectFollowRequest,
      unblockUser,
      blockUser,
      checkIfBlocked

    }}>
      {children}
    </SocialInteractionContext.Provider>
  );
};

export const useSocialInteractions = () => useContext(SocialInteractionContext);
