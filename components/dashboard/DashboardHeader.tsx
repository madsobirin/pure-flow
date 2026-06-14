import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Buttonn from "../ui/Button";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function DashboardHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  if (token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { name: true },
        });
      }
    } catch {
      // ignore
    }
  }

  // Get initials & first name if user is logged in
  let initials = "";
  let firstName = "";
  if (user && user.name) {
    const parts = user.name.trim().split(/\s+/);
    firstName = parts[0]; // First name only

    // Get up to 2 initials (e.g. "Ahmad Sobirin" -> "AS")
    if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0].length > 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else {
      initials = parts[0][0].toUpperCase();
    }
  }

  return (
    <div className="flex items-center justify-between py-6">
      <Link
        href="/profile"
        className="flex items-center gap-3 group focus:outline-none"
      >
        {user ? (
          // Logged in: Circular avatar with initials (e.g. "AS" or "SA")
          <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform duration-200 select-none">
            {initials}
          </div>
        ) : (
          // Not logged in: Empty/Guest avatar (grey circle with initials placeholder "??")
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform duration-200 select-none">
            ??
          </div>
        )}

        {user ? (
          <span className="font-bold text-brand-teal text-lg group-hover:text-brand-teal-dark transition-colors">
            {firstName}
          </span>
        ) : (
          <span className="font-bold text-gray-400 text-sm group-hover:text-gray-600 transition-colors">
            Login
          </span>
        )}
      </Link>

      <Buttonn />
    </div>
  );
}
