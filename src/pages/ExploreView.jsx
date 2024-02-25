import { useState, useEffect } from "react";
import { usePostContext } from "../context/PostContext";
import InfiniteScroll from "react-infinite-scroll-component";
import "./ExploreView.css";
import "../components/style.css"
import PostModal from "../components/PostModal/PostModal";

const ExploreView = () => {
  const { fetchAllPublicPosts, fetchAllRecommendedPosts, fetchCommentsForPost } = usePostContext();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("random"); // 'random' o 'forYou'
  const baseUrl = import.meta.REACT_APP_BASE_URL || "http://localhost:8000";
  const [page, setPage] = useState(1);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); 
 
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

  
  const openPostModal = async (post) => {
    try {
      const comments = await fetchCommentsForPost(post.id);
      setSelectedPost({ ...post, comments }); // Asume que `post` ya contiene la URL de la imagen y otros datos necesarios.
      setIsPostModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };
  const determineGridItemClass = (index) => {
    // El primer elemento y cada sexto elemento después de eso serán grandes
    if (index % 6 === 0) {
      return 'item large first-large';
    } else if (index % 6 === 5) {
      return 'item large second-large';
    } else {
      return 'item';
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



  return (
    <div className="mt-8">

      <div className="tabs">
        <button onClick={() => handleModeChange("random")}  className="button-primary w-full mb-4 py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50">Aleatorio</button>
        <button onClick={() => handleModeChange("forYou")}  className="button-primary w-full mb-4 py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50">Para Ti</button>
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
          <div className="grid-container">
          {posts.map((post, index) => (
            <div
            key={post.id}
            className={determineGridItemClass(index)}
            onClick={() => openPostModal(post)} // Modifica esta línea para llamar a openModal
          >
              <img src={`${baseUrl}${post.media.url}`} alt="Post" />
            </div>
          ))}
        </div>
        {isPostModalOpen && selectedPost && ( // Verifica que el modal esté abierto y haya un post seleccionado
        <PostModal
          isOpen={isPostModalOpen}
          onClose={closePostModal}
          post={selectedPost}
        />
      )}
      <div id="modal-root"></div>
      </InfiniteScroll>
    </div>
  );
};

export default ExploreView;
