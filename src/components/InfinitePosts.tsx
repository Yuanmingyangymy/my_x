"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch(
    "http://localhost:3000/api/posts?cursor=" +
      pageParam +
      "&user=" +
      userProfileId
  );
  return res.json();
};

const InfinitePosts = ({ userProfileId }: { userProfileId?: string }) => {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId),
    initialPageParam: 2,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 2 : undefined,
  });

  if (error) return "An error has occurred: " + error.message;
  if (status === "pending") return "Loading...";

  console.log(data);

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h1>加载中...</h1>}
      endMessage={<h1>所有帖子加载完毕！</h1>}
    >
      {allPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default InfinitePosts;
