/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from '../api/axios';
import { useNavigate } from "react-router-dom/";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) =>{
    const [user,setUser] = useState(null);
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();
    const csrf = () => axios.get("http://localhost:8000/sanctum/csrf-cookie");

    const getUser = async() => {
        const {data} = await axios.get("http://localhost:8000/api/user");
        setUser(data);
    }
    const login = async({...data}) => {
        await csrf();
        setErrors([]);
        try {
            await axios.post('/login', data );
            await getUser();
            navigate("/");
          } catch (error) {
            if (error.response.status === 422) {
              setErrors(error.response.data.errors);
            } 
          }

    }
    const register = async({ ...data }) =>{
        await csrf();
        setErrors([]);
        try {
            await axios.post("/register", data);
            await getUser();
            navigate("/");
          } catch (error) {
            if (error.response.status === 422) {
            
              setErrors(error.response.data.errors);
            }
          }
    }


const forgotPassword = async (email) => {
  await csrf();
  setErrors([]); 
  try {
      const response = await axios.post("/forgot-password", { email });
      return response.data; 
  } catch (error) {
      if (error.response.status === 422 || error.response.status === 429) {
          setErrors(error.response.data.errors || { email: [error.response.data.message] });
      }
  
      throw error;
  }
};

const resetPassword = async ({ email, token, password, password_confirmation }, onSuccess) => {
  await csrf(); 
  setErrors([]); 
  try {
      const response = await axios.post("/reset-password", {
          token,
          email,
          password,
          password_confirmation,
      });
      setTimeout(() => {
          onSuccess(response.data); 
      }, 2000); 
  } catch (error) {
      if (error.response.status === 422 || error.response.status === 429) {
          setErrors(error.response.data.errors || { email: [error.response.data.message] });
      }
      throw error;
  }
};



    const logout = () =>{
        axios.post("/logout")
        .then(()=>{
            setUser(null);
        })
    }

    useEffect(() => {
      if (!user) {
        getUser();
      }
    }, [user]); 

    return <AuthContext.Provider value={{user, errors, getUser, login, register, logout, forgotPassword, resetPassword }}>
        {children}
    </AuthContext.Provider>
    
}

export default function useAuthContext(){
    return useContext(AuthContext);
}