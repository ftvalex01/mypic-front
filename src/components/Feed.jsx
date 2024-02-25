import  { useEffect } from 'react';
import PostCard from '../components/PostCard';
import { usePostContext } from '../context/PostContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import './style.css'
const Feed = () => {
  const { posts, fetchAllPosts, hasMore } = usePostContext(); // Directamente usa 'posts' desde el contexto

  useEffect(() => {
    fetchAllPosts(); // Esto establece 'posts' dentro del contexto
  }, [fetchAllPosts]);
 // Mensaje a mostrar cuando no hay posts
 const noPostsMessage = (
  
  <p style={{ textAlign: 'center' }}>
    <b>!Sigue a tus amigos para ver sus posts!</b>
  </p>
);

// Mensaje a mostrar cuando se han visto todos los posts
const endMessage = (
  <p style={{ textAlign: 'center' }}>
    <b>!Ya has visto todos los post!</b>
  </p>
);
  // Verifica si el array 'posts' está vacío y muestra un mensaje o la lista de posts
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchAllPosts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={posts.length > 0 ? endMessage : noPostsMessage}
      className='bg-eerieBlack'
    >
      {
        posts.map((post) => <PostCard key={post.id} post={post} />)

      }
    </InfiniteScroll>
  );
};

export default Feed;
