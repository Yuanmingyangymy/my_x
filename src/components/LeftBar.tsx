"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "./Image";
import Socket from "./Socket";
import Notification from "./Notification";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";

export default function LeftBar() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<User>();
  const menuInfo = [
    {
      // 自己以及关注的人的动态
      id: 1,
      name: "首页",
      icon: "icons/home.svg",
      link: "/",
    },
    // {
    //   // 使用用户的动态（时间排序）
    //   id: 2,
    //   name: "探索",
    //   icon: "icons/explore.svg",
    //   link: "/",
    // },
    // {
    //   // 自己帖子的赞和评论，其他用户@自己的通知
    //   id: 3,
    //   name: "通知",
    //   icon: "icons/notification.svg",
    //   link: "/",
    // },
    {
      // 私信功能
      id: 4,
      name: "聊天",
      icon: "icons/message.svg",
      link: "/chat",
    },
    {
      // 收藏的帖子
      id: 5,
      name: "收藏",
      icon: "icons/bookmark.svg",
      link: "/",
    },
    {
      // 个人信息页面（发布的帖子、关注的用户）
      id: 6,
      name: "我的",
      icon: "icons/profile.svg",
      link: `/${user?.username}`,
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
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/user?userId=${user.id}`);
          const data = await res.json();
          console.log("😀", data);

          setUserInfo(data);
        } catch (error) {
          console.error("获取用户信息失败:", error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

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
          {menuInfo.map((item, index) => (
            <div key={item.id || index}>
              {index === 2 && (
                <div>
                  <Notification />
                </div>
              )}
              <Link
                href={item.link}
                className="flex gap-4 items-center py-2 px-6 rounded-full hover:bg-[#181818]"
              >
                <Image path={item.icon} alt={item.name} w={24} h={24} />
                <span className="hidden xxl:inline text-2xl">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Socket />
      {/* 用户信息 */}
      <Link
        href={`/${user?.username}`}
        className="flex justify-between items-center hover:bg-[#181818] p-2 rounded-full"
      >
        <div className="flex gap-2 items-center">
          <div>
            <Image
              path="/general/default.png"
              w={40}
              h={40}
              alt="avatar"
              className="rounded-full"
            />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="text-white font-bold truncate w-32">
              {userInfo?.username}
            </span>
            <span className="text-textGray truncate w-32">
              {userInfo?.email}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
