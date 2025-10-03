import api from "$lib/api/api";
import type { Axios, AxiosError } from "axios";
import type { LojaCadForm, LojaDto, LojaListagemDto } from "./lojas.dto";
import query from "$lib/api/query";

export class LojaController{


    async pegar(idLoja:number):Promise<[LojaDto,AxiosError]>{
        const [r,e] = await api.get(`/restrito/loja/${idLoja}`)
        return [r ? r.data : null,e]
    }

    async atualizar(form:LojaCadForm,lojaId:number):Promise<[LojaDto,AxiosError]>{
        const [r,e] = await api.put(`/restrito/loja/${lojaId}`,form)
        return [r ? r.data : null,e]
    }

    async cadastrar(form:LojaCadForm):Promise<[LojaDto,AxiosError]>{
        const [r,e] = await api.post(`/restrito/loja`,form)
        return [r ? r.data : null,e]
    }

    async listar(filtros:Record<string,any>):Promise<[LojaListagemDto,AxiosError]>{
        const [r,e] = await api.get(`/restrito/loja${query.searchInMemoryQuerys(filtros)}`)
        return [r ? r.data : null,e]
    }

    async validarDominio(subdominio:string):Promise<boolean>{
        const [r,e] = await api.get(`/subdominio/${subdominio}/verificar`)
        return r.data.disponivel
    }

    async salvarSubDominio(dominio:string,lojaId:number):Promise<[any,AxiosError]>{
        const [r,e] = await api.post(`/restrito/loja/${lojaId}/subdominio/${dominio}/vincular`)
        return [r,e];
    }


    async mudarStatus(lojaId:number):Promise<[any,AxiosError]>{

        const [r,e] = await api.put(`/restrito/loja/${lojaId}/visibilidade`)
        return [r ? r.data : null,e]
    }

    async salvarAvatar(lojaId:number,file:File){
        const formData = new FormData()
        formData.append("arquivo",file)
        const [r,e] = await api.formData(`/restrito/loja/${lojaId}/avatar`,formData,"PUT")
        return [r ? r.data : null,e]
    }

}