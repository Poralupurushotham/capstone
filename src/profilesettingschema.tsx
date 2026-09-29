import { z } from "zod";

export const profileSettingsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  notificationFrequency: z.enum(["instant", "daily", "never"], {
    message: "Please select a notification frequency.",
  }),

  bio: z
    .string()
    .trim()
    .max(160, "Bio must be 160 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

export type ProfileSettingsFormValues = z.infer<
  typeof profileSettingsSchema
>;
