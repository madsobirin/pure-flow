import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Delete the auth_token cookie by setting its maxAge to 0 and path to '/'
    cookieStore.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Logout berhasil.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
