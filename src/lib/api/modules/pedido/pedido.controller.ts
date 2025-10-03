import api from "$lib/api/api";

export class PedidoController{
    constructor(){

    }

    async listar(){
        return await api.get("/pedido/listar-pedidos")
    }

    async pegar(pedidoId:number){
        return await api.get(`/pedido/buscar-pedido?idPedido=${pedidoId}`)
    }
    async pegarPublico(pedidoId:number){
        return await api.get(`/pagamento/pedido/${pedidoId}/status`)
    }

    async criar(body:any){
        return await api.post("/pedido",body)
    }
}
