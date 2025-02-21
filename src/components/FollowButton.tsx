"use client";

function FollowButton({ isFollowed }: { isFollowed: boolean }) {
  return (
    <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
      {isFollowed ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
