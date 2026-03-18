import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const admin = verifyToken(request);
    if (!admin) NextResponse.json({message: "لا يُسمح إلا لمدير الموقع بعرض بيانات جميع المستخدمين"}, {status: 403});
    if (admin?.role !== "MANAGER") NextResponse.json({message: "لا يُسمح إلا لمدير الموقع بعرض بيانات جميع المستخدمين"}, {status: 403});
    const count = await prisma.user.count({ where: { role: { not: "MANAGER" } } });
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.log(request.body);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
