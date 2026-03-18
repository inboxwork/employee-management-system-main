import { prisma } from "@/lib/prisma";
import { LoginUser } from "@/utils/types";
import { validateLogin } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/utils/generateToken";
import { cookies } from "next/headers";


export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUser;
    const { error } = validateLogin(body);
    if (error) return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return NextResponse.json({ message: " البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 400 });
    const isPasswordMatch = user.password === body.password;
    if (!isPasswordMatch) return NextResponse.json({ message: " البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 400 });
    const data = { id: user.id, name: user.name, email: user.email, role: user.role, password: user.password };
    const cookie = setCookie(data);
    (await cookies()).set("jwtToken", JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
    return NextResponse.json({ ...data, message: "Logged in successfully" }, { status: 200, headers: {"Set-Cookie": cookie} });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}