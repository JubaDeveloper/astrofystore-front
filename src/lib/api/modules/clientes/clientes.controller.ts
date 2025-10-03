import api from "$lib/api/api"
import query from "$lib/api/query"

export class ClientesController{
    
    idLoja:number=-1
    
    constructor(idLoja:number){
        this.idLoja = idLoja
    }

    async listar(filtros:any){
        return await api.get(`/loja/${this.idLoja}/clientes/listar${query.searchInMemoryQuerys(filtros)}`)
    }
    
    async pegar(idCliente:number){
        return await api.get(`/loja/${this.idLoja}/cliente/${idCliente}/informacoes`)
    }


    async listarPedidos(filtros:any){
        return await api.get(`/loja/${this.idLoja}/clientes/listar${query.searchInMemoryQuerys(filtros)}`)
    }
    


    async relatorioGastos(idCliente:number,filtros:{
        periodo:string
    }){
        return await api.get(`/loja/${this.idLoja}/cliente/${idCliente}/relatorio${query.searchInMemoryQuerys(filtros)}`)
    }

    async relatorioPedidos(idCliente:number,filtros:any){
        return await api.get(`/loja/${this.idLoja}/cliente/${idCliente}/pedidos${query.searchInMemoryQuerys(filtros)}`)
    }
    
}