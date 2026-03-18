import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "يجب تسجيل الدخول لتعديل بيانات المهمة" }, { status: 403 });
    const id = (await params).id;
    const body = (await request.json()) as { archived: boolean };
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        archived: body.archived,
        archivedDate: new Date(),
        archivedBy: user.role
      },
      include: { assignedTo: true },
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
