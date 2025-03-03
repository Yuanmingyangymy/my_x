"use client";

import { useEffect, useState } from "react";
import Image from "./Image";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";

type NotificationType = {
  id: string;
  senderUsername: string;
  type: "like" | "comment" | "rePost" | "follow";
  link: string;
};

function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("getNotification", (data: NotificationType) => {
      console.log("data", data);
      setNotifications((prev) => [...prev, data]);
    });
  }, []);

  const diffrentType = (type: string) => {
    console.log("testType", type);

    switch (type) {
      case "like":
        return "点赞了你的帖子";
      case "comment":
        return "评论了你的帖子";
      case "rePost":
        return "转发了你的帖子";
      case "follow":
        return "关注了你";
      default:
        return "";
    }
  };

  const router = useRouter();
  const reset = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const handleClick = (notification: NotificationType) => {
    const fileredList = notifications.filter((n) => n.id !== notification.id);
    setNotifications(fileredList);
    setIsOpen(false);
    router.push(notification.link);
  };
  return (
    <div className="relative">
      <div
        className="flex gap-4 items-center p-2 rounded-full cursor-pointer hover:bg-[#181818]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="relative">
          <Image path={`icons/notification.svg`} alt="" w={24} h={24} />
          {notifications.length > 0 && (
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-iconBlue p-2 rounded-full flex items-center justify-center text-sm">
              {notifications.length}
            </div>
          )}
        </div>
        <span className="hidden xxl:inline text-2xl">通知</span>
      </div>
      {isOpen && (
        <div className="absolute -right-full p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max z-50">
          <h1>通知列表</h1>
          {notifications.map((notification) => (
            <div
              className="cursor-pointer"
              key={notification.id}
              onClick={() => handleClick(notification)}
            >
              <b>{notification.senderUsername}</b>{" "}
              {diffrentType(notification.type)}
            </div>
          ))}
          <button
            onClick={reset}
            className="bg-black text-white p-2 text-sm rounded-lg"
          >
            标为已读
          </button>
        </div>
      )}
    </div>
  );
}

export default Notification;
