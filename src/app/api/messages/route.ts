import { NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const targetUser = searchParams.get("targetUser");

  if (!userId || !targetUser) {
    return Response.json({ messages: [] });
  }
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: targetUser },
        { senderId: targetUser, receiverId: userId },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json({
    messages: messages.map((msg) => ({
      ...msg,
      timestamp: msg.createdAt.toISOString(), // 将Date转换为ISO字符串
    })),
  });
}

export async function POST(request: Request) {
  try {
    const message = await request.json();

    const createdMessage = await prisma.message.create({
      data: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        type: message.type,
        createdAt: message.timestamp,
      },
    });

    return NextResponse.json(createdMessage);
  } catch (error) {
    console.error("保存消息失败:", error);
    return NextResponse.json({ error: "保存消息失败" }, { status: 500 });
  }
}
