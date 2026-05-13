import { NextResponse } from "next/server";
import { listPlaygrounds, savePlayground } from "@/services/playgrounds/playground-repository";

export async function GET() {
  const playgrounds = await listPlaygrounds("local-development-user");
  return NextResponse.json({ playgrounds });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const playground = await savePlayground("local-development-user", payload);
  return NextResponse.json({ playground }, { status: 201 });
}
