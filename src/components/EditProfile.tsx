"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useActionState } from "react";
import { updateUserProfile } from "@/action";

function EditProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateUserProfile, {
    success: false,
    error: false,
    message: "",
  });

  const handleClickEdit = () => {
    setIsOpen(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "img" | "cover"
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("请选择图片文件");
        return;
      }
    }
  };

  React.useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div>
      <button
        className="py-2 px-4 bg-white text-black font-bold rounded-full"
        onClick={handleClickEdit}
      >
        编辑
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl p-12 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">编辑个人资料</h2>
            <form action={formAction}>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-textGrayLight text-sm font-bold mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="w-full p-2 rounded bg-inputGray text-white placeholder:text-textGray focus:outline-none"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label className="block text-textGrayLight text-sm font-bold mb-2">
                    个人介绍
                  </label>
                  <textarea
                    name="bio"
                    className="w-full p-2 rounded bg-inputGray text-white placeholder:text-textGray focus:outline-none"
                    placeholder="Bio"
                  />
                </div>
                <div>
                  <label className="block text-textGrayLight text-sm font-bold mb-2">
                    工作
                  </label>
                  <input
                    type="text"
                    name="job"
                    className="w-full p-2 rounded bg-inputGray text-white placeholder:text-textGray focus:outline-none"
                    placeholder="Job"
                  />
                </div>
                <div>
                  <label className="block text-textGrayLight text-sm font-bold mb-2">
                    网站
                  </label>
                  <input
                    type="text"
                    name="website"
                    className="w-full p-2 rounded bg-inputGray text-white placeholder:text-textGray focus:outline-none"
                    placeholder="Website"
                  />
                </div>
                <div>
                  <label className="block text-textGrayLight text-sm font-bold mb-2">
                    头像
                  </label>
                  <input
                    type="file"
                    name="img"
                    accept="image/*"
                    className="text-white"
                    onChange={(e) => handleFileChange(e, "img")}
                  />
                </div>
                <div>
                  <label className="block text-textGrayLight text-sm font-bold mb-2">
                    背景图
                  </label>
                  <input
                    type="file"
                    name="cover"
                    accept="image/*"
                    className="text-white"
                    onChange={(e) => handleFileChange(e, "cover")}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  className="py-2 px-4 rounded bg-red-500 text-white font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="py-2 px-4 rounded-full bg-iconBlue text-white font-bold disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                  {isPending ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
