import { useState, useEffect } from "react";
import { usePostContext } from "../context/PostContext";
import InfiniteScroll from "react-infinite-scroll-component";
import "./ExploreView.css";

const ExploreView = () => {
  const { fetchAllPublicPosts, fetchAllRecommendedPosts } = usePostContext();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("random"); // 'random' o 'forYou'
  const baseUrl = import.meta.REACT_APP_BASE_URL || "http://localhost:8000";
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadInitialPosts();
  }, [viewMode]);

  const loadInitialPosts = async () => {
    setIsLoading(true);
    const apiFunc = viewMode === "forYou" ? fetchAllRecommendedPosts : fetchAllPublicPosts;
    try {
      const fetchedPosts = await apiFunc(1);
  
      setPosts(fetchedPosts);
      setHasMore(fetchedPosts.length > 0); // Solo habilitar la paginación si hay más posts disponibles
    } catch (error) {
      console.error(`Error fetching ${viewMode} posts:`, error);
      setPosts([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const apiFunc = viewMode === "forYou" ? fetchAllRecommendedPosts : fetchAllPublicPosts;
    try {
      const newPosts = await apiFunc(page + 1); // Incrementar la página para cargar más posts
      if (newPosts && newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false); // Deshabilitar la paginación si no hay más posts disponibles
      }
    } catch (error) {
      console.error(`Error fetching more ${viewMode} posts:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    setViewMode(mode);
    setPage(1); // Resetear la página al cambiar el modo de vista
  };

  const determineGridItemSize = (index) => {
    const sizes = ["large", "medium", "small"];
    return sizes[index % sizes.length];
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => handleModeChange("random")}>Aleatorio</button>
        <button onClick={() => handleModeChange("forYou")}>Para Ti</button>
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`item ${determineGridItemSize(index)}`}
            >
              <img src={`${baseUrl}${post.media.url}`} alt="Post" />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ExploreView;
