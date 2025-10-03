import api from "$lib/api/api";
import type { Axios, AxiosError } from "axios";
import type { PoliticaDto, PoliticaFormDto, PoliticaListagemDto } from "./politicas.dto";

export class PoliticasController{

    async listar(lojaId:number):Promise<[PoliticaListagemDto,AxiosError]>{
        const [r,e] = await api.get(`/restrito/loja/${lojaId}/politica`)
        return [r ? r.data : null,e]
    }

    async pegar(lojaId:number,politicaId:number):Promise<[PoliticaDto,AxiosError]>{
        const [r,e] = await api.get(`/restrito/loja/${lojaId}/politica/${politicaId}`)
        return [r ? r.data : null,e]
    }


    async criar(lojaId:number,form:PoliticaFormDto):Promise<[PoliticaDto,AxiosError]>{
        const [r,e] = await api.post(`/restrito/loja/${lojaId}/politica`,form)
        return [r ? r.data : null,e]
    }

    async editar(lojaId:number,politicaId:number,form:PoliticaFormDto):Promise<[PoliticaDto,AxiosError]>{
        const [r,e] = await api.put(`/restrito/loja/${lojaId}/politica/${politicaId}`,form)
        return [r ? r.data : null,e]
    }


    async deletar(lojaId:number,politicaId:number):Promise<[any,AxiosError]>{
        const [r,e] = await api.delete(`/restrito/loja/${lojaId}/politica/${politicaId}`)
        return [r ? r.data : null,e]
    }

    async toggleStatus(lojaId:number,politicaId:number):Promise<[PoliticaDto,AxiosError]>{
        const [r,e] = await api.put(`/restrito/loja/${lojaId}/politica/${politicaId}/status`)
        return [r ? r.data : null,e]
    }

}