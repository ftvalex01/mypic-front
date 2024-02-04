import useAuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useAuthContext();
  console.log(user)
  return (
    <div className="max-w-7xl mx-auto mt-12">{user?.data.name}</div>
  );
}

export default Home;