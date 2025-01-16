import React from "react";
import Image from "./Image";

export default function Share() {
  return (
    <div className="flex gap-4 p-4">
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          path="general/avatar.png"
          alt="avatar"
          w={100}
          h={100}
          tr={true}
        />
      </div>
      {/* Share input */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          placeholder="What is happening?!"
          className="outline-none bg-transparent text-xl placeholder:text-textGray"
        />
        <div className="flex justify-between items-center py-2">
          <div className="flex gap-2">
            <Image
              path="icons/image.svg"
              alt="image"
              w={20}
              h={20}
              className="cursor-pointer"
            />
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
    </div>
  );
}
