import {Indicador} from "@/types/indicador";

function converterHexParaBinario(hexString: string) {
    const str = hexString.toLowerCase();
    const resultado: Indicador[] = [];

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const bin = parseInt(char, 16).toString(2).padStart(4, '0');

        if (bin.includes("NaN")) {
            // Se der erro, precisamos seguir a estrutura do objeto
            resultado.push({valor: "ERR"});
        } else {
            // Transformamos cada bit em um objeto { bit: "0" } ou { bit: "1" }
            const objetosBits = bin.split('').map(b => ({
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