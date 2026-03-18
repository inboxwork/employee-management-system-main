import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import streamifier from "streamifier";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { validateAddTask } from "@/utils/validation";
import { Currency, TaskPriority } from "@/utils/types";

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    let tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" }, include: { assignedTo: true } });
    if (user?.role === "EMPLOYEE") {
      tasks = await prisma.task.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { assignedTo: true, submittedWorks: true } });
    }
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بإضافة مهام جديدة " }, { status: 403 });
    if (user.role === "EMPLOYEE") return NextResponse.json({ message: "لا يُسمح إلا لمدير الموقع بإضافة مهام جديدة " }, { status: 403 });
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const priority = formData.get("priority") as TaskPriority;
    const currency = formData.get("currency") as Currency;
    const userId = formData.get("userId") as string;
    const price = Number(formData.get("price"));
    const attachmentsData = formData.getAll("attachments");
    const { error } = validateAddTask({title, description, startDate, endDate, priority, price, currency});
    if (error) return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    // Upload images to cloudinary and get the urls
    const attachmentsUrls: { url: string; publicId: string }[] = [];

    for (const attachment of attachmentsData) {
      if (!(attachment instanceof File)) {
        return NextResponse.json({ message: "Invalid attachment type" }, { status: 400 });
      }

      const buffer = Buffer.from(await attachment.arrayBuffer());
      const originalName = attachment.name; 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "employee-managemenet-system", resource_type: "auto",
            use_filename: true,
            unique_filename: false,
            public_id: `${Date.now()}-${originalName}`,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });

      attachmentsUrls.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }
    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        assignedBy: user.role,
        currency: currency,
        description: description.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        price: price,
        priority: priority,
        status: "PENDING",
        archived: false,
        userId: userId,
        attachments: attachmentsUrls,
        progress: 0,
      },
      include: {assignedTo: true, submittedWorks: true}
    });
      return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
}