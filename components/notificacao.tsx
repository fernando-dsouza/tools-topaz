import {toast} from "sonner";

export default function notificacao(tipo: string, mensagem: string) {
    if (tipo === 'erro') return toast.error(mensagem, {
        position: "top-center",
        style: {
            background: 'red',
            color: 'white'
        }
    })
    if (tipo === 'sucesso') return toast.success(mensagem, {
        position: "top-center",
        style: {
            background: 'green',
            color: 'white',
        }
    })
}