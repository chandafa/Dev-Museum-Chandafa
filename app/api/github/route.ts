import { NextResponse } from "next/server";
import { getGithubArchive } from "@/lib/github";

export const revalidate = 300;

export async function GET() {
  const archive = await getGithubArchive();

  return NextResponse.json(archive, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=3600"
    }
  });
}
