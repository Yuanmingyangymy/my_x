import { NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const senderUsername = searchParams.get("senderUsername");
  const receiverUsername = searchParams.get("receiverUsername");

  if (!senderUsername || !receiverUsername) {
    return Response.json({ messages: [] });
  }
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderUsername, receiverUsername },
        { senderUsername: receiverUsername, receiverUsername: senderUsername },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json({
    messages: messages.map((msg) => ({
      ...msg,
      timestamp: msg.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  try {
    const message = await request.json();

    const createdMessage = await prisma.message.create({
      data: {
        id: message.id,
        senderUsername: message.senderUsername,
        receiverUsername: message.receiverUsername,
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
