import api from "$lib/api/api";
import query from "$lib/api/query";
import toast from "$lib/utils/toast.svelte";
import type { Axios, AxiosError } from "axios";
import { PUBLIC_BACKEND } from "$env/static/public";
import type { ProdutoVariacaoDto } from "./produto.variacao.dto";

export class ProdutoVariacaoController {

    private idLoja:number=0;
    private idProduto:number=0;

    constructor(idProduto:number,idLoja:number){
        this.idLoja=idLoja
        this.idProduto=idProduto
    }

    async pegar(idVariacao:number):Promise<[any,AxiosError]>{
        return await api.get(`/loja/${this.idLoja}/produto/${this.idProduto}/variacao/${idVariacao}`)
    }


    async listar():Promise<[{data:{resultado:ProdutoVariacaoDto[],total:number}},AxiosError]>{
        return await api.get(`/loja/${this.idLoja}/produto/${this.idProduto}/variacao`)
    }

    async inserirImagem(idVariacao:number,file:File){
        const formData = new FormData()
        formData.append("file",file)
        return await api.formData(`/loja/${this.idLoja}/produto/variacao/${idVariacao}/imagem`,formData,"POST")
    }

    async atualizarImagem(idVariacao:number,file:File){
        const formData = new FormData()
        formData.append("file",file)
        return await api.formData(`/loja/${this.idLoja}/produto/variacao/${idVariacao}/imagem`,formData,"PUT")
    }

    async listarImagens(variacaoId:number){
        return await api.get(`/variacao/${variacaoId}/imagem`)
    }

    pegarImagem(variacaoId:number,imagemId:number){
        return `${PUBLIC_BACKEND}/variacao/${variacaoId}/imagem/${imagemId}`
    }

    async criar(body:{
        nome: string,
        preco: number,
        desconto: number,
        ativo: boolean
    }):Promise<[any,AxiosError]>{
        return await api.post(`/loja/${this.idLoja}/produto/${this.idProduto}/variacao`,body)
    }

    async excluir(variacaoId:number){
        return await api.get(`/loja/${this.idLoja}/produto/${this.idProduto}/variacao/${variacaoId}`)
    }

    async editar(idVariacao:number,body:{
        nome: string,
        preco: number,
        desconto: number,
        ativo: boolean
    }):Promise<[any,AxiosError]>{
        return await api.put(`/loja/${this.idLoja}/produto/${this.idProduto}/variacao/${idVariacao}`,body)
    }

    async gerarVariacoes(){
        return await api.post(`/loja/${this.idLoja}/produto/${this.idProduto}/gerar-variacoes`)
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


}