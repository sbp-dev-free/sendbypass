import { NextRequest, NextResponse } from 'next/server';

let loginStatus: string = '';

export async function POST(req: NextRequest) {
  const { status } = await req.json();
  loginStatus = status;

  return NextResponse.json({
    message: 'Status updated successfully',
    status,
  });
}

export async function GET() {
  return NextResponse.json({ status: loginStatus });
}
