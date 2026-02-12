'use client';

import { useState, useEffect } from 'react';

export function useArmazenamentoLocal<T>(chave: string, valorPadrao: T): [T, (valor: T | ((anterior: T) => T)) => void] {
    const [valor, definirValor] = useState<T>(() => {
        if (typeof window === 'undefined') return valorPadrao;

        const armazenado = localStorage.getItem(chave);
        if (!armazenado) return valorPadrao;

        try {
            return JSON.parse(armazenado) as T;
        } catch {
            return valorPadrao;
        }
    });

    useEffect(() => {
        if (valor !== undefined) {
            localStorage.setItem(chave, JSON.stringify(valor));
        }
    }, [chave, valor]);

    return [valor, definirValor];
}
