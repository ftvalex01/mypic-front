import { useState, useEffect } from 'react';
import useAuthContext from "../context/AuthContext";
import InfiniteScroll from 'react-infinite-scroll-component';

const ExploreView = () => {
  const { fetchAllPublicPosts } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = "http://localhost:8000";

  useEffect(() => {
    fetchMorePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMorePosts = async () => {
    if (isLoading) return; // Evitar llamadas adicionales mientras se carga

    setIsLoading(true); // Iniciar la carga
    try {
      const response = await fetchAllPublicPosts();
      const newPosts = response.data;

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => {
          // Crear un nuevo conjunto para evitar duplicados
          const postIds = new Set(prevPosts.map(post => post.id));
          const uniqueNewPosts = newPosts.filter(post => !postIds.has(post.id));
          return [...prevPosts, ...uniqueNewPosts];
        });
      }
    } catch (error) {
      console.error("Error fetching public posts for explore view:", error);
    } finally {
      setIsLoading(false); // Terminar la carga
    }
  };

  const determineGridItemSize = (index) => {
    const sizes = ['large', 'medium', 'small'];
    return sizes[index % sizes.length];
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMorePosts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <div key={post.id} className={`item ${determineGridItemSize(index)}`}>
            <img src={`${baseUrl}${post.media.url}`} alt="Post" />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default ExploreView;
