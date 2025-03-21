import Post from "@/components/Post";
import { prisma } from "@/prisma";
import React from "react";

async function SavePage({ params }: { params: Promise<{ username: string }> }) {
  const username = (await params).username;
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  // 通过prisma获取用户的收藏帖子
  const savedPosts = await prisma.savedPosts.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      post: {
        include: {
          user: { select: { displayName: true, username: true, img: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: user?.id }, select: { id: true } },
          saves: { where: { userId: user?.id }, select: { id: true } },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // 过滤出有效帖子并转换结构
  const validPosts = savedPosts
    .filter((sp) => sp.post) // 过滤掉可能已删除的帖子
    .map((sp) => ({
      ...sp.post,
      isCurrentUser: true,
      saves: sp.post.saves, // 保留收藏状态
      likes: sp.post.likes, // 保留点赞状态
    }));
  return (
    <div>
      <h1 className="p-4 font-bold">我的收藏</h1>

      {/* 添加空状态提示 */}
      {validPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <span className="text-2xl">📝</span>
          <p className="mt-4">还没有收藏任何帖子</p>
        </div>
      ) : (
        validPosts.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))
      )}
    </div>
  );
}

export default SavePage;
