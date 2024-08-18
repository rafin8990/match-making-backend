import { z } from 'zod';
const createMessageZodSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        isRead: z.boolean(),
        files: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email("Invalid email address"),
    }),
});
export const MessageValidation = {
    createMessageZodSchema
}