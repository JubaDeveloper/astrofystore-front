import api from "$lib/api/api"

export class EstoqueItemController{


    private idEstoque:number=0
    private idLoja:number=0

    constructor(idEstoque:number,idLoja:number){
        this.idEstoque = idEstoque
        this.idLoja =idLoja
    }

    async criar(body:{conteudo:string}){
        return await api.post(`/loja/${this.idLoja}/estoque/${this.idEstoque}/item`,body)
    }

    async editar(idItem:number,body:{conteudo:string}){
        return await api.put(`/loja/${this.idLoja}/estoque/${this.idEstoque}/item/${idItem}`,body)
    }
    async listar(){
        return await api.get(`/loja/${this.idLoja}/estoque/${this.idEstoque}/item`)
    }
    async deletar(idItem:number){
        return await api.delete(`/loja/${this.idLoja}/estoque/${this.idEstoque}/item/${idItem}`)
    }
    async deletarTodos(){
        return await api.delete(`/loja/${this.idLoja}/estoque/${this.idEstoque}/item`)
    }
    

}