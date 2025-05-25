import React from "react";
import Post from "./Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import InfinitePosts from "./InfinitePosts";

export default async function Posts({
  userProfileId,
  showAll,
}: {
  userProfileId?: string;
  showAll?: boolean;
}) {
  const { userId } = await auth();
  if (!userId) return;

  // 动态页获取用户自己以及关注人的帖子（不含评论的帖子）；首页显示所有人的帖子；个人信息页显示自己的帖子
  const whereCondition = userProfileId
    ? { parentPostId: null, userId: userProfileId }
    : showAll
    ? { parentPostId: null }
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
    _count: { select: { likes: true, comments: true } },
    likes: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };
  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      ...postIncludeQuery,
    },
    take: 3,
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
  });

  // 添加isCurrentUser字段（判断是否是当前用户的帖子）
  const postsWithOwnerStatus = posts.map((post) => ({
    ...post,
    isCurrentUser: post.userId === userId,
  }));

  return (
    <div>
      {postsWithOwnerStatus.map((post) => {
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
