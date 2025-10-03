import api from "$lib/api/api"
import type { PagamentoBodyDto } from "./pagamento.dto"

class Pagamento {
  async redirecionamentoMercadoPago(idLoja:number){
    return api.get(`/restrito/loja/${idLoja}/integracao/mercado-pago/link`)
  }

  async statusMercadoPago(idLoja:number){
    return api.get(`/restrito/loja/${idLoja}/integracao/mercado-pago/status`)
  }

  async pegarTaxas(idLoja:number){
    return api.get(`/restrito/loja/${idLoja}/integracao/configuracao/taxas`)
  }

  async statusStripe(idLoja:number){
    return api.get(`/restrito/loja/${idLoja}/integracao/stripe/status`)
  }

  async redirecionamentoStripe(idLoja:number, urlRecarregamento:string, urlRetorno:string){
    return api.get(`/restrito/loja/${idLoja}/integracao/stripe/link?urlRecarregamento=${urlRecarregamento}&urlRetorno=${urlRetorno}`)
  }
  async processarPagamento(pedidoId:number,body:PagamentoBodyDto){
    return api.post(`/pagamento/pedido/${pedidoId}`,body)

  }
}

const pagamentoController = new Pagamento()
export default pagamentoController