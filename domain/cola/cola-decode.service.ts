import { LinhaCola } from "@/domain/cola/cola.types";

export function ordenarPorCampo(linhas: LinhaCola[]): LinhaCola[] {
    return [...linhas].sort((a, b) => {
        const aVazia = eLinhaVazia(a)
        const bVazia = eLinhaVazia(b)

        if (aVazia && !bVazia) return 1
        if (!aVazia && bVazia) return -1
        if (aVazia && bVazia) return 0

        return a.campo.localeCompare(b.campo, undefined, {
            numeric: true,
            sensitivity: 'base',
        })
    })
}

export function eLinhaVazia(linha: LinhaCola): boolean {
    return (
        !linha.tipo &&
        !linha.campo &&
        linha.tamanho === 0 &&
        !linha.valorAtual &&
        !linha.valorAnterior
    )
}

export function eLinhaVisivel(linha: LinhaCola): boolean {
    return !eLinhaVazia(linha);
}

export function analisarCola(
    cola: string,
    tamanhoCola: number
): LinhaCola[] {
    let indice = 1
    let tamanho5 = false
    const linhas: LinhaCola[] = []

    if (!cola) return [];

    while (indice < tamanhoCola && cola !== '') {
        // Previne loop infinito se indice não avançar ou exceder tamanho de forma insegura
        if (indice > cola.length) break;

        let parte = cola.substring(indice - 1, indice)

        if (!['1', '2', '3'].includes(parte)) {
            tamanho5 = true
            indice++
            parte = cola.substring(indice - 1, indice)
        }

        const tipo = parte
        indice++

        const campo = tamanho5
            ? cola.substring(indice - 1, indice + 4)
            : cola.substring(indice - 1, indice + 3)

        indice += tamanho5 ? 5 : 4

        const tamanhoStr = cola.substring(indice - 1, indice + 2)
        const tamanho = parseInt(tamanhoStr.trim()) || 0
        indice += 3

        let valorAtual = ''
        let valorAnterior = ''

        if (tamanho > 0) {
            const valor = cola.substring(indice - 1, indice - 1 + tamanho)

            if (tipo === '1') valorAtual = valor
            if (tipo === '2') valorAnterior = valor

            if (tipo === '3') {
                valorAtual = valor
                indice += tamanho
                valorAnterior = cola.substring(indice - 1, indice - 1 + tamanho)
            }

            indice += tamanho
        }

        linhas.push({ tipo, campo, tamanho, valorAtual, valorAnterior })
    }

    return linhas
}

export function processarCola(cola: string, tamanhoCola: number): LinhaCola[] {
    if (!cola || tamanhoCola <= 0) return [];

    const analisado = analisarCola(cola, tamanhoCola);
    const ordenado = ordenarPorCampo(analisado);
    return ordenado.filter(eLinhaVisivel);
}
