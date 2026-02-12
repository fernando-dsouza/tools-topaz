export type LogProcessado = {
    idArquivo: number
    deslocamento: number;
    comprimento: number;
    data: string;
    hora: string;
    nivel: string;
    contexto: string;
    mensagem: string;
    indice: number;
    linha: number; // Supondo que 'linha' exista e tenha sido esquecido na interface anterior, mas estava no parser
};