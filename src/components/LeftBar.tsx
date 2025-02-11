import Link from "next/link";
import React from "react";
import Image from "./Image";

const menuInfo = [
  {
    // 自己以及关注的人的动态
    id: 1,
    name: "Home",
    icon: "icons/home.svg",
    link: "/",
  },
  {
    // 使用用户的动态（时间排序）
    id: 2,
    name: "Explore",
    icon: "icons/explore.svg",
    link: "/",
  },
  {
    // 自己帖子的赞和评论，其他用户@自己的通知
    id: 3,
    name: "Notifications",
    icon: "icons/notification.svg",
    link: "/",
  },
  {
    // 私信功能
    id: 4,
    name: "Messages",
    icon: "icons/message.svg",
    link: "/",
  },
  {
    // 收藏的帖子
    id: 5,
    name: "Bookmarks",
    icon: "icons/bookmark.svg",
    link: "/",
  },
  {
    // 个人信息页面（发布的帖子、关注的用户）
    id: 6,
    name: "Profile",
    icon: "icons/profile.svg",
    link: "/",
  },
  // {
  //   name: "Communities",
  //   icon: "icons/community.svg",
  //   link: "/",
  // },
  // {
  //   name: "More",
  //   icon: "icons/more.svg",
  //   link: "/",
  // },
];
export default function LeftBar() {
  return (
    <div className="flex flex-col justify-between h-screen sticky top-0 pt-2 pb-8">
      {/* LOGO & Menu */}
      <div className="flex flex-col gap-4 items-center text-lg xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="hover:bg-[#181818] p-4 rounded-full">
          <Image path="icons/logo.svg" alt="logo" w={24} h={24} />
        </Link>
        {/* Menu */}
        <div className="flex flex-col gap-4">
          {menuInfo.map((item) => (
            <Link
              href={item.link}
              key={item.icon}
              className="flex gap-4 items-center p-2 rounded-full hover:bg-[#181818]"
            >
              <Image path={item.icon} alt={item.name} w={24} h={24} />
              <span className="hidden xxl:inline text-2xl">{item.name}</span>
            </Link>
          ))}
        </div>
        {/* Post */}
        <Link
          href="/compose/post"
          className="bg-white rounded-full xxl:hidden w-12 h-12 flex items-center justify-center"
        >
          <Image path="icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        <Link
          href="/compose/post"
          className="bg-white rounded-full text-black py-2 px-20 font-bold hidden xxl:block"
        >
          Post
        </Link>
      </div>
      {/* 用户信息 */}
      <Link
        href="/"
        className="flex justify-between items-center hover:bg-[#181818] p-2 rounded-full"
      >
        <div className="flex gap-2 items-center">
          <div>
            <Image
              path="/general/avatar.png"
              w={40}
              h={40}
              alt="avatar"
              className="rounded-full"
            />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="text-white font-bold truncate w-32">
              mingyang Yuan
            </span>
            <span className="text-textGray truncate w-32">@yuanmingyang</span>
          </div>
        </div>
        <div className="hidden xxl:block font-bold">...</div>
      </Link>
    </div>
  );
}
