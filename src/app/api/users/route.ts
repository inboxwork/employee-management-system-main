import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/verifyToken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) NextResponse.json({message: "لا يُسمح إلا لمدير الموقع بعرض بيانات جميع المستخدمين"}, {status: 403});
    if (user?.role !== "MANAGER") NextResponse.json({message: "لا يُسمح إلا لمدير الموقع بعرض بيانات جميع المستخدمين"}, {status: 403});
    let users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { tasks: true },
    });
    if (user?.role === "ADMIN") {
      users = await prisma.user.findMany({
      where: {role: {not: "MANAGER"}},
      orderBy: { createdAt: "desc" },
      include: { tasks: true },
    });
    }
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}