import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

export const beefRouter = router({
  create: publicProcedure
    .input(
      z.object({
        myFloat: z.number(),
        myInt: z.number().int(),
        myString: z.string(),
        myOptionalString: z.string().nullish(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.beef.create({
        data: input,
      });
    }),
  read: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.beef.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        myFloat: z.number().nullish(),
        myInt: z.number().int().nullish(),
        myString: z.string().nullish(),
        myOptionalString: z.string().nullish(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.beef.updateMany({
        where: { id: input.id },
        data: {
          myFloat: input.myFloat != null ? input.myFloat : undefined,
          myInt: input.myInt != null ? input.myInt : undefined,
          myString: input.myString != null ? input.myString : undefined,
          myOptionalString: input.myOptionalString,
        },
      });
    }),
  updateMultiple: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          myFloat: z.number(),
          myInt: z.number().int(),
          myString: z.string(),
          myOptionalString: z.string().nullish(),
        }),
      ),
    )
    .mutation(({ ctx, input }) => {
      return Promise.all(input.map((inp) => ctx.prisma.beef.update({ where: { id: inp.id }, data: inp })));
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.beef.delete({
        where: { id: input.id },
      });
    }),
  readAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.beef.findMany({ orderBy: { createdAt: "desc" } });
  }),
  infiniteBeefs: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).optional(),
        orderBy: z.string().optional(),
        order: z.union([z.literal("desc"), z.literal("asc")]).optional(),
        where: z.any(), //is there a way to do z.inferSchemaFrom(MyCustomType) ?
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const orderBy = input.orderBy && input.order ? { [input.orderBy]: input.order } : undefined;
      const where = input?.where || undefined;

      const items = await ctx.prisma.beef.findMany({
        cursor: cursor,
        take: limit + 1, //get an extra item at the end which we'll use as next cursor
        where: where,
        orderBy: orderBy,
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
