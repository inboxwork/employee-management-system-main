import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRegister } from "@/utils/validation";
import { RegisterUser } from "@/utils/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUser;
    const { error } = validateRegister(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: body.email.trim() } });
    if (user) return NextResponse.json({ message: "تم إستخدام هذا البريد الإلكتروني في حساب آخر" }, { status: 400 });
    const newUser = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        role: body.role,
        password: body.password.trim()
      }});
    return NextResponse.json({ ...newUser, message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" + error }, { status: 500 });
  }
}
