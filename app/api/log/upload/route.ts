import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Busboy from "busboy";
import { Readable } from "stream";
import { createLogIndex } from "@/domain/log/log-index.service";
import { createLogStreamParser } from "@/domain/log/log-stream-parser.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const uploadDir = path.join(process.cwd(), "logs");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (!req.body) {
        return NextResponse.json(
            { success: false, error: "Request body vazio" },
            { status: 400 }
        );
    }

    return await new Promise<Response>((resolve, reject) => {
        let preview = "";
        const PREVIEW_LIMIT = 1000;

        const busboy = Busboy({
            headers: Object.fromEntries(req.headers),
            limits: {
                fileSize: 1024 * 1024 * 1024, // 1GB
            },
        });

        let savedFileName = "";
        let totalBytes = 0; // ✅ CONTADOR DE TAMANHO

        busboy.on("file", (fieldname, file, info) => {
            const { filename } = info;
            const logId = `${Date.now()}-${filename}`;
            savedFileName = logId;

            const savePath = path.join(uploadDir, logId);
            const writeStream = fs.createWriteStream(savePath);

            const parser = createLogStreamParser();
            const index = createLogIndex(logId);

            let currentOffset = 0;

            file.on("data", (chunk: Buffer) => {
                totalBytes += chunk.length;

                writeStream.write(chunk);

                if (preview.length < PREVIEW_LIMIT) {
                    const remaining = PREVIEW_LIMIT - preview.length;
                    preview += chunk.toString("utf8", 0, remaining);
                }

                parser.push(chunk, currentOffset, (logEntry) => {
                    index.add({
                        offset: logEntry.offset,
                        length: logEntry.length,
                        data: logEntry.data,
                        hora: logEntry.hora,
                        nivel: logEntry.nivel,
                        contexto: logEntry.contexto,
                    });
                });

                currentOffset += chunk.length;
            });

            file.on("end", async () => {
                writeStream.end();
                await index.save();
            });

            file.on("error", (err) => {
                reject(
                    NextResponse.json(
                        { success: false, error: err.message },
                        { status: 500 }
                    )
                );
            });
        });

        busboy.on("error", (err) => {
            reject(
                NextResponse.json(
                    { success: false, error: err.message },
                    { status: 500 }
                )
            );
        });

        busboy.on("finish", () => {
            resolve(
                NextResponse.json({
                    success: true,
                    file: savedFileName,
                    size: totalBytes,
                    preview
                })
            );
        });

        Readable.fromWeb(req.body as any).pipe(busboy);
    });
}
