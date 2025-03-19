"use client";
import Image from "./Image";
import PostInteractions from "./PostInteractions";
import Link from "next/link";
import { Post as PostType } from "@prisma/client";
import { format, register } from "timeago.js";
import zh_CN from "timeago.js/lib/lang/zh_CN";
import Video from "./Video";
import { delPost } from "@/action";
import { useState } from "react";
import toast from "react-hot-toast";

type UserType = {
  displayName: string | null;
  username: string;
  img: string | null;
};

type InteractionsType = {
  _count: {
    likes: number;
    comments: number;
  };
  likes: {
    id: number;
  }[];
  saves: {
    id: number;
  }[];
};

type PostWithDetails = PostType &
  InteractionsType & {
    user: UserType;
  };

register("zh_CN", zh_CN);

const Post = ({
  type,
  post,
}: {
  type?: "status" | "comment";
  post: PostWithDetails & { isCurrentUser: boolean };
}) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const deletePost = async (postId: number) => {
    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p>确定要删除这条帖子吗？</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-2 py-1 text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-2 py-1 text-sm text-red-500"
              >
                确认删除
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
        }
      );
    });

    if (confirmed) {
      try {
        await toast.promise(delPost(postId), {
          loading: "删除中...",
          success: "帖子已删除",
          error: "删除失败",
        });
        setIsDeleted(true);
      } catch (error) {
        console.error("删除失败:", error);
      }
    }
  };

  if (isDeleted) return null; // 如果帖子已删除，返回 null 不渲染

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* POST CONTENT */}
      <div className={`flex gap-4 ${type === "status" && "flex-col"}`}>
        {/* AVATAR */}
        <div
          className={`${
            type === "status" && "hidden"
          } relative w-10 h-10 rounded-full overflow-hidden`}
        >
          <Image
            path={post.user.img || "general/default.png"}
            alt=""
            w={100}
            h={100}
            tr={true}
          />
        </div>
        {/* 内容模块 */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <Link href={`/${post.user.username}`} className="flex gap-4">
              {post.user.img && (
                <div
                  className={`${
                    type !== "status" && "hidden"
                  } relative w-10 h-10 rounded-full overflow-hidden z-10`}
                >
                  <Image
                    path={post.user.img || "general/default.png"}
                    alt=""
                    w={100}
                    h={100}
                    tr={true}
                  />
                </div>
              )}

              <div
                className={`flex items-center gap-2 flex-wrap ${
                  type === "status" && "flex-col gap-0 !items-start"
                }`}
              >
                <h1 className="text-md font-bold">{post.user.username}</h1>
                {type !== "status" && (
                  <span className="text-textGray">
                    {format(post.createdAt, "zh_CN")}
                  </span>
                )}
              </div>
            </Link>
            {/* 如果是当前用户的帖子，显示删除按钮 */}
            {post.isCurrentUser && (
              <button
                onClick={() => deletePost(post.id)}
                className="text-red-500 hover:text-red-600"
              >
                删除
              </button>
            )}
          </div>
          {/* 内容信息 */}
          <Link href={`/${post.user.username}/status/${post.id}`}>
            <p className={`${type === "status" && "text-lg"}`}>{post.desc}</p>
          </Link>
          {post.img && (
            <Image path={post.img} alt="" w={600} h={post.imgHeight || 600} />
          )}
          {post.video && (
            <div className="rounded-lg overflow-hidden">
              <Video
                path={post.video}
                className={post.isSensitive ? "blur-3xl" : ""}
              />
            </div>
          )}

          {type === "status" && (
            <span className="text-textGray">
              {format(post.createdAt, "zh_CN")}
            </span>
          )}
          <PostInteractions
            username={post.user.username}
            postId={post.id}
            count={post._count}
            isLiked={!!post.likes.length}
            isSaved={!!post.saves.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
