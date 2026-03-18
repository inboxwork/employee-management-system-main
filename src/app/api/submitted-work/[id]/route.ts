import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بحذف المهام " }, { status: 403 });
    if (user.role === "EMPLOYEE") return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بحذف المهام " }, { status: 403 });
    const id = (await params).id;
    const task = await prisma.submittedWork.findUnique({ where: { id }, include: { task: true, toEmployee: true } });
    if (!task) return NextResponse.json({ message: "الهمة التي تحاول حذف بياناتها غير موجودة" }, { status: 404 });
    await prisma.submittedWork.delete({ where: { id } });
    const attachments = task.attachments as { url: string; publicId: string }[];
    for (const attachment of attachments) {
      await cloudinary.uploader.destroy(attachment.publicId);
    }
    return NextResponse.json({ message: "تم حذف الهمة بنجاح" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}