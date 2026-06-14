import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const headersList = await headers();
  const userIdStr = headersList.get("x-user-id");

  if (!userIdStr) {
    return <ProfileClient isLoggedIn={false} />;
  }

  const userId = parseInt(userIdStr, 10);

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
