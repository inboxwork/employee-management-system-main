import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { Currency, TaskPriority } from "@/utils/types";
// import { validateEditTask } from "@/utils/validation";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import streamifier from "streamifier";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = (await params).id;
    const task = await prisma.task.findUnique({ where: { id }, include: { assignedTo: true, submittedWorks: {orderBy: {createdAt: "asc"}} } });
    if (!task) return NextResponse.json({ message: "المهمة الذي تحاول عرض بياناتها غير موجودة" }, { status: 404 });
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "يجب تسجيل الدخول لتعديل بيانات المهمة" }, { status: 403 });
    const id = (await params).id;
    const product = await prisma.task.findUnique({ where: { id }, include: { assignedTo: true } });
    if (!product) return NextResponse.json({ message: "المهمة الذي تحاول تعديل بياناتها غير موجودة" }, { status: 404 });
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const priority = formData.get("priority") as TaskPriority;
    const currency = formData.get("currency") as Currency;
    const userId = formData.get("userId") as string;
    const reassignReason = formData.get("reassignReason") as string;
    const comment = formData.get("comment") as string;
    const price = Number(formData.get("price"));
    // const attachmentsData = formData.getAll("attachments");
    // const { error } = validateEditTask({title, description, startDate, endDate, priority, price, currency});
    // if (error) return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    const existingAttachments = JSON.parse(
      (formData.get("existingAttachments") as string) || "[]"
    ) as { url: string; publicId: string }[];

    const deletedAttachments = JSON.parse(
      (formData.get("deletedAttachments") as string) || "[]"
    ) as string[];

    const newAttachments = formData.getAll("attachments") as File[];
    for (const publicId of deletedAttachments) {
      await cloudinary.uploader.destroy(publicId);
    }
    const uploadedAttachments: { url: string; publicId: string }[] = [];

    for (const file of newAttachments) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name; 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "employee-managemenet-system", resource_type: "auto",
            use_filename: true,
            unique_filename: false,
            public_id: `${Date.now()}-${originalName}`,},
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });

      uploadedAttachments.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
    const filteredExistingAttachments = existingAttachments.filter(
      (attachment) => !deletedAttachments.includes(attachment.publicId)
    );
    const finalAttachments = [...filteredExistingAttachments, ...uploadedAttachments];
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        assignedBy: user.id,
        currency: currency,
        description: description.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        price: price,
        priority: priority,
        archived: false,
        userId: userId,
        attachments: finalAttachments,
        reassignReason: reassignReason,
        comment: comment,
      },
      include: { assignedTo: true, submittedWorks: true },
    });
    const submittedWork = await prisma.submittedWork.findFirst({ where: { taskId: id }, orderBy: {createdAt: "desc"} });
    await prisma.submittedWork.update({
      where: { id: submittedWork?.id },
      data: {comment: comment}
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بحذف المهام " }, { status: 403 });
    if (user.role === "EMPLOYEE") return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بحذف المهام " }, { status: 403 });
    const id = (await params).id;
    const product = await prisma.task.findUnique({ where: { id }, include: { assignedTo: true } });
    if (!product) return NextResponse.json({ message: "الهمة التي تحاول حذف بياناتها غير موجودة" }, { status: 404 });
    await prisma.task.delete({ where: { id } });
    const attachments = product.attachments as { url: string; publicId: string }[];
    for (const attachment of attachments) {
      await cloudinary.uploader.destroy(attachment.publicId);
    }
    return NextResponse.json({ message: "تم حذف الهمة بنجاح" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}