import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// export default clerkMiddleware();

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  // 添加 Webhook 路径为公开路由
  "/api/webhooks/clerk(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // 如果是 Webhook 请求，直接放行
  if (request.nextUrl.pathname.startsWith("/api/webhooks/clerk")) {
    console.log("Webhook request detected, skipping authentication.");
    return; // 跳过认证检查
  }

  // 其他非公开路由需要认证
  if (!isPublicRoute(request)) {
    await auth.protect();
  } else {
    console.log("Public route detected, allowing access.");
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
