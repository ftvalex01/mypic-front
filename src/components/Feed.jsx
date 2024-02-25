import  { useEffect } from 'react';
import PostCard from '../components/PostCard';
import { usePostContext } from '../context/PostContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const Feed = () => {
  const { posts, fetchAllPosts, hasMore } = usePostContext(); // Directamente usa 'posts' desde el contexto

  useEffect(() => {
    fetchAllPosts(); // Esto establece 'posts' dentro del contexto
  }, [fetchAllPosts]);

  // Verifica si el array 'posts' está vacío y muestra un mensaje o la lista de posts
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchAllPosts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      className='bg-bittersweet'
    >
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </InfiniteScroll>
  );
};

export default Feed;
