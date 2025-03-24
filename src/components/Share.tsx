"use client";
import React, { useActionState, useEffect, useRef, useState } from "react";
import Image from "./Image";
import NextImage from "next/image";
import ImageEditor from "./ImageEditor";
import { addPost } from "@/action";

export default function Share() {
  const [media, setMedia] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState({
    type: "original" as "original" | "wide" | "square",
    sensitive: false,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const previewUrl = media ? URL.createObjectURL(media) : null;

  const [state, formAction, isPending] = useActionState(addPost, {
    success: false,
    error: false,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setMedia(null);
      setSettings({ type: "original", sensitive: false });
    }
  }, [state]);
  return (
    <form
      ref={formRef}
      className="flex gap-4 p-4 border-t-[1px] border-borderGray"
      action={formAction}
    >
      {/* 发帖部分 */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          name="imgType"
          value={settings.type}
          hidden
          readOnly
        />
        <input
          type="text"
          name="isSensitive"
          value={settings.sensitive ? "true" : "false"}
          hidden
          readOnly
        />
        <input
          name="desc"
          placeholder="有什么新鲜事？！"
          className="outline-none bg-transparent text-xl placeholder:text-textGray"
        />
        {/* 图片预览 */}
        {media?.type.includes("image") && previewUrl && (
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
              编辑
            </div>
            <div
              className="absolute h-8 w-8 top-2 right-2 flex items-center justify-center rounded-full text-white bg-black bg-opacity-50 text-sm cursor-pointer hover:bg-opacity-100"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}
        {/* 视频预览 */}
        {media?.type.includes("video") && previewUrl && (
          <div className="relative">
            <video src={previewUrl} controls />
            <div
              className="absolute h-8 w-8 top-2 right-2 flex items-center justify-center rounded-full text-white bg-black bg-opacity-50 text-sm cursor-pointer hover:bg-opacity-100"
              onClick={() => setMedia(null)}
            >
              X
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
            {/* 选择媒体文件 */}
            <input
              type="file"
              id="file"
              name="file"
              className="hidden"
              accept="image/*, video/*"
              onChange={handleFileSelect}
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
          </div>
          <button
            className="bg-white text-black font-bold rounded-full py-2 px-4 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "发布中..." : "发布"}
          </button>
          {state.error && (
            <span className="text-red-300 p-4">遇到问题了，请稍后再试</span>
          )}
        </div>
      </div>
    </form>
  );
}
