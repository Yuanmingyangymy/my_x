"use client";
import React, { useState } from "react";
import Image from "./Image";
import NextImage from "next/image";
import { shareAction } from "@/actions";
import ImageEditor from "./ImageEditor";

export default function Share() {
  const [media, setMedia] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState({
    type: "original" as "original" | "wide" | "square",
    sensitive: false,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const previewUrl = media ? URL.createObjectURL(media) : null;
  return (
    <form
      className="flex gap-4 p-4"
      action={(formData) => shareAction(formData, settings)}
    >
      {/* 头像 */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          path="general/avatar.png"
          alt="avatar"
          w={100}
          h={100}
          tr={true}
        />
      </div>
      {/* 发帖部分 */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          name="desc"
          placeholder="What is happening?!"
          className="outline-none bg-transparent text-xl placeholder:text-textGray"
        />
        {/* 图片预览 */}
        {previewUrl && (
          <div className="relative overflow-hidden rounded-xl">
            <NextImage
              src={previewUrl}
              width={600}
              height={600}
              alt="media"
              className={`w-full ${
                settings.type === "original"
                  ? "h-full object-contain"
                  : settings.type === "square"
                  ? "aspect-square object-cover"
                  : "aspect-video object-cover"
              }`}
            />
            <div
              className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-4 py-1 rounded-full cursor-pointer"
              onClick={() => setIsEditorOpen(true)}
            >
              Edit
            </div>
          </div>
        )}
        {isEditorOpen && previewUrl && (
          <ImageEditor
            onClose={() => setIsEditorOpen(false)}
            previewURL={previewUrl}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        <div className="flex justify-between items-center py-2">
          <div className="flex gap-2">
            {/* 选择图片 */}
            <input
              type="file"
              id="file"
              name="file"
              className="hidden"
              accept="image/*, video/*"
              onChange={handleImageSelect}
            />
            <label htmlFor="file">
              <Image
                path="icons/image.svg"
                alt="image"
                w={20}
                h={20}
                className="cursor-pointer"
              />
            </label>
            <Image
              path="icons/gif.svg"
              alt="gif"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/poll.svg"
              alt="poll"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/emoji.svg"
              alt="emoji"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/schedule.svg"
              alt="schedule"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="icons/location.svg"
              alt="location"
              w={20}
              h={20}
              className="cursor-pointer"
            />
          </div>
          <button className="bg-white rounded-full py-2 px-4 text-black font-bold">
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
