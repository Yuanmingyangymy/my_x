"use client";

import { useEffect, useState } from "react";
import Image from "./Image";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type NotificationType = {
  id: string;
  senderUsername: string;
  type: "like" | "comment" | "follow";
  link: string;
};

function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isShowingToast, setIsShowingToast] = useState(false); // 新增状态控制

  useEffect(() => {
    socket.on("getNotification", (data: NotificationType) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, []);

  const diffrentType = (type: string) => {
    switch (type) {
      case "like":
        return "点赞了你的帖子";
      case "comment":
        return "评论了你的帖子";
      case "follow":
        return "关注了你";
      default:
        return "";
    }
  };

  const router = useRouter();

  const handleClick = (notification: NotificationType) => {
    const fileredList = notifications.filter((n) => n.id !== notification.id);
    setNotifications(fileredList);
    router.push(notification.link);
  };

  const showNotificationList = () => {
    if (isShowingToast) return;

    const currentNotifications = [...notifications];
    setNotifications([]);
    setIsShowingToast(true);

    if (currentNotifications.length === 0) {
      toast("暂无新通知", {
        icon: "💤",
        duration: 2000,
      });
      setTimeout(() => setIsShowingToast(false), 2000);
      return;
    }

    toast(
      <div className="absolute -top-2 -right-full p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max z-50">
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
      </div>,
      {
        duration: 2000,
      }
    );
    // 通过监听 toast 变化实现关闭回调
    setTimeout(() => {
      setIsShowingToast(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <div
        className="flex gap-4 items-center py-2 px-6 mb-4 rounded-full cursor-pointer hover:bg-[#181818]"
        onClick={showNotificationList}
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
    </div>
  );
}

export default Notification;
