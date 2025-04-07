"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { imagekit } from "./utils";
import { User } from "@prisma/client";

// 同步用户信息到数据库
export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        id: userId,
        displayName: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}
export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });
  } else {
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId },
    });
  }
};
export const likePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }
};

export const delPost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;
  const existingRePost = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });
  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    });
  }
};

export const savePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingSavedPost) {
    await prisma.savedPosts.delete({
      where: { id: existingSavedPost.id },
    });
  } else {
    await prisma.savedPosts.create({
      data: { userId, postId },
    });
  }
};

export const addComment = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  const postId = formData.get("postId");
  const username = formData.get("username");
  const desc = formData.get("desc");

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140),
  });

  const validatedFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
      },
    });
    revalidatePath(`/${username}/status/${postId}`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-1000,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/posts",
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  const Post = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  });

  const validatedFields = Post.safeParse({
    desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file.size) {
    const result: UploadResponse = await uploadFile(file);

    if (result.fileType === "image") {
      img = result.filePath;
      imgHeight = result.height;
    } else {
      video = result.filePath;
    }
  }

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
        img,
        imgHeight,
        video,
      },
    });
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// 更新用户资料
export const updateUserProfile = async (
  prevState: { success: boolean; error: boolean; message?: string },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true, message: "未登录" };

  // 先从数据库获取旧用户数据
  const oldUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!oldUser) return { success: false, error: true, message: "用户不存在" };
  const updateData: User = {
    // 初始化更新数据为旧数据
    ...oldUser,
  };
  const username = formData.get("username") || updateData.username;
  const bio = formData.get("bio") || updateData.bio;
  const job = formData.get("job") || updateData.job;
  const website = formData.get("website") || updateData.website;
  const img = (formData.get("img") as File) || updateData.img;
  const cover = (formData.get("cover") as File) || updateData.cover;

  const uploadFile = async (
    file: File,
    type: "img" | "cover"
  ): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/users",
          transformation: {
            pre: `${type === "img" ? "w-100,h-100" : "w-600,h-200"}`,
          },
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  const UserProfile = z.object({
    username: z.string().min(4).max(64),
    bio: z.string().max(255).nullable().optional(),
    job: z.string().max(100).nullable().optional(),
    website: z.string().nullable().optional(),
  });

  const validatedFields = UserProfile.safeParse({
    username,
    bio,
    job,
    website,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true, message: "数据无效" };
  }

  try {
    // 仅添加有值的字段到更新数据中
    if (validatedFields.data.username) {
      // 检查新的 username 是否已经被其他用户使用
      const existingUserWithUsername = await prisma.user.findFirst({
        where: {
          username: validatedFields.data.username,
          id: { not: userId },
        },
      });
      if (existingUserWithUsername) {
        return {
          success: false,
          error: true,
          message: "用户名重复，换一个吧~",
        };
      }
      updateData.username = validatedFields.data.username;
    }
    if (validatedFields.data.bio) {
      updateData.bio = validatedFields.data.bio;
    }
    if (validatedFields.data.job) {
      updateData.job = validatedFields.data.job;
    }
    if (validatedFields.data.website) {
      updateData.website = validatedFields.data.website;
    }

    // 处理图片上传逻辑，这里假设需要实现图片上传函数
    if (img?.size) {
      const imgRes: UploadResponse = await uploadFile(img, "img");
      updateData.img = imgRes.filePath;
    }

    if (cover?.size) {
      const coverPath = await uploadFile(cover, "cover");
      updateData.cover = coverPath.filePath;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath(`/${username}`);
    return { success: true, error: false, message: "更新成功" };
  } catch (err) {
    console.log("更新用户信息出错", err);
    return { success: false, error: true, message: "更新失败" };
  }
};
