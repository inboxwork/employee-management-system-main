import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/utils/types";
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
    const body = (await request.json()) as { status: TaskStatus };
    const taskProgress = body.status === "COMPLETED" ? 100 : body.status === "UNDER_REVIEW" ? 90 : body.status === "IN_PROGRESS" ? 50 : 0;
    const updatedTask = await prisma.task.update({
      where: { id }, data: {
        status: body.status,
        progress: taskProgress,
      }, include: { assignedTo: true }
    });
    const submittedWork = await prisma.submittedWork.findFirst({ where: { taskId: id }, orderBy: {createdAt: "desc"} });
    const updatedSubmission =  await prisma.submittedWork.update({
      where: { id: submittedWork?.id },
      data: {
        status: body.status,
        progress: taskProgress,
      },
      include: {task: true, toEmployee: true},
    });
    return NextResponse.json({updatedTask: updatedTask, updatedSubmission: updatedSubmission}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
