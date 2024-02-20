import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import util from "util";
const execAsync = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { stdout } = await execAsync(`npx ts-node /home/verdant/Desktop/fiis/fiis-script/src/index.ts`);
    return NextResponse.json({ message: "Script executed", status: 200, stdout });
  } catch (err) {
    return NextResponse.json({ message: (err as Error)?.message, status: 500 });
  }
}
