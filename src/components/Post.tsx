import React from "react";
import Image from "./Image";
import PostInteraction from "./PostInteraction";
import PostMore from "./PostMore";

export default function Post() {
  return (
    <div className="flex gap-4 p-4 border-y-[1px] border-borderGray">
      {/* 头像 */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image path="general/avatar.png" alt="avatar" w={24} h={24} tr={true} />
      </div>
      {/* 内容 */}
      <div className="flex-1 flex flex-col gap-2">
        {/* 用户名、发帖时间 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-md font-bold">yuanmingyang</span>
            <span className="text-textGray">@ymy</span>
            <span className="text-textGray">time</span>
          </div>
          <PostMore />
        </div>
        {/* 帖子信息 */}
        {/* 文字内容 */}
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto vitae
          in quod aspernatur beatae nihil. Accusamus molestias culpa natus
          aspernatur incidunt eos beatae, ullam, consequuntur blanditiis non
          porro, eum obcaecati.
        </p>
        {/* 媒体信息 */}
        <Image
          path="general/post.jpeg"
          alt="avatar"
          w={600}
          h={600}
          className="rounded"
        />
        {/* 互动 */}
        <PostInteraction />
      </div>
    </div>
  );
}
