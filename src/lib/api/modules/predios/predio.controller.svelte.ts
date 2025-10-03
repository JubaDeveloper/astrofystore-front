import api from "$lib/api/api";
import query from "$lib/api/query";
import type { AxiosError } from "axios";
import type { EnderecoPredioForm, FiltrosPrediosListagem, PredioCadForm, PredioListType } from "./predio.dto.svelte";


export class PredioController{

    async cadastrar(form:PredioCadForm){
        const [r,e] = await api.post(`/admin/predio`,form)
        return [r ? r.data : null,e]
    }

    async editar(form:PredioCadForm,idPredio:number){
        const [r,e] = await api.post(`/admin/predio/${idPredio}`,form)
        return [r,e]
    }

    async pegarPorId(id:number){
        const [r,e] = await api.get(`/admin/predio/${id}`)
        return [r ? r.data : null,e]

    }

    async salvarEndereco(form:EnderecoPredioForm,idPredio:number){
        const [r,e] = await api.post(`/admin/predio/${idPredio}/endereco`,form)
        return [r ? r.data : null,e]
    }

    async listar(filtros:FiltrosPrediosListagem):Promise<[PredioListType,AxiosError]>{
        const [r,e] = await api.get(`/predio${query.searchInMemoryQuerys(filtros)}`)
        return [r ? r.data : null,e]
    }

}