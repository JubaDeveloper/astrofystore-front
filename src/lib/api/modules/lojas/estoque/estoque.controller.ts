import api from "$lib/api/api";
import query from "$lib/api/query";

export class EstoqueController{

    private idLoja:number=0;
    private idProduto:number=0;

    constructor(idLoja:number,idProduto:number){
        this.idLoja=idLoja
        this.idProduto=idProduto
    }

    
    async criar(body:{
        tipoEstoque:"lista" | "mensagem",
        mensagem:string,
        estoqueBaixo:number
    }){
        return await api.post(`/loja/${this.idLoja}/estoque/produto/${this.idProduto}`,body)
    }



    async editar(idEstoque:number,body:{
        tipoEstoque:"lista" | "mensagem",
        mensagem?:string,
        estoqueBaixo:number
    }){
        return await api.patch(`/loja/${this.idLoja}/estoque/${idEstoque}`,body)
    }

    async listar(idEstoque:number){
        return await api.get(`/loja/${this.idLoja}/estoque/${idEstoque}`)
    }

    async listarLoja(filtros:{
        pagina:number,
        quantidade:number,
        termo:string
    }){
        return await api.get(`/loja/${this.idLoja}/estoque${query.searchInMemoryQuerys(filtros)}`)
    }
    
    async deletar(idEstoque:number){
        return await api.delete(`/loja/${this.idLoja}/estoque/${idEstoque}`)
    }

    async criarItens(idLoja:string,idEstoque:number, body:{conteudo:string}){
        return await api.post(`/loja/${idLoja}/estoque/${idEstoque}/item`,body)
    }
    

}