import { NextRequest } from "next/server";
import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json([]);
  }

  // 获取好友的好友
  const friendsOfFriends = await prisma.$queryRaw`
    SELECT DISTINCT u.id, u.username, u.displayName, u.img
    FROM Follow f1
    JOIN Follow f2 ON f1.followingId = f2.followerId
    JOIN User u ON f2.followingId = u.id
    WHERE f1.followerId = ${userId}
    AND f2.followingId != ${userId}
    AND f2.followingId NOT IN (
      SELECT followingId FROM Follow WHERE followerId = ${userId}
    )
    LIMIT 10
  `;

  return Response.json(friendsOfFriends);
}
