import api from "$lib/api/api";
import type { AxiosError } from "axios";

export class LojaImagensController{



    async salvarCapa(){

    }

    async listarBanner(lojaId:number){
        const [r,e] = await api.get(`/restrito/loja/${lojaId}/imagem/banner`)
        return [r ? r.data : null,e]
    }

    async editarBanner(lojaId:number,bannerId:number,categoriaId:number | undefined,produtoId:number | undefined){
        let uri = ""
        if(categoriaId){
            uri = `/categoria/${categoriaId}`    
        }
        if(produtoId){
            uri = `/produto/${produtoId}`
        }
        const [r,e] = await api.put(`/restrito/loja/${lojaId}/imagem/banner/${bannerId}/uri?uri=${uri}`)
        return [r ? r.data : null,e]
    }

    async salvarBanner(lojaId:number,file:File,categoriaId:number | undefined,produtoId:number | undefined){
        const formData = new FormData()
        formData.append("file",file)
        let uri = ""
        if(categoriaId){
            uri = `/categoria/${categoriaId}`    
        }
        if(produtoId){
            uri = `/produto/${produtoId}`
        }
        const [r,e] = await api.formData(`/restrito/loja/${lojaId}/imagem/banner?uri=${uri}`,formData,"PUT")
        return [r ? r.data : null,e]
    }

    async setarOrdemBanner(lojaId:number,bannerId:number,ordem:number): Promise<[any,AxiosError]>{
        const [r,e] = await api.put(`/restrito/loja/${lojaId}/imagem/banner/${bannerId}/ordenar?ordem=${ordem}`)
        return [r ? r.data : null, e]
    }

    async deletarBanner(lojaId:number,bannerId:number){
        const [r,e] = await api.delete(`/restrito/loja/${lojaId}/imagem/banner/${bannerId}`)
        return [r ? r.data : null,e]
    }

}