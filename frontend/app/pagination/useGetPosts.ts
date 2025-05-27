import { useEffect, useState, useCallback } from "react";
import Constants from "expo-constants";
const PAGE_SIZE = 2;
const API_URL = Constants.expoConfig.extra.API_URL;

export const useGetPosts = (token) => {
  const [posts, setPosts] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  console.log("HOOK RENDERING. Current state:", {
    posts: posts.length,
    postsCount,
    page,
    loading,
  });

  const getNextPosts = async () => {
    console.log("getNextPosts called. State before check:", {
      postsLength: posts.length,
      postsCount,
      page,
      loading,
    });

    if (
      loading ||
      typeof postsCount !== "number" ||
      (posts.length >= postsCount && postsCount !== 0)
    ) {
      console.log("STOPPING FETCH IN HOOK: Already loaded all or loading", {
        postsLength: posts.length,
        postsCount,
        page,
        loading,
      });
      return;
    }

    setLoading(true);
    const skip = page * PAGE_SIZE;
    const limit = PAGE_SIZE;

    try {
      const res = await fetch(`${API_URL}/posts?limit=${limit}&skip=${skip}`, {
        headers: authHeaders,
      });
      const data = await res.json();

      if (page === 0) {
        setPosts(data);
      } else {
        setPosts((currentPosts) => [...currentPosts, ...data]);
      }

      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePostsCount = async () => {
    try {
      const res = await fetch(`${API_URL}/posts/count`, {
        headers: authHeaders,
      });
      const count = await res.json();
      setPostsCount(count);
    } catch (error) {
      console.error("Error fetching posts count:", error);
      setPostsCount(0); 
    }
  };


  const refreshPosts = async () => {
    console.log("Refreshing posts...");
    setPage(0);
    setPostsCount(0);
    setPosts([]);
    await updatePostsCount();
  };

  useEffect(() => {
    const fetchPostsCount = async () => {
      if (!token) return; 

      try {
        const res = await fetch(`${API_URL}/posts/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const count = await res.json();
        if (typeof count === "number") {
          setPostsCount(count);
        } else {
          console.error("Respuesta inesperada:", count);
          setPostsCount(0);
        }
      } catch (error) {
        console.error("Error al obtener el número de posts:", error);
        setPostsCount(0);
      }
    };

    fetchPostsCount();
  }, [token]);

  /*useEffect(() => {
    updatePostsCount();
  }, []);*/

  useEffect(() => {
    if (typeof postsCount === "number" && postsCount > 0) {
      getNextPosts();
    }
  }, [postsCount]);

  return {
    posts,
    getNextPosts,
    refreshPosts,
    loading,
  };
};
