import { prisma } from "@/lib/prisma";
import { ReassignReason } from "@/utils/types";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
// import { Prisma } from "../../../../../../generated/prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بإضافة مهام جديدة " }, { status: 403 });
    if (user.role === "EMPLOYEE") return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بإضافة مهام جديدة " }, { status: 403 });
    const id = (await params).id;
    const body = (await request.json()) as ReassignReason;
    const updatedTask = await prisma.task.update({
      where: {id},
      data: {
        assignedBy: user.role,
        startDate: body.startDate.trim(),
        endDate: body.endDate.trim(),
        status: "PENDING",
        progress: 0,
        archived: false,
        userId: body.toEmployee,
        reassignReason: body.reassignReason,
      },
        include: {assignedTo: true},
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
