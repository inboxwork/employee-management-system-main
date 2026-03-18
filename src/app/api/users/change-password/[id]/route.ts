import { prisma } from "@/lib/prisma";
import { ChangePasswordTypes } from "@/utils/types";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const userLogged = verifyToken(request);
    if (!userLogged) return NextResponse.json({ message: "يجب تسجيل الدخول لتغيير كلمة المرور" }, { status: 403 },);
    const id = (await params).id;
    if (userLogged.role === "MANAGER" && userLogged.id !== id) {
      return NextResponse.json({ message: "غير مصرح بتعديل بيانات المستخدمين" }, { status: 403 });
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ message: "المُستخدم الذي تحاول تعديل بياناته غير موجود" }, { status: 404 });
    const body = (await request.json()) as ChangePasswordTypes;
    const isPasswordMatch = body.oldPassword === user.password;
    if (!isPasswordMatch) return NextResponse.json({ message: "كلمة المرور السابقة غير صحيحة" }, { status: 400 });
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: body.newPassword },
      include: { tasks: true },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
