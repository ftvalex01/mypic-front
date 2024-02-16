import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const BuscarPerfil = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchAllUsers, user: currentUser } = useAuthContext();
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsers();
        setAllUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]);
      }
    };

    loadUsers();
  }, [fetchAllUsers]);

  const filteredUsers = searchTerm
    ? allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addRecentSearch = (username) => {
    if (!recentSearches.includes(username)) {
      setRecentSearches([...recentSearches, username]);
    }
  };

  const removeRecentSearch = (username) => {
    setRecentSearches(recentSearches.filter((search) => search !== username));
  };

  const handleUserClick = (username) => {
    addRecentSearch(username);
    if (username === currentUser?.data?.username) {
      navigate("/profile");
    } else {
      navigate(`/profile/${username}`);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar perfil..."
        onChange={handleChange}
        value={searchTerm}
        className="form-control my-3 w-full px-4 py-2 border rounded"
      />
      {searchTerm && (
        <ul className="absolute w-full bg-white shadow-lg max-h-60 overflow-auto z-10">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleUserClick(user.username)}
            >
              <img
                src={user.profile_picture || "https://via.placeholder.com/150"}
                alt={user.username}
                className="w-8 h-8 mr-2 rounded-full"
              />
              <span className="text-gray-700">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
      {!searchTerm && (
        <div className="hidden sm:hidden  lg:block mt-5">
          <h3 className="pl-4 text-sm font-semibold lg:block">Búsquedas recientes</h3>
          {recentSearches.map((search) => (
            <div key={search} className="flex items-center justify-between p-2">
              <span className="text-gray-700">{search}</span>
              <button
                onClick={() => removeRecentSearch(search)}
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