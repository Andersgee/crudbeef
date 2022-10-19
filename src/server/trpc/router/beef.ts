import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

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
  paginatedFindMany: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(), //the last id of previous result
        take: z.number().default(10),
        myStringContains: z.string().optional(),
        myOptionalStringContains: z.string().nullish(),
        createdAtOrderBy: z.union([z.literal("desc"), z.literal("asc")]).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.beef.findMany({
        take: input.take,
        skip: input.cursor ? 1 : undefined,
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        where: {
          myString: input.myStringContains ? { contains: input.myStringContains } : undefined,
          myOptionalString: input.myOptionalStringContains ? { contains: input.myOptionalStringContains } : undefined,
        },
        orderBy: input.createdAtOrderBy ? { createdAt: input.createdAtOrderBy } : undefined,
      });
    }),
});
