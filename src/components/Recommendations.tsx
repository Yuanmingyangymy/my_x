import Link from "next/link";
import Image from "./Image";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";

const Recommendations = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const followingIds = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followedUserIds = followingIds.map((f) => f.followingId);

  const friendRecommendations = await prisma.user.findMany({
    where: {
      id: { not: userId, notIn: followedUserIds },
      followings: { some: { followerId: { in: followedUserIds } } },
    },
    take: 3,
    select: { id: true, displayName: true, username: true, img: true },
  });

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {friendRecommendations.map((person) => (
        <div className="flex items-center justify-between" key={person.id}>
          {/* 用户信息 */}
          <div className="flex items-center gap-2">
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image
                src={person.img || "general/default.png"}
                alt={person.username}
                w={100}
                h={100}
                tr={true}
              />
            </div>
            <div className="">
              <h1 className="text-md font-bold">
                {person.displayName || person.username}
              </h1>
              <span className="text-textGray text-sm">@{person.username}</span>
            </div>
          </div>
          {/* 关注... */}
          <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
            关注
          </button>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
