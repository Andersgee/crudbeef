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
});
