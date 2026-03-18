import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await cookies().then((data) => data.delete("jwtToken"));
    return NextResponse.json({ message: "تم تسجيل الخروج" }, { status: 200 });
  } catch (error) {
    console.log(request.body);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
