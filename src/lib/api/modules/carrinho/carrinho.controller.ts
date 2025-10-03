import api from "$lib/api/api"
import type { AxiosError } from "axios"
import type { CarrinhoResponseDto, ItemCarrinhoDto, ItemCarrinhoPutDto } from "./carrinho.dto"

export class CarrinhoController{

    lojaId:number = 0
    

    constructor(lojaId:number){
        this.lojaId = lojaId
    }

    async listarLogado():Promise<[CarrinhoResponseDto,AxiosError]>{  
        return await api.get(`/loja/${this.lojaId}/carrinho`)
    }

    async listar(uuid:string):Promise<[CarrinhoResponseDto,AxiosError]>{
        return await api.get(`/loja/${this.lojaId}/carrinho/${uuid}`)
    }

    async adicionarItem(body:ItemCarrinhoPutDto):Promise<[CarrinhoResponseDto,AxiosError]>{
        const newBody = body
        if(!body.variacaoProdutoId) delete newBody.variacaoProdutoId
        else delete newBody.produtoId
        return await api.put(`/loja/${this.lojaId}/carrinho/adicionar-item`,body)
    }

    async decrementarItem(uuid:string,itemId:number):Promise<[CarrinhoResponseDto,AxiosError]>{
        return await api.put(`/loja/${this.lojaId}/carrinho/${uuid}/decrementar-item/${itemId}`)
    }

    async removerItem(uuid:string,itemId:number):Promise<[CarrinhoResponseDto,AxiosError]>{
        return await api.put(`/loja/${this.lojaId}/carrinho/${uuid}/remover-item/${itemId}`)
    }

    async limpar(uuid:string):Promise<[any,AxiosError]>{
        return await api.put(`/loja/${this.lojaId}/carrinho/${uuid}/limpar`)
    }

    async finalizar(body:{
        uuid?:string,
        cupom?:string,
    }):Promise<[any,AxiosError]>{
        return await api.put(`/loja/${this.lojaId}/carrinho/${body.uuid ? body.uuid : "whatever"}/finalizar`,{
            cupom:body.cupom
        })
    }

}