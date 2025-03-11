"use client";
import { Post as PostType, User } from "@prisma/client";
import Image from "./Image";
import Post from "./Post";
import { useUser } from "@clerk/nextjs";
import { useActionState, useEffect, useState } from "react";
import { addComment } from "@/action";
import { socket } from "@/socket";

type CommentWithDetails = PostType & {
  user: { displayName: string | null; username: string; img: string | null };
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Comments = ({
  comments,
  postId,
  username,
}: {
  comments: CommentWithDetails[];
  postId: number;
  username: string;
}) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [userInfo, setUserInfo] = useState<User>();

  const [state, formAction, isPending] = useActionState(addComment, {
    success: false,
    error: false,
  });

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

  useEffect(() => {
    if (state.success) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: user?.username,
          type: "comment",
          link: `/${username}/status/${postId}`,
        },
      });
    }
  }, [state.success, username, postId, user?.username]);
  return (
    <div className="">
      {user && (
        <form
          action={formAction}
          className="flex items-center justify-between gap-4 p-4 "
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={userInfo?.img || "general/default.png"}
              alt="Lama Dev"
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <input type="number" name="postId" hidden readOnly value={postId} />
          <input
            type="string"
            name="username"
            hidden
            readOnly
            value={username}
          />
          <input
            type="text"
            name="desc"
            className="flex-1 bg-transparent outline-none p-2 text-xl"
            placeholder="输入你的想法..."
          />
          <button
            disabled={isPending}
            className="py-2 px-4 font-bold bg-white text-black rounded-full disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            {isPending ? "评论中..." : "评论"}
          </button>
        </form>
      )}
      {state.error && (
        <span className="text-red-300 p-4">遇到错误，请稍后再试！</span>
      )}
      {comments.map((comment) => (
        <div key={comment.id}>
          <Post key={comment.id} post={comment} type="comment" />
        </div>
      ))}
    </div>
  );
};

export default Comments;
