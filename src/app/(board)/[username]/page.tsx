import EditProfile from "@/components/EditProfile";
import FollowButton from "@/components/FollowButton";
import Image from "@/components/Image";
import Logout from "@/components/Logout";
import Posts from "@/components/Posts";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { userId } = await auth();
  const username = (await params).username;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
        },
      },
      followings: userId
        ? {
            where: {
              followerId: userId,
            },
          }
        : undefined,
    },
  });

  if (!user) return notFound();
  const isCurrentUser = userId === user.id;
  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
      </div>
      {/* 个人信息 */}
      <div className="">
        <div className="relative w-full">
          {/* 背景 */}
          <div className="w-full aspect-[3/1] relative">
            <Image
              path={user.cover || "general/cover.jpg"}
              alt=""
              w={600}
              h={200}
              tr={true}
            />
          </div>
          {/* 头像 */}
          <div className="w-1/6 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image
              path={user.img || "general/default.png"}
              alt=""
              w={100}
              h={100}
              tr={true}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 p-2">
          {isCurrentUser && <EditProfile />}
          {isCurrentUser && <Logout />}
          {!isCurrentUser && (
            <Link
              href={`/chat/${user.username}`}
              className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer"
            >
              <Image path="icons/message.svg" alt="chat" w={20} h={20} />
            </Link>
          )}
          {userId && !isCurrentUser && (
            <FollowButton
              isFollowed={!!user.followings.length}
              userId={user.id}
            />
          )}
        </div>
        {/* 详细信息 */}
        <div className="p-4 flex flex-col gap-2 mt-3">
          <div className="">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <span className="text-textGray text-sm">{user.email}</span>
          </div>
          {user.bio && <p>{user.bio}</p>}
          {/* 其他信息 */}
          <div className="flex gap-4 text-textGray text-[15px]">
            {/* <div className="flex items-center gap-2">
              <Image
                path="icons/userLocation.svg"
                alt="location"
                w={20}
                h={20}
              />
              <span>{user.location || "未知"}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" w={20} h={20} />
              <span>
                {new Date(user.createdAt.toString()).toLocaleDateString(
                  "zh-CN",
                  { month: "long", year: "numeric" }
                )}
                注册
              </span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">{user._count.followers}</span>
              <span className="text-textGray text-[15px]">关注</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{user._count.followings}</span>
              <span className="text-textGray text-[15px]">粉丝</span>
            </div>
          </div>
        </div>
      </div>
      {/* Posts */}
      <Posts userProfileId={user.id} />
    </div>
  );
};

export default UserPage;
