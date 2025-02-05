import React from "react";
import Post from "./Post";
import { prisma } from "@/prisma";

export default async function Posts() {
  const posts = await prisma.post.findMany();
  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Post />
          </div>
        );
      })}
    </div>
  );
}
