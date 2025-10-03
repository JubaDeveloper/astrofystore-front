import api from "$lib/api/api";
import query from "$lib/api/query";
import toast from "$lib/utils/toast.svelte";
import type { FiltrosListarUsuarios } from "./usuarios.dto.svelte";

export class ListarUsuarios {
    async usuariosTabela(filtros:FiltrosListarUsuarios){
        const [res, err] = await api.get(`/admin/usuario/listar${query.searchInMemoryQuerys(filtros)}`)
        return [res, err]
    }

    async buscarUsuarioId(idUsuario:number){
        const [res, err] = await api.get(`admin/usuario/${idUsuario}`)
        return [res, err]
    }

    async banirUsuario(idUsuario:number, status: string){
        const body = {
            status: status
        }
        const [res, err] = await api.put(`admin/usuario/${idUsuario}`, body)
        return [res, err]
    }
}