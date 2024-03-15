import * as z from "zod";

export const userValidation = z.object({
  id: z.string(),
  profile_photo: z.string().url().optional(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string(),
});