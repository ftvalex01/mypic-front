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
    setPosts([]);
    setPage(1);
    setHasMore(true);
    // Decidir qué función llamar basado en el modo de vista actual
    const fetchPosts =
      viewMode === "forYou" ? fetchAllRecommendedPosts : fetchAllPublicPosts;
    fetchPosts(page);
  }, [viewMode, fetchAllPublicPosts, fetchAllRecommendedPosts, page]);

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const apiFunc =
        viewMode === "forYou" ? fetchAllRecommendedPosts : fetchAllPublicPosts;
      const newPosts = await apiFunc(page); // Pasar la página actual
      const uniqueNewPosts = newPosts.filter(
        (newPost) => !posts.find((post) => post.id === newPost.id)
      );

      if (uniqueNewPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...uniqueNewPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error(
        `Error fetching ${
          viewMode === "forYou" ? "recommended" : "public"
        } posts:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Aquí incluimos la función determineGridItemSize
  const determineGridItemSize = (index) => {
    const sizes = ["large", "medium", "small"]; // Asegúrate de tener estas clases en tu CSS
    return sizes[index % sizes.length];
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setViewMode("random")}>Aleatorio</button>
        <button onClick={() => setViewMode("forYou")}>Para Ti</button>
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
