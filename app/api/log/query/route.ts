import { NextResponse } from "next/server";
import {queryLog} from "@/domain/log/log-query.service";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const file = searchParams.get("file");
        if (!file) {
            return NextResponse.json(
                { error: "file é obrigatório" },
                { status: 400 }
            );
        }

        const niveisRaw = searchParams.getAll("nivel");
        const niveis = niveisRaw.length > 0 ? niveisRaw : undefined;

        const contexto = searchParams.get("contexto") ?? undefined;
        const mensagem = searchParams.get("mensagem") ?? undefined;

        const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
        const limit = Math.max(1, Number(searchParams.get("limit")) || 100);

        const result = await queryLog({
            file,
            nivel: niveis,
            contexto,
            mensagem,
            offset,
            limit,
        });

        return NextResponse.json(result);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message ?? "Erro interno" },
            { status: 500 }
        );
    }
}

