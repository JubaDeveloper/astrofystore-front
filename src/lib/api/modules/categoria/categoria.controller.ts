import api from "$lib/api/api";
import query from "$lib/api/query";

class CategoriaController{

    async verificarSlug(slug:string){
        const [r,e] = await api.get(`/categoria/verificar-slug/${slug}`)
        return [r ? r.data : null,e]
    }

    async pegar(idLoja:number,idCategoria:number):Promise<any> {
      const [r,e] = await api.post(`/loja/${idLoja}/categoria/${idCategoria}`)
      return [r,e]
    }

    async ordenar(lojaId:number,idCategoria:number,ordem:number){
      const [r,e] = await api.put(`/loja/${lojaId}/categoria/${idCategoria}/ordenar${query.searchInMemoryQuerys({
        ordem
      })}`)
      return [r,e]
    }
    async criar(idLoja:number,body:any):Promise<any> {
      const [r,e] = await api.post(`/loja/${idLoja}/categoria`, body)
      return [r,e]
    }
    async editar(idLoja:number,categoriaId:number,body:any):Promise<any> {
      const [r,e] = await api.put(`/loja/${idLoja}/categoria/${categoriaId}`, body)
      return [r,e]
    }

    async deletar(idLoja:number,categoriaId:number){
      const [r,e] = await api.delete(`/loja/${idLoja}/categoria/${categoriaId}`)
      return [r,e]
    }

    async listar(idLoja:number,filtros:{
      pesquisa?:string,
      quantidade?:number,
      pagina?:number
    }){
      const [r,e] = await api.get(`/loja/${idLoja}/categoria${query.searchInMemoryQuerys(filtros)}`)
      return [r ? r.data: null,e]
    }

}

const categoriaController = new CategoriaController()
export default categoriaController