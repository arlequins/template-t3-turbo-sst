import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const AppRouter = createTRPCRouter({
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof AppRouter;
