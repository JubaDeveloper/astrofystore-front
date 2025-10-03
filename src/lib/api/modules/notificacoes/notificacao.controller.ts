import api from "$lib/api/api";
import query from "$lib/api/query";

class Notificacao {
  async listar(filtros:{
    pagina?: string,
    quantidade?: string,
    tipo?:string,
    pesquisa?:string,
    status?:string
  }){
    return api.get(`/notificacao${query.searchInMemoryQuerys(filtros)}`)
  }

  async marcarTodas(){
    return api.put(`/notificacao/todas-lidas`)
  }

  async marcarLida(idNotificacao:number){
    return api.put(`/notificacao/${idNotificacao}/lida`)
  }

  async marcarNaoLida(idNotificacao:number){
    return api.put(`/notificacao/${idNotificacao}/nao-lida`)
  }
}

const notificacaoController = new Notificacao()
export default notificacaoController