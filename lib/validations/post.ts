import * as z from "zod";

export const postValidation = z.object({
  post: z
    .string()
    .min(3, { message: "Minimum 3 characters." }),
  accountId: z
    .string(),
});

export const commentValidation = z.object({
  post: z
    .string()
    .min(3, { message: "Minimum 3 characters." }),
});