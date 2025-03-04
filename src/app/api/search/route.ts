import { NextRequest } from "next/server";
import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query } },
        { displayName: { contains: query } },
      ],
    },
    take: 5,
    select: {
      id: true,
      username: true,
      displayName: true,
      img: true,
    },
  });

  return Response.json({ users });
}
