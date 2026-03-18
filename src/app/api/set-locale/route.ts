import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const {locale} = await request.json();

  const response = NextResponse.json({success: true});
  response.cookies.set('locale', locale, {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365 
  });

  return response;
}
