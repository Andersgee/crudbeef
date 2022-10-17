// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { beefRouter } from "./beef";
import { authRouter } from "./auth";

export const appRouter = router({
  beef: beefRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
