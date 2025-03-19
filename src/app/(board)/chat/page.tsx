"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "@/components/Image";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  displayName: string | null;
  img: string | null;
};

const ChatPage = () => {
  const { user } = useUser();
  const [friends, setFriends] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // 获取好友列表
        const friendsResponse = await fetch(`/api/friends?userId=${user.id}`);
        const friendsData = await friendsResponse.json();
        setFriends(friendsData);

        // 获取可能认识的人
        const suggestionsResponse = await fetch(
          `/api/suggestions?userId=${user.id}`
        );
        const suggestionsData = await suggestionsResponse.json();
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex h-screen">
      {/* 左侧好友列表 */}
      <div className="w-full border-r border-borderGray p-4">
        <h2 className="text-lg font-bold mb-4">关注的人</h2>
        <div className="space-y-2">
          {friends.map((friend) => (
            <Link
              key={friend.id}
              href={`/chat/${friend.username}`}
              className="flex items-center gap-3 p-2 hover:bg-inputGray rounded-lg bg-gray-800"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  path={friend.img || "general/default.png"}
                  alt={friend.username}
                  w={40}
                  h={40}
                />
              </div>
              <div>
                <p className="font-medium">
                  {friend.displayName || friend.username}
                </p>
                <p className="text-sm text-textGray">@{friend.username}</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-lg font-bold mt-6 mb-4">可能认识的人</h2>
        <div className="space-y-2">
          {suggestions.map((user) => (
            <Link
              key={user.id}
              href={`/chat/${user.username}`}
              className="flex items-center gap-3 p-2 hover:bg-inputGray rounded-lg bg-gray-800"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  path={user.img || "general/default.png"}
                  alt={user.username}
                  w={40}
                  h={40}
                />
              </div>
              <div>
                <p className="font-medium">
                  {user.displayName || user.username}
                </p>
                <p className="text-sm text-textGray">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* 右侧占位内容 */}
      {/* <div className="flex-1 flex items-center justify-center">
        <p className="text-textGray">和一个朋友聊天吧~</p>
      </div> */}
    </div>
  );
};

export default ChatPage;
