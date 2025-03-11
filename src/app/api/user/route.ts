import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

// 根据user.id获取用户信息
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json([]);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return Response.json(user);
}
