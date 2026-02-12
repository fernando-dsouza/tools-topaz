import { Indicador } from "@/domain/indicador/indicador.types";

function converterHexParaBinario(textoHex: string) {
    const texto = textoHex.toLowerCase();
    const resultado: Indicador[] = [];

    for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        const binario = parseInt(char, 16).toString(2).padStart(4, '0');

        if (binario.includes("NaN")) {
            resultado.push({ valor: "ERR" });
        } else {
            const objetosBits = binario.split('').map(b => ({
                valor: b
            }));

            resultado.push(...objetosBits);
        }
    }

    return resultado;
}

function agruparParaTabela(bits: Indicador[], colunas: number = 10): Indicador[][] {
    const linhas: Indicador[][] = [];
    for (let i = 0; i < bits.length; i += colunas) {
        linhas.push(bits.slice(i, i + colunas));
    }
    return linhas;
}

export function analisarIndicador(indicador: string, colunas: number) {
    const bits = converterHexParaBinario(indicador)
    return agruparParaTabela(bits, colunas)
}