import {createServerSupabase} from "@/lib/supabase/server";
import {ParsedLog} from "@/domain/log/log.types";

export async function insertIndex(logs: ParsedLog[]) {
    const supabase = await createServerSupabase();

    const {error} = await supabase
        .schema('topaz_tools')
        .from("log_index")
        .insert(logs);

    if (error) throw error;
}

export async function consultaLogsPaginado(
    offset: number, limit: number, idArquivo: number, nivel?: string[], contexto?: string, mensagem?: string
) {
    const supabase = await createServerSupabase();

    console.log(offset, limit, idArquivo, nivel, contexto, mensagem)

    let query = supabase
        .schema('topaz_tools')
        .from("log_index")
        .select('*')
        .eq('id_arquivo', idArquivo)

    if (nivel && nivel.length > 0) {
        const filtros = nivel
            .map(n => `nivel.ilike.${n}`)
            .join(',');

        query = query.or(filtros);
    }

    if (contexto) query = query.ilike('contexto', `%${contexto}%`);
    if (mensagem) query = query.ilike('mensagem', `%${mensagem}%`);


    const {data, error} = await query
        .range(offset, offset + limit - 1)
        .order('index', {ascending: true})

    if (error) throw error;

    return data as ParsedLog[];
}

export async function deletarLogs(idArquivo: number) {
    const supabase = await createServerSupabase();

    const {error} = await supabase
        .schema('topaz_tools')
        .from("log_index")
        .delete()
        .eq('id_arquivo', idArquivo);

    if (error) throw error;
}
