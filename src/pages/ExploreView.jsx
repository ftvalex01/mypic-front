import { useState, useEffect } from 'react';
import { usePostContext } from '../context/PostContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const ExploreView = () => {
  const { fetchAllPublicPosts } = usePostContext();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.REACT_APP_BASE_URL || "http://localhost:8000";
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMorePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
  
    try {
      const newPosts = await fetchAllPublicPosts(page); // Pasar la página actual
      const uniqueNewPosts = newPosts.filter(newPost => !posts.find(post => post.id === newPost.id));
  
      if (uniqueNewPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts([...posts, ...uniqueNewPosts]);
        setPage(prevPage => prevPage + 1); // Incrementar la página para la próxima carga
      }
    } catch (error) {
      console.error("Error fetching public posts:", error);
    } finally {
      setIsLoading(false);
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