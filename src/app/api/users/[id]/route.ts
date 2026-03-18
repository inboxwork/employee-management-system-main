import { prisma } from "@/lib/prisma";
import { EditUserData } from "@/utils/types";
import { validateEditUserData } from "@/utils/validation";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = (await params).id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json( { message: "المُستخدم الذي تحاول عرض بياناته غير موجود" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const userLogged = verifyToken(request);
    if (!userLogged) return NextResponse.json({ message: "غير مصرح بتعديل بيانات المستخدمين" }, { status: 403 },);
    const id = (await params).id;
    if (userLogged.role !== "MANAGER" && userLogged.id !== id) {
      return NextResponse.json({ message: "غير مصرح بتعديل بيانات المستخدمين" }, { status: 403 });
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ message: "المُستخدم الذي تحاول تعديل بياناته غير موجود" }, { status: 404 });
    const body = (await request.json()) as EditUserData;
    const { error } = validateEditUserData(body);
    if (error) return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        role: body.role,
        password: body.password?.trim() || user.password,
      },
      include: { tasks: true },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const admin = verifyToken(request);
    if (!admin) return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بحذف المستخدمين " }, { status: 403 });
    if (admin.role !== "MANAGER") return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بحذف المستخدمين " }, { status: 403 });
    const id = (await params).id;
    const user = await prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    if (!user) return NextResponse.json({ message: "المُستخدم الذي تحاول حذف بياناته غير موجود" }, { status: 404 });
    const useTasksId = user.tasks.map((order) => order.id);
    if (useTasksId.length > 0) {
      await prisma.task.deleteMany({ where: { id: { in: useTasksId } } });
    }
    await prisma.user.delete({ where: { id }, include: { tasks: true } });
    return NextResponse.json(
      { message: "تم حذف بيانات المستخدم بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
