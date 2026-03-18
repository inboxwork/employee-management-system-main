import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) NextResponse.json({ message: "يجل تسجيل الدخول لعرض جميع بيانات المهام" }, { status: 403 });
    let count = await prisma.task.count();
    if (user?.role === "EMPLOYEE") {
      count = await prisma.task.count({ where: { userId: user.id } });
    }
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.log(request.body);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
