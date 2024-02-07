// Feed.jsx
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import useAuthContext from '../context/AuthContext'; // Asume que esta es la ruta correcta a tu contexto

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { fetchAllPosts } = useAuthContext(); // Asegúrate de tener esta función en tu contexto

  useEffect(() => {
    const initFetch = async () => {
      const fetchedPosts = await fetchAllPosts(); // Obtiene todos los posts
      setPosts(fetchedPosts);
    };

    initFetch();
  }, [fetchAllPosts]);

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
