import { useEffect, useState, useRef } from "react";
const PAGE_SIZE = 2;
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  "";

export interface PostType {
  _id: string;
  [key: string]: any;
}


export const useGetPostsByUser = (userId: string | null, token: string | null) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const needsFirstLoad = useRef(true);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Cargar la primera página y contador
  useEffect(() => {
    if (!userId || !token) return;
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setPosts([]);         
      setPostsCount(0);
      setPage(1);
      needsFirstLoad.current = true;

      try {
        // Cuenta de posts
        const countRes = await fetch(`${API_URL}/posts/count?userId=${userId}`, {
          headers: authHeaders,
        });
        const count = await countRes.json();
        if (!cancelled) setPostsCount(typeof count === "number" ? count : 0);
      } catch {
        if (!cancelled) setPostsCount(0);
      }

      try {
        // Primeros posts
        const postsRes = await fetch(
          `${API_URL}/posts?userId=${userId}&limit=${PAGE_SIZE}&skip=0`,
          { headers: authHeaders }
        );
        const data = await postsRes.json();
        console.log("HOOK: fetched posts", data); 
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
        needsFirstLoad.current = false;
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
  }, [userId, token]);

  // Paginado
  useEffect(() => {
    if (
      userId &&
      token &&
      page > 1 &&
      !loading &&
      posts.length < postsCount
    ) {
      let cancelled = false;
      const skip = (page - 1) * PAGE_SIZE;
      setLoading(true);

      const fetchPosts = async () => {
        try {
          const res = await fetch(
            `${API_URL}/posts?userId=${userId}&limit=${PAGE_SIZE}&skip=${skip}`,
            { headers: authHeaders }
          );
          const data = await res.json();
          if (!cancelled) {
            setPosts((currentPosts) => [
              ...currentPosts,
              ...(Array.isArray(data) ? data : []),
            ]);
          }
        } catch {}
        finally {
          if (!cancelled) setLoading(false);
        }
      };
      fetchPosts();

      return () => { cancelled = true; };
    }
  }, [page, userId, token, postsCount, loading, posts.length]);

  const getNextPosts = () => {
    if (!loading && posts.length < postsCount && !needsFirstLoad.current) {
      setPage((prev) => prev + 1);
    }
  };

  const refreshPosts = () => {
    setPosts([]);
    setPostsCount(0);
    setPage(1);
    needsFirstLoad.current = true;
  };

  return {
    posts,
    getNextPosts,
    refreshPosts,
    loading,
  };
};
