"use client";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { socket } from "@/socket";
import Image from "@/components/Image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
// import { imagekit } from "@/utils";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "image" | "video" | "emoji";
  timestamp: Date;
};

const ChatPage = () => {
  const { user } = useUser();
  const { username } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载历史消息
  useEffect(() => {
    if (!user || !username) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `/api/messages?userId=${user.id}&targetUser=${username}`
        );
        const data = await res.json();
        // 将timestamp字符串转换为Date对象
        setMessages(
          data.messages.map((msg: { timestamp: string | number | Date }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (error) {
        console.error("加载消息失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [user, username]);

  // 监听新消息
  useEffect(() => {
    if (!user || !username) return;

    socket.on("newMessage", (message: Message) => {
      if (
        (message.senderId === username && message.receiverId === user.id) ||
        (message.receiverId === username && message.senderId === user.id)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            timestamp: new Date(message.timestamp),
          },
        ]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [user, username]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessageToDB = async (message: Message) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (!res.ok) {
        throw new Error("保存消息失败");
      }
    } catch (error) {
      console.error("保存消息到数据库失败:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !username || !user) return;

    const message: Message = {
      id: uuidv4(),
      senderId: user.id,
      receiverId: username as string,
      content: input,
      type: "text",
      timestamp: new Date(),
    };

    await saveMessageToDB(message);
    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  // const handleFileUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   type: "image" | "video"
  // ) => {
  // const file = e.target.files?.[0];
  // if (!file || !username || !user) return;
  // const uploadFile = async (file: File): Promise<UploadResponse> => {
  //   const bytes = await file.arrayBuffer();
  //   const buffer = Buffer.from(bytes);
  //   return new Promise((resolve, reject) => {
  //     imagekit.upload(
  //       {
  //         file: buffer,
  //         fileName: file.name,
  //         folder: "/chat",
  //       },
  //       function (error, result) {
  //         if (error) reject(error);
  //         else resolve(result as UploadResponse);
  //       }
  //     );
  //   });
  // };
  // try {
  //   const result = await uploadFile(file);
  //   const message: Message = {
  //     id: uuidv4(),
  //     senderId: user.id,
  //     receiverId: username as string,
  //     content: result.filePath,
  //     type,
  //     timestamp: new Date(),
  //   };
  //   await saveMessageToDB(message);
  //   socket.emit("sendMessage", message);
  //   setMessages((prev) => [...prev, message]);
  // } catch (error) {
  //   console.error("文件上传失败:", error);
  // }
  // };

  const handleEmojiSelect = async (emoji: EmojiClickData) => {
    if (!username || !user) return;

    const message: Message = {
      id: uuidv4(),
      senderId: user.id,
      receiverId: username as string,
      content: emoji.emoji,
      type: "emoji",
      timestamp: new Date(),
    };

    await saveMessageToDB(message);
    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]);
    setShowEmojiPicker(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex">
          <Link href="/chat" className="text-iconBlue text-lg mr-2">
            &lt;返回列表
          </Link>
          <h2 className="text-lg font-bold ">与 {username} 的聊天</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.senderId === user?.id ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.senderId === user?.id ? "bg-iconBlue" : "bg-inputGray"
                }`}
              >
                {msg.type === "text" && <p>{msg.content}</p>}
                {msg.type === "image" && (
                  <Image
                    src={msg.content}
                    alt="chat image"
                    className="max-w-full h-auto rounded"
                  />
                )}
                {msg.type === "video" && (
                  <video controls className="max-w-full h-auto rounded">
                    <source src={msg.content} />
                  </video>
                )}
                {msg.type === "emoji" && (
                  <span className="text-2xl">{msg.content}</span>
                )}
                <p className="text-xs text-textGrayLight mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-borderGray">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-inputGray rounded-full"
            >
              😊
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-inputGray rounded-full px-4 py-2 outline-none"
              placeholder="输入消息..."
            />
            {/* <label className="cursor-pointer p-2 hover:bg-inputGray rounded-full">
              📷
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "image")}
              />
            </label>
            <label className="cursor-pointer p-2 hover:bg-inputGray rounded-full">
              🎥
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "video")}
              />
            </label> */}
            <button
              onClick={handleSendMessage}
              className="bg-iconBlue text-white px-4 py-2 rounded-full"
            >
              发送
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-20">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
