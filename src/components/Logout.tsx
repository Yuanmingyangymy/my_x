"use client";
import { useClerk } from "@clerk/nextjs";
import React from "react";
import toast from "react-hot-toast";

function Logout() {
  const { signOut } = useClerk();

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>确定要退出登录吗？</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                signOut(() => {
                  window.location.href = "/sign-in";
                });
                toast.dismiss(t.id);
              }}
              className="px-2 py-1 text-sm"
            >
              取消
            </button>
            <button
              onClick={() => {
                signOut(() => {
                  window.location.href = "/sign-in";
                });
                toast.dismiss(t.id);
              }}
              className="px-2 py-1 text-sm text-red-500"
            >
              确认
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };
  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-white text-black font-bold rounded-full"
    >
      退出登录
    </button>
  );
}

export default Logout;
