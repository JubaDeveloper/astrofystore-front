import api from "$lib/api/api"
import type { AxiosError } from "axios"
import type { ComentarioPostDto } from "./avaliacao.dto"

export class AvaliacaoController{
    lojaId:number=1
    constructor(lojaId:number){
        this.lojaId=lojaId
    }

    async listar(produtoId:number):Promise<[any,AxiosError]>{
        return await api.get(`/l/${this.lojaId}/produto/${produtoId}/avaliacoes/listar`)
    }

    async buscar(itemPedidoId:number):Promise<[any,AxiosError]>{
        return await api.get(`/loja/${this.lojaId}/itemPedido/${itemPedidoId}/avaliacoes`)
    }

    async avaliar(itemPedidoId:number,body:ComentarioPostDto){
        return await api.post(`/loja/${this.lojaId}/itemPedido/${itemPedidoId}/avaliacoes`,body)
    }


    async avaliarNovamente(itemPedidoId:number,body:ComentarioPostDto){
        return await api.put(`/loja/${this.lojaId}/itemPedido/${itemPedidoId}/avaliacoes`,body)
    }
}