import { NextRequest } from "next/server";
import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json([]);
  }

  // 获取好友列表
  const friends = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          displayName: true,
          img: true,
        },
      },
    },
  });

  return Response.json(friends.map((f) => f.following));
}
