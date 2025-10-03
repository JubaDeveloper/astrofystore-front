import api from "$lib/api/api"
import query from "$lib/api/query"
import domainManager from "$lib/settings/domain.svelte"

export class DevolucaoClienteController{
    lojaId:number
    constructor(lojaId:number){
        this.lojaId = lojaId
    }
    async listar(filtros:any){
        return await api.get(`/cliente/loja/${this.lojaId}/devolucoes${query.searchInMemoryQuerys(filtros)}`)
    }

    async solicitar(pedidoId:number,itemId:number,body:any){
        return await api.post(`/cliente/loja/${this.lojaId}/pedido/${pedidoId}/devolucao/${itemId}`,body)
    }
}



export class DevolucaoLojistaController{
    lojaId:number   
    constructor(lojaId:number){
        this.lojaId = lojaId
    }
    async listar(filtros:any){
        return await api.get(`/restrito/loja/${this.lojaId}/devolucoes${query.searchInMemoryQuerys(filtros)}`)
    }
    async pegar(id:number){
        return await api.get(`/restrito/loja/${this.lojaId}/devolucoes/${id}`)
    }

    async aprovar(id:number){
        return await api.put(`/restrito/loja/${this.lojaId}/devolucoes/${id}/aprovar`)
    }

    async negar(id:number){
        return await api.put(`/restrito/loja/${this.lojaId}/devolucoes/${id}/negar`)
    }

}

const devolucaoClienteController = new DevolucaoClienteController(domainManager.lojaId!)

export {devolucaoClienteController}