export function formatarTamanhoArquivo(bytes: number): { valor: string; unidade: string } {
    if (bytes === 0) return { valor: "0", unidade: "Bytes" };

    const k = 1024;
    const tamanhos = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
        valor: parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString(),
        unidade: tamanhos[i]
    };
}
