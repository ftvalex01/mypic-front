import { useState, useEffect } from 'react';
import useAuthContext from "../context/AuthContext";
import InfiniteScroll from 'react-infinite-scroll-component';

const ExploreView = () => {
  const { fetchAllPublicPosts } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMorePosts();
  }, []);

  const fetchMorePosts = async () => {
    try {
      // Obtener la respuesta de la API
      const response = await fetchAllPublicPosts();
      // Acceder al array de posts dentro de la respuesta
      const newPosts = response.data; // Ajusta esto según la estructura exacta de tu respuesta
  
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.error("Error fetching public posts for explore view:", error);
    }
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
          <div key={index} className={`item ${determineGridItemSize(index)}`}>
            <img src={post.media.url} alt="Post" /> {/* Asegúrate de que esta propiedad coincida con la estructura de tu objeto de post */}
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

const determineGridItemSize = (index) => {
  const sizes = ['large', 'medium', 'small'];
  return sizes[index % sizes.length];
};

export default ExploreView;
