import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return <ProfileClient isLoggedIn={false} />;
  }

  let userId: number;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    console.error("JWT verification failed in profile page:", error);
    return <ProfileClient isLoggedIn={false} />;
  }

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
  });

  if (!user) {
    return <ProfileClient isLoggedIn={false} />;
  }

  // Get statistics for the user
  const totalAlat = await prisma.alat.count({
    where: { user_id: userId },
  });

  const totalLogs = await prisma.logLatihan.count({
    where: { user_id: userId },
  });

  // Format created_at to user-friendly string (e.g., "Juni 2026")
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  const memberSince = new Intl.DateTimeFormat("id-ID", dateOptions).format(
    new Date(user.created_at),
  );

  return (
    <ProfileClient
      isLoggedIn={true}
      user={{
        name: user.name,
        email: user.email,
        memberSince,
      }}
      stats={{
        totalAlat,
        totalLogs,
      }}
    />
  );
}
