import { NextRequest } from "next/server";
import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json([]);
  }

  // 获取除了用户自身及其关注者之外的其他用户
  const suggestions = await prisma.$queryRaw`
    SELECT u.id, u.username, u.displayName, u.img
    FROM User u
    WHERE u.id != ${userId}
    AND u.id NOT IN (
      SELECT followingId FROM Follow WHERE followerId = ${userId}
    )
    ORDER BY RAND()
    LIMIT 3
  `;
  return Response.json(suggestions);
}
