import React from "react";
import Post from "./Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import InfinitePosts from "./InfinitePosts";

export default async function Posts({
  userProfileId,
}: {
  userProfileId?: string;
}) {
  const { userId } = await auth();
  if (!userId) return;

  // 获取用户自己以及关注人的帖子（不含评论的帖子）
  const whereCondition = userProfileId
    ? { parentPostId: null, userId: userProfileId }
    : {
        parentPostId: null,
        userId: {
          in: [
            userId,
            ...(
              await prisma.follow.findMany({
                where: {
                  followerId: userId,
                },
                select: {
                  followingId: true,
                },
              })
            ).map((follow) => follow.followingId),
          ],
        },
      };

  const postIncludeQuery = {
    user: { select: { displayName: true, username: true, img: true } },
    _count: { select: { likes: true, rePosts: true, comments: true } },
    likes: { where: { userId: userId }, select: { id: true } },
    rePosts: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };
  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      rePost: {
        include: postIncludeQuery,
      },
      ...postIncludeQuery,
    },
    take: 3,
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Post post={post} />
          </div>
        );
      })}
      <InfinitePosts userProfileId={userProfileId} />
    </div>
  );
}
