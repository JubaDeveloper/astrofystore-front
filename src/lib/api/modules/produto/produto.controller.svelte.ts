import api from "$lib/api/api";
import query from "$lib/api/query";
import toast from "$lib/utils/toast.svelte";
import type { Axios, AxiosError } from "axios";
import type { FiltrosListarProdutos, Produto, ProdutosForm } from "./produto.dto.svelte";
import { PUBLIC_BACKEND } from "$env/static/public";

export class ProdutoController {

  // async listarProdutos(idLoja:number,filtros:FiltrosListarProdutos):Promise<[Produto[],AxiosError]>{
  //   const [res, err] = await api.get(`/loja/${idLoja}/produto${query.searchInMemoryQuerys(filtros)}`)
  //   return [res ? res.data : null, err]
  // }
  async pegar(idLoja:number,idProduto:number):Promise<[Produto,AxiosError]>{
    const [res, err] = await api.get(`/loja/${idLoja}/produto/${idProduto}`)
    return [res ? res.data : null, err] 
  }

  async listarImagens(idProduto:number):Promise<[any,AxiosError]>{
    const [res, err] = await api.get(`/produto/${idProduto}/imagens`)
    return [res ? res.data : null, err] 
  }


  pegarImagem(idProduto:number,imagemId:number):string{
    return `${PUBLIC_BACKEND}/produto/${idProduto}/imagem/${imagemId}`
  }

  async criar(body:ProdutosForm,lojaId:number):Promise<[Produto,AxiosError]> {
    const [res, err] = await api.post(`/loja/${lojaId}/produto`, body)
    return [res ? res.data : null, err]
  }

  async atribuirImagem(idLoja:number,produtoId:number,file:File){
    const formData = new FormData()
    formData.append("file",file)
    const [res, err] = await api.formData(`/loja/${idLoja}/produto/${produtoId}/imagens`,formData,"POST")
    return [res, err]  
  }


  async alterarOrdemImagens(idLoja:number,produtoId:number,idsImagens:number[] | string[]){
    const ids = idsImagens.map(id => Number(id)); // conversão segura
    const [res, err] = await api.put(`/loja/${idLoja}/produto/${produtoId}/imagens/ordem`,{
      idsImagens:ids
    })
    return [res, err]  
  }

  async deletarImagens(idLoja:number,produtoId:number,idsImagens:number[] | string[]){
    const ids = idsImagens.map(id => Number(id)); // conversão segura
    const [res, err] = await api.delete(`/loja/${idLoja}/produto/${produtoId}/imagens`,{
      idsImagens:ids
    })
    return [res, err]  
  }

  async atualizar(idLoja:number,produtoId:number, body:ProdutosForm):Promise<any> {
    const [res, err] = await api.put(`/loja/${idLoja}/produto/${produtoId}`, body)
    return [res, err]
  }

  async deletar(idLoja:number,produtoId:number){
    const [res, err] = await api.delete(`/loja/${idLoja}/produto/${produtoId}`)
    return [res, err]
  }


  async listarProdutos(idLoja:number,filtros:{
    pesquisa?:string,
    pagina?:number,
    quantidade?:number,
    categoriaId?: string
  }):Promise<any>{
    const [res,err] = await api.get(`loja/${idLoja}/produto${query.searchInMemoryQuerys(filtros)}`)
    if(err) return toast.error('Mensagem do sistema.', err.message)
    return [res, err]
  }

  async atribuirAtributo(idLoja:number,produtoId:number,body:{
    nome:string,
    valores:string[]
  }){
    return await api.post(`/loja/${idLoja}/produto/${produtoId}/atributo`,body)
  }

  async editarAtributo(idLoja:number,produtoId:number,idAtributo:number,body:{
    nome:string,
    valores:string[]
  }){
    return await api.put(`/loja/${idLoja}/produto/${produtoId}/atributo/${idAtributo}`,body)
  }

  async listarAtributos(idLoja:number,produtoId:number):Promise<[{
    data:{
      resultado:{
        id:number,  
        nome:string,
        valores:{
          id:number,
          valor:string,
        }[]
      }[]
    }},AxiosError]>{
    return await api.get(`/loja/${idLoja}/produto/${produtoId}/atributo`)
  }

  async deletarAtributo(idLoja:number,produtoId:number,idAtributo:number){
    return await api.delete(`/loja/${idLoja}/produto/${produtoId}/atributo/${idAtributo}`)
  }


}