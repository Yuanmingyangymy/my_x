import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";
import Posts from "@/components/Posts";
import FollowedUsers from "@/components/FollowedUsers";

export default async function CommunityPage() {
  const { userId } = await auth();
  if (!userId) return null;

  // 获取当前用户关注的人
  const followedUsers = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          displayName: true,
          img: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部关注用户列表 */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">已关注的人</h2>
        {followedUsers.length > 0 ? (
          <FollowedUsers users={followedUsers.map((f) => f.following)} />
        ) : (
          <div className="text-textGray">你还没有关注任何人</div>
        )}
      </div>

      {/* 帖子列表 */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">关注的人的动态</h2>
        <Posts />
      </div>
    </div>
  );
}
