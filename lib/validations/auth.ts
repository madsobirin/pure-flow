import { z } from "zod";

export const registerSchema = z.object({
  namaLengkap: z
    .string()
    .min(1, { message: "Nama lengkap wajib diisi" })
    .min(3, { message: "Nama minimal 3 karakter" }),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});
