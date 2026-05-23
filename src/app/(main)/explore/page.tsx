"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import Modal from "@/components/ui/Modal";
import { Heart, MessageCircle, Loader2, Compass } from "lucide-react";

interface Post {
  id: string;
  mediaUrls: string[];
  likeCount: number;
  commentCount: number;
  username: string;
  caption: string;
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async (c?: string | null) => {
    const params = new URLSearchParams({ limit: "30" });
    if (c) params.set("cursor", c);
    const data = await apiFetch<{ posts: Post[]; nextCursor: string | null }>(
      `/posts/explore?__dev=1&${params}`,
    );
    return data;
  }, []);

  useEffect(() => {
    fetchPosts(null)
      .then((data) => {
        setPosts(data.posts);
        setCursor(data.nextCursor);
      })
      .finally(() => setLoading(false));
  }, [fetchPosts]);

  const loadMore = async () => {
    if (loadingMore || !cursor) return;
    setLoadingMore(true);
    const data = await fetchPosts(cursor);
    setPosts((prev) => [...prev, ...data.posts]);
    setCursor(data.nextCursor);
    setLoadingMore(false);
  };

  return (
    <div className="px-4 md:px-0 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold gradient-text flex items-center gap-2">
          <Compass className="w-5 h-5" />
          Explore
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-1 md:gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 animate-pulse rounded-sm"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-1.5">
          {posts.slice(0, 1).map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="col-span-2 row-span-2 relative aspect-square group overflow-hidden rounded-sm bg-[var(--ig-bg-tertiary)]"
            >
              <Image
                src={post.mediaUrls[0]}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 66vw, 600px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" fill="currentColor" />
                    {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" fill="currentColor" />
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {posts.slice(1).map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square group overflow-hidden rounded-sm bg-[var(--ig-bg-tertiary)]"
            >
              <Image
                src={post.mediaUrls[0]}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 293px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-bold">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5" fill="currentColor" />
                  {post.likeCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                  {post.commentCount}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {cursor && (
        <div className="flex justify-center py-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#405de6]/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}

      <Modal
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        className="max-w-lg"
      >
        {selectedPost && (
          <div>
            <div className="relative aspect-square bg-gradient-to-br from-[#405de6]/10 to-[#e1306c]/10 -mx-4 -mt-4 overflow-hidden">
              <Image
                src={selectedPost.mediaUrls[0]}
                alt=""
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center text-xs text-white font-bold">
                {selectedPost.username.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm flex-1">
                <Link
                  href={`/profile/${selectedPost.username}`}
                  className="font-bold hover:underline"
                >
                  {selectedPost.username}
                </Link>{" "}
                {selectedPost.caption}
              </p>
            </div>
            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[var(--ig-border)]">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#ed4956]" fill="#ed4956" />
                {selectedPost.likeCount} likes
              </span>
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                {selectedPost.commentCount} comments
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
