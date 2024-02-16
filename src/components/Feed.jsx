import  { useEffect } from 'react';
import PostCard from '../components/PostCard';
import { usePostContext } from '../context/PostContext';

const Feed = () => {
  const { posts, fetchAllPosts } = usePostContext(); // Directamente usa 'posts' desde el contexto

  useEffect(() => {
    fetchAllPosts(); // Esto establece 'posts' dentro del contexto
  }, [fetchAllPosts]);

  // Verifica si el array 'posts' está vacío y muestra un mensaje o la lista de posts
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p className="text-center mt-10">Empieza a seguir a tus amigos para ver sus publicaciones.</p>
      )}
    </div>
  );
};

export default Feed;
