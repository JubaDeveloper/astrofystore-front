import api from "$lib/api/api"
import query from "$lib/api/query"
import domainManager from "$lib/settings/domain.svelte"

export class ComprasController{
    lojaId:number
    constructor(lojaId:number){
        this.lojaId = lojaId
    }
    async listar(filtros:any){
        return await api.get(`/cliente/loja/${this.lojaId}/pedidos/compras/listar${query.searchInMemoryQuerys(filtros ?? {})}`)
    }
    async pegar(pedidoId:number){
        return await api.get(`/cliente/loja/${this.lojaId}/pedidos/compras/${pedidoId}`)
    }
    async revelarChave(pedidoId:number,itemId:number){
        return await api.get(`/cliente/loja/${this.lojaId}/pedidos/compras/${pedidoId}/itens/${itemId}/visualizar`)
    }
}

const comprasController = new ComprasController(domainManager.lojaId!)
export {comprasController}