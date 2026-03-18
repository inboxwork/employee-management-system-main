import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import streamifier from "streamifier";

interface Props {
  params: Promise<{ id: string }>;
}


export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "يجب تسجيل الدخول لتعديل بيانات المهمة" }, { status: 403 });
    const id = (await params).id;
    const product = await prisma.task.findUnique({ where: { id }, include: { assignedTo: true } });
    if (!product) return NextResponse.json({ message: "المهمة الذي تحاول تعديل بياناتها غير موجودة" }, { status: 404 });
    const formData = await request.formData();
    const comment = formData.get("comment") as string;

    const existingAttachments = JSON.parse(
      (formData.get("existingAttachmentss") as string) || "[]"
    ) as { url: string; publicId: string }[];

    const deletedAttachments = JSON.parse(
      (formData.get("existingAttachments") as string) || "[]"
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
        attachments: finalAttachments,
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