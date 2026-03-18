import { prisma } from "@/lib/prisma";
import { SubmittedWork } from "@/utils/types";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const tasks = await prisma.submittedWork.findMany({ orderBy: { createdAt: "desc" }, include: { toEmployee: true, task: true } });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(request);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بإضافة مهام جديدة " }, { status: 403 });
    if (user.role === "EMPLOYEE") return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بإضافة مهام جديدة " }, { status: 403 });
    const body = (await request.json()) as SubmittedWork;
    const newSubmittedWork = await prisma.submittedWork.create({
      data: {
        title: body.title,
        currency: body.currency,
        description: body.description,
        endDate: body.endDate,
        fromEmployee: body.fromEmployee,
        userId: body.userId,
        price: body.price,
        priority: body.priority,
        startDate: body.startDate,
        status: "PENDING",
        archived: false,
        comment: body.comment,
        attachments: body.attachments as Prisma.InputJsonValue[],
        reassignReason: body.reassignReason,
        progress: body.progress,
        taskId: body.id,
        assignedBy: body.assignedBy,
      },
      include: { toEmployee: true, task: true },
    });
    return NextResponse.json(newSubmittedWork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}