"use client";
import Image from "./Image";
import PostInteractions from "./PostInteractions";
import Link from "next/link";
import { Post as PostType } from "@prisma/client";
import { format, register } from "timeago.js";
import zh_CN from "timeago.js/lib/lang/zh_CN";
import Video from "./Video";
import { useUser } from "@clerk/nextjs";
import { delPost } from "@/action";
import { useState } from "react";

type UserType = {
  displayName: string | null;
  username: string;
  img: string | null;
};

type InteractionsType = {
  _count: {
    likes: number;
    rePosts: number;
    comments: number;
  };
  likes: {
    id: number;
  }[];
  rePosts: {
    id: number;
  }[];
  saves: {
    id: number;
  }[];
};

type PostWithDetails = PostType &
  InteractionsType & {
    user: UserType;
    rePost?: (PostType & InteractionsType & { user: UserType }) | null;
  };

register("zh_CN", zh_CN);

const Post = ({
  type,
  post,
}: {
  type?: "status" | "comment";
  post: PostWithDetails;
}) => {
  const { user } = useUser();
  const originalPost = post.rePost || post;
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const deletePost = async (postId: number) => {
    const confirmed = window.confirm("确定要删除这条帖子吗？");
    if (confirmed) {
      try {
        await delPost(postId);
        setIsDeleted(true); // 标记帖子为已删除
      } catch (error) {
        console.error("删除失败:", error);
      }
    }
  };

  if (isDeleted) return null; // 如果帖子已删除，返回 null 不渲染

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* 帖子类型 */}
      {post.rePostId && (
        <div className="flex items-center gap-2 text-sm text-textGray mb-2 from-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#71767b"
              d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
            />
          </svg>
          <span>{post.user.displayName} 转发</span>
        </div>
      )}

      {/* POST CONTENT */}
      <div className={`flex gap-4 ${type === "status" && "flex-col"}`}>
        {/* AVATAR */}
        <div
          className={`${
            type === "status" && "hidden"
          } relative w-10 h-10 rounded-full overflow-hidden`}
        >
          <Image
            path={originalPost.user.img || "general/default.png"}
            alt=""
            w={100}
            h={100}
            tr={true}
          />
        </div>
        {/* 内容模块 */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <Link
              href={`/${originalPost.user.username}`}
              className="flex gap-4"
            >
              {post.user.img && (
                <div
                  className={`${
                    type !== "status" && "hidden"
                  } relative w-10 h-10 rounded-full overflow-hidden`}
                >
                  <Image
                    path={originalPost.user.img || "general/default.png"}
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
                <h1 className="text-md font-bold">
                  {originalPost.user.displayName}
                </h1>
                {type !== "status" && (
                  <span className="text-textGray">
                    {format(originalPost.createdAt, "zh_CN")}
                  </span>
                )}
              </div>
            </Link>
            {/* 如果是当前用户的帖子，显示删除按钮 */}
            {user?.id === originalPost.userId && (
              <button
                onClick={() => deletePost(originalPost.id)}
                className="text-red-500 hover:text-red-600"
              >
                删除
              </button>
            )}
          </div>
          {/* 内容信息 */}
          <Link
            href={`/${originalPost.user.username}/status/${originalPost.id}`}
          >
            <p className={`${type === "status" && "text-lg"}`}>
              {originalPost.desc}
            </p>
          </Link>
          {originalPost.img && (
            <Image
              path={originalPost.img}
              alt=""
              w={600}
              h={originalPost.imgHeight || 600}
            />
          )}
          {originalPost.video && (
            <div className="rounded-lg overflow-hidden">
              <Video
                path={originalPost.video}
                className={originalPost.isSensitive ? "blur-3xl" : ""}
              />
            </div>
          )}

          {type === "status" && (
            <span className="text-textGray">
              {format(originalPost.createdAt, "zh_CN")}
            </span>
          )}
          <PostInteractions
            username={originalPost.user.username}
            postId={originalPost.id}
            count={originalPost._count}
            isLiked={!!originalPost.likes.length}
            isReposted={!!originalPost.rePosts.length}
            isSaved={!!originalPost.saves.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
