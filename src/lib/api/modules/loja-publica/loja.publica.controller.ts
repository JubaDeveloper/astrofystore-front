import query from "$lib/api/query";
import api from "$lib/api/api";

import type { Produto, ProdutoDetalhado } from "../produto/produto.dto.svelte";
import type { FiltrosLojaPublica } from "./loja.publica.dto";
import type { AxiosError } from "axios";
import { dev } from "$app/environment";

export class LojaPublicaController {
    async listarProdutos(dominio:string,filtros:FiltrosLojaPublica):Promise<[any,AxiosError]>{
        return await api.get(`/l/${dominio}/produto${query.searchInMemoryQuerys(filtros)}`)
    }
    async pegarProduto(dominio:string,slug:string):Promise<[any,AxiosError]>{
        return await api.get(`/l/${dominio}/produto/${slug}`)
    }
    async listarBanners(dominio:string):Promise<[any,AxiosError]> {
        return await api.get(`/l/${dominio}/banners`)
    }
    async imgsProduto(devKey: string, produtoId:number){
        return api.get(devKey + `/produto/${produtoId}/imagens`)
    }

    async listarAvaliacoes(lojaId: number | undefined, produtoId: number){
        return api.get(`/l/${lojaId}/produto/${produtoId}/avaliacoes/listar`)
    }
    async avaliarProduto(lojaId:number, produtoId:number, pedidoId:number){
        return api.post(`/loja/${lojaId}/produto/${produtoId}/avaliacoes/${pedidoId}`)
    }
}