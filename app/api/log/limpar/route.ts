import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get("file");

    if (!file) {
        return NextResponse.json(
            { success: false, error: "Arquivo não informado" },
            { status: 400 }
        );
    }

    try {
        // 🔥 ajuste para onde seu índice está salvo
        const indexPath = path.join(process.cwd(), "logs", file);

        if (fs.existsSync(indexPath)) {
            fs.rmSync(indexPath, { recursive: true, force: true });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
