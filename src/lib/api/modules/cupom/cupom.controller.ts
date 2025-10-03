import api from "$lib/api/api";
import query from "$lib/api/query";

class Cupom {
  async criarCupom(lojaId: number, body:{
    nome: string;
    codigo: string;
    tipoDesconto: 'percentual' | "fixo";
    valorDesconto: number;
    dataInicio: string;
    dataVencimento?: string;
    quantidade: number;
    categoriaId: number | undefined;
    ativo: boolean;
    gastoMinimo?: number;
    limiteDesconto?: number;
}){
    return await api.post(`/restrito/loja/${lojaId}/cupom`, body)
  }

  async listarCupons(lojaId: number, filtros:{
    nome?:string,
    pagina?:number,
    quantidade?:number,
    categoriaId?: string,
    ativo?:boolean | undefined
  }){
    return api.get(`/restrito/loja/${lojaId}/cupom${query.searchInMemoryQuerys(filtros)}`)
  }

  async atualizarCupom(lojaId: number, id: number, body:{
    nome: string;
    codigo: string;
    tipoDesconto: string;
    valorDesconto: number;
    dataInicio: string; 
    dataVencimento: string;
    quantidade: number;
    categoriaId: number;
    ativo: boolean;
    gastoMinimo: number;
    limiteDesconto: number;
  }){
    return api.put(`/restrito/loja/${lojaId}/cupom/${id}`, body)
  }

  async statusCupom(lojaId: number, id: number, body: {
    ativo: boolean
  }){
    return api.put(`/restrito/loja/${lojaId}/cupom/${id}/status`, body)
  }

  async excluirCupom(lojaId: number, id: number){
    return api.delete(`/restrito/loja/${lojaId}/cupom/${id}`)
  }

  async verificarCupom(lojaId:number,codigo:string){
    return api.post(`/l/${lojaId}/cupom/verificar`,{
      codigo:codigo
    })
  }
}

const cupomController = new Cupom()
export default cupomController