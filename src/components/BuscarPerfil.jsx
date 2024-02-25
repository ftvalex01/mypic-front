import { useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const initialState = {
  searchTerm: "",
  allUsers: [],
  recentSearches: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_ALL_USERS':
      return { ...state, allUsers: action.payload };
    case 'ADD_RECENT_SEARCH':
      if (!state.recentSearches.includes(action.payload)) {
        const newRecentSearches = [...state.recentSearches, action.payload];
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
        return { ...state, recentSearches: newRecentSearches };
      }
      return state;
    case 'REMOVE_RECENT_SEARCH':
      const filteredRecentSearches = state.recentSearches.filter(search => search !== action.payload);
      localStorage.setItem("recentSearches", JSON.stringify(filteredRecentSearches));
      return { ...state, recentSearches: filteredRecentSearches };
    case 'LOAD_RECENT_SEARCHES':
      return { ...state, recentSearches: action.payload };
    default:
      throw new Error();
  }
}

const BuscarPerfil = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { searchTerm, allUsers, recentSearches } = state;
  const { fetchAllUsers, user: currentUser } = useAuthContext();
  const containerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedRecentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    dispatch({ type: 'LOAD_RECENT_SEARCHES', payload: savedRecentSearches });
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsers();
        dispatch({ type: 'SET_ALL_USERS', payload: response.data || [] });
      } catch (error) {
        console.error("Error fetching users:", error);
        dispatch({ type: 'SET_ALL_USERS', payload: [] });
      }
    };

    loadUsers();
  }, [fetchAllUsers]);

  const filteredUsers = searchTerm
    ? allUsers.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  const handleChange = (e) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  };

  const handleUserClick = (username) => {
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: username });
    if (username === currentUser?.data?.username) {
      navigate("/profile");
    } else {
      navigate(`/profile/${username}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        dispatch({ type: 'SET_SEARCH_TERM', payload: '' }); // Esto cerrará la lista desplegable
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        placeholder="Buscar perfil..."
        onChange={handleChange}
        value={searchTerm}
        className="form-control text-red-600 my-3 w-full px-4 py-2 border rounded "
      />
    {
  searchTerm && (
    <ul className="absolute w-full bg-white shadow-lg overflow-auto z-10 rounded-lg mt-1 max-h-[12rem]"> {/* max-h-[12rem] permite mostrar hasta 3 elementos sin scroll */}
      {filteredUsers.slice(0, 4).map((user) => ( // slice(0, 3) asegura mostrar solo los primeros 3 resultados
        <li
          key={user.id}
          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() => handleUserClick(user.username)}
        >
          <img
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt={user.username}
            className="w-10 h-10 mr-3 rounded-full object-cover"
          />
          <span className="text-gray-800 font-medium">{user.username}</span>
        </li>
      ))}
      {filteredUsers.length === 0 && (
        <li className="text-center p-2 text-gray-500">
          No se encontraron resultados
        </li>
      )}
    </ul>
  )
}
      {!searchTerm && (
        <div className="hidden sm:hidden  lg:block mt-5">
          <h3 className="pl-4 text-sm font-semibold lg:block">Búsquedas recientes</h3>
          {recentSearches.map((search) => (
  <div key={search} className="flex items-center justify-between p-2">
    <span className="text-gray-700">{search}</span>
    <button
      onClick={() => dispatch({ type: 'REMOVE_RECENT_SEARCH', payload: search })}
      className="rounded-full p-1 hover:bg-gray-200"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
))}
        </div>
      )}
    </div>
  );
};
export default BuscarPerfil;
