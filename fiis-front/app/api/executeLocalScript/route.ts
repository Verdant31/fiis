import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import util from "util";
const execAsync = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path: string = body.path;
    const userName: string = body.userName;
    const { stdout } = await execAsync(`ts-node ${path} ${userName}`);
    return NextResponse.json({ message: "Script executed", status: 200, stdout });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
